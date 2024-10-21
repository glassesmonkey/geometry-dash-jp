// pages/api/webhook.ts
import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prismadb';
//stripe web hook
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateUserCredits(userId: string, planId: string, stripeEventId: string) {
  const existingTransaction = await prisma.transaction.findUnique({
    where: { stripeEventId },
  });

  if (existingTransaction) {
    console.log(`Event ${stripeEventId} has already been processed. Skipping.`);
    return;
  }

  let creditsToAdd = 0;

  switch (planId) {
    case 'base':
      creditsToAdd = 100;
      break;
    case 'plus':
      creditsToAdd = 300;
      break;
    case 'advanced':
      creditsToAdd = 1000;
      break;
    case 'enterprise':
      creditsToAdd = 6000;
      break;
    default:
      console.error(`Unknown plan: ${planId}`);
      return;
  }

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId },
        data: { credit: { increment: creditsToAdd } },
      });

      await prisma.transaction.create({
        data: {
          userId,
          amount: creditsToAdd,
          description: `Credits added for plan: ${planId}`,
          stripeEventId,
        },
      });
    });

    console.log(`Added ${creditsToAdd} credits to user ${userId} for plan ${planId}`);
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.mode === 'payment') {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const paymentIntentId = session.payment_intent as string;

    if (!userId || !planId || !paymentIntentId) {
      console.error('Missing required metadata in checkout session', session.id);
      return;
    }

    await updateUserCredits(userId, planId, paymentIntentId);
  } else if (session.mode === 'subscription') {
    console.log('Subscription created, waiting for invoice payment', session.id);
  }
}

async function handleInvoice(invoice: Stripe.Invoice) {
  if (invoice.paid) {
    const userId = invoice.subscription_details?.metadata?.userId;
    const planId = invoice.subscription_details?.metadata?.planId;

    if (!userId || !planId) {
      console.error('Missing required metadata in invoice', invoice.id);
      return;
    }

    await updateUserCredits(userId, planId, invoice.id);
  } else {
    console.log(`Invoice ${invoice.id} is not paid. Status: ${invoice.status}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Error verifying webhook:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log(`Received event type: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoice(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}