import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import Stripe from 'stripe';
import { authOptions } from "./auth/[...nextauth]"
import prisma from '../../lib/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { planId, isSubscription } = req.body;

  // Fetch the user from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let stripeCustomerId = user.stripeCustomerId;

  // If the user doesn't have a Stripe customer ID, create one
  if (!stripeCustomerId) {
    try {
      const customerData: Stripe.CustomerCreateParams = {
        metadata: {
          userId: user.id,
        }
      };

      if (user.email) {
        customerData.email = user.email;
      }

      if (user.name) {
        customerData.name = user.name;
      }

      const customer = await stripe.customers.create(customerData);
      stripeCustomerId = customer.id;

      // Update the user with the new Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      return res.status(500).json({ error: 'Failed to create Stripe customer' });
    }
  }

  let priceId: string;

  switch (planId) {
    case 'base':
      priceId = process.env.NEXT_PUBLIC_PRICE_BASE as string;
      break;
    case 'plus':
      priceId = process.env.NEXT_PUBLIC_PRICE_PLUS as string;
      break;
    case 'advanced':
      priceId = process.env.NEXT_PUBLIC_PRICE_ADVANCED as string;
      break;
    case 'enterprise':
      priceId = process.env.NEXT_PUBLIC_PRICE_ENTERPRISE as string;
      break;
    default:
      return res.status(400).json({ error: 'Invalid plan' });
  }

  const metadata = {
    userId: session.user.id,
    planId,
  };

  const mode = isSubscription ? 'subscription' : 'payment';

  try {
    const checkoutSessionData: Stripe.Checkout.SessionCreateParams = {
      mode,
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      client_reference_id: session.user.id,
      metadata,
    };

    if (mode === 'payment') {
      checkoutSessionData.payment_intent_data = { metadata };
    } else {
      checkoutSessionData.subscription_data = { metadata };
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionData);

    res.status(200).json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}