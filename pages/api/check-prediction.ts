import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';

interface PredictionResult {
  status: string;
  prompt?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid prediction ID is required' });
  }

  try {
    const result = await redis.get(`prediction:${id}`);
    
    console.log('Raw result from Redis:', result);
    console.log('Type of result:', typeof result);

    if (result === null) {
      return res.status(200).json(null);
    }

    let predictionResult: PredictionResult;

    if (typeof result === 'string') {
      try {
        predictionResult = JSON.parse(result);
      } catch (parseError) {
        console.error(`Error parsing Redis result for id ${id}:`, parseError);
        return res.status(500).json({ error: 'Error parsing stored data' });
      }
    } else if (typeof result === 'object' && result !== null) {
      predictionResult = result as PredictionResult;
    } else {
      console.error(`Unexpected result type for id ${id}:`, typeof result);
      return res.status(500).json({ error: 'Unexpected result type from Redis' });
    }

    // At this point, predictionResult should be an object
    if (typeof predictionResult === 'object' && predictionResult !== null) {
      return res.status(200).json(predictionResult);
    } else {
      console.error(`Unexpected parsed result for id ${id}:`, predictionResult);
      return res.status(500).json({ error: 'Unexpected data structure from Redis' });
    }

  } catch (error) {
    console.error(`Error checking prediction for id ${id}:`, error);
    return res.status(500).json({ error: 'Error checking prediction' });
  }
}