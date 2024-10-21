import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./auth/[...nextauth]";
import redis from '../../utils/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const session = await getServerSession(req, res, authOptions);
  // if (!session || !session.user) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Valid prediction ID is required' });
  }

  try {
    const result = await redis.get(`prediction:${id}`);
    console.log(`Redis result for id ${id}:`, result);

    if (result === null) {
      return res.status(200).json({ status: 'not_found', message: 'Prediction not found' });
    }

    let parsedResult: any;
    if (typeof result === 'string') {
      try {
        parsedResult = JSON.parse(result);
      } catch (parseError) {
        console.error('Error parsing Redis result:', parseError);
        return res.status(500).json({ status: 'error', message: 'Error parsing prediction data' });
      }
    } else if (typeof result === 'object' && result !== null) {
      parsedResult = result;
    } else {
      console.error('Unexpected result type:', typeof result);
      return res.status(500).json({ status: 'error', message: 'Unexpected prediction data type' });
    }

    return res.status(200).json(parsedResult);
  } catch (error) {
    console.error(`Error checking prediction for id ${id}:`, error);
    return res.status(500).json({ status: 'error', message: 'Error checking prediction', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}