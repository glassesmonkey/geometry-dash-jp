import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const generatedImage = await prisma.generatedImage.create({
      data: {
        imageUrl,
        userId: user.id,
      },
    });

    res.status(201).json(generatedImage);
  } catch (error) {
    console.error('Error saving generated image:', error);
    res.status(500).json({ message: 'Error saving generated image' });
  }
}