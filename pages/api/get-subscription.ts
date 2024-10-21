// pages/api/get-subscriptions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.stripeCustomerId) {
    return res.status(404).json({ error: 'Stripe customer not found' });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active', // Only fetch active subscriptions
      expand: ['data.items.data.price'],
    });

    const subscriptionData = await Promise.all(subscriptions.data.map(async (subscription) => {
      const subscriptionItem = subscription.items.data[0];
      const price = subscriptionItem.price as Stripe.Price;
      
      // Fetch product separately
      const product = await stripe.products.retrieve(price.product as string);

      return {
        id: subscription.id,
        status: subscription.status,
        plan: product.name,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        priceId: price.id,
        amount: price.unit_amount,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        //credits: parseInt(product.metadata.credits || '0', 10),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      };
    }));

    res.status(200).json({ subscriptions: subscriptionData });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
}