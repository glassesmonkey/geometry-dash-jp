import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../lib/prismadb';

// Define the type for the GeneratedImage
type GeneratedImage = {
  imageUrl: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [images, totalCount] = await Promise.all([
      prisma.generatedImage.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: { imageUrl: true },
      }) as Promise<GeneratedImage[]>,
      prisma.generatedImage.count({
        where: { userId: user.id },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      images: images.map((img: GeneratedImage) => img.imageUrl),
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ message: 'Error fetching user images' });
  }
}