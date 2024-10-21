// pages/api/log-error.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, details, timestamp, url } = req.body;
    
    // Here you would typically save this information to a database
    // For now, we'll just log it to the server console
    console.error('Client Error:', { message, details, timestamp, url });

    // You could also use a service like Sentry, LogRocket, or your own custom solution
    // to store and analyze these errors

    res.status(200).json({ success: true });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}