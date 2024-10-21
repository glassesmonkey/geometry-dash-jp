import { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid prediction ID is required' });
  }

  try {
    const result = await redis.get<string | null>(`prediction:${id}`);

    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        res.status(200).json(parsedResult);
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        res.status(500).json({ error: 'Error parsing prediction result' });
      }
    } else {
      res.status(404).json({ error: 'Prediction result not found' });
    }
  } catch (error) {
    console.error('Error retrieving prediction result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}