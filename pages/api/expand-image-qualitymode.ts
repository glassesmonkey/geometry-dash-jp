import { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';
import { v4 as uuidv4 } from 'uuid';
import redis from '../../utils/redis';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    console.log('Session details:', session);
    return res.status(401).json({ error: 'Unauthorized', details: 'No valid session found' });
  }

  const { imageUrl, prompt, resolution, dragPosition } = req.body;

  if (!imageUrl || !prompt || !resolution || !dragPosition) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  const predictionId = uuidv4();

  // 构建 webhook URL
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/replicate-webhook-image`;

  try {
    // 检查用户的 credit 并预扣除
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, credit: true },
    });

    if (!user || user.credit < 1) {
      return res.status(400).json({ error: 'Insufficient credit' });
    }

    // 预扣除 credit
    await prisma.user.update({
      where: { id: user.id },
      data: { credit: { decrement: 1 } },
    });

    const prediction = await replicate.predictions.create({
      version: "377564d35153c66f8629d9540480813685d114f0552e9a3c9ffe5dd315091e68",
      input: {
        image: imageUrl,
        prompt: prompt.trim(),
        cfg: 4,
        steps: 20,
        top: dragPosition.top,
        left: dragPosition.left,
        right: dragPosition.right,
        bottom: dragPosition.bottom,
        output_format: "png",
        output_quality: 80,
        negative_prompt: "ugly"
      },
      webhook: webhookUrl,
      webhook_events_filter: ["completed"]
    });

    // 将预测 ID 存储在 Redis 中，以便稍后检索
    await redis.set(`prediction:${prediction.id}`, JSON.stringify({
      userEmail: session.user.email,
      status: 'processing',
      replicatePredictionId: prediction.id,
      creditDeducted: true  // 标记 credit 已被扣除
    }));

    // 设置过期时间（例如，1小时）
    await redis.expire(`prediction:${prediction.id}`, 1800);

    return res.status(202).json({ 
      message: 'Image expansion started',
      predictionId: prediction.id
    });
  } catch (error) {
    console.error('Error starting prediction:', error);
    // 如果发生错误，恢复预扣除的 credit
    if (session.user.email) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { credit: { increment: 1 } },
      });
    }
    return res.status(500).json({ error: 'Failed to start image expansion' });
  }
}