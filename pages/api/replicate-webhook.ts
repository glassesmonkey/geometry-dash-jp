import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';
import Cors from 'cors';

interface PredictionResult {
  id: string;
  status: 'succeeded' | 'failed' | string;
  output?: string | string[];
  error?: string;
}

// 初始化 CORS 中间件
const cors = Cors({
  methods: ['POST'], // 只允许 POST 请求
});

// 辅助函数来运行中间件
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 运行 CORS 中间件
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const predictionResult = req.body as PredictionResult;
  console.log('Webhook received:', JSON.stringify(predictionResult, null, 2));

  if (!predictionResult.id) {
    return res.status(400).json({ error: 'Missing prediction ID' });
  }

  try {
    let redisValue: { status: string; prompt?: string; error?: string };

    switch (predictionResult.status) {
      case 'succeeded':
        const output = predictionResult.output;
        const prompt = Array.isArray(output) ? output.join('') : String(output);
        redisValue = { status: 'succeeded', prompt };
        break;
      case 'failed':
        redisValue = { status: 'failed', error: predictionResult.error || 'Unknown error' };
        break;
      default:
        console.warn(`Received unexpected status: ${predictionResult.status} for ID: ${predictionResult.id}`);
        redisValue = { status: predictionResult.status, error: 'Unexpected status' };
    }

    // 存储结果到 Redis
    await redis.set(`prediction:${predictionResult.id}`, JSON.stringify(redisValue));
    console.log(`Stored prediction result for ID: ${predictionResult.id}`, redisValue);

    // 设置过期时间
    await redis.expire(`prediction:${predictionResult.id}`, 600);

    res.status(200).json({ message: 'Webhook received and processed' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}