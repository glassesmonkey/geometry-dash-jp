import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credit: true }
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // console.log('userid=',userId,'User credits from database:', user.credits); 
      return res.status(200).json({ credits: user.credit });
    } catch (error) {
      console.error('Error fetching user credits:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { action } = req.body;

    try {
      if (action === 'deduct') {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { credit: true }
        });

        if (!user || user.credit < 1) {
          return res.status(400).json({ error: 'Insufficient credits' });
        }

        await prisma.user.update({
          where: { id: userId },
          data: { credit: { decrement: 1 } }
        });

        await prisma.transaction.create({
          data: {
            userId,
            amount: -1,
            description: 'Video generation credit deduction'
          }
        });

        return res.status(200).json({ message: 'Credit deducted successfully' });
      } else if (action === 'refund') {
        await prisma.user.update({
          where: { id: userId },
          data: { credit: { increment: 1 } }
        });

        await prisma.transaction.create({
          data: {
            userId,
            amount: 1,
            description: 'Video generation credit refund'
          }
        });

        return res.status(200).json({ message: 'Credit refunded successfully' });
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error processing credits:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}