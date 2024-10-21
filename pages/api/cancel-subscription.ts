
// pages/api/cancel-subscription.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const session = await getServerSession(req, res, authOptions);
  
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
  
    const { subscriptionId } = req.body;
  
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }
  
    try {
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
  
      res.status(200).json({ 
        message: 'Subscription scheduled for cancellation at the end of the billing period',
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
          currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        }
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }