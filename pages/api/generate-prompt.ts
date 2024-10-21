import { NextApiRequest, NextApiResponse } from 'next';
import Replicate from "replicate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;
  console.log("Received image URL:", imageUrl);

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  console.log("REPLICATE_API_TOKEN is set:", !!process.env.REPLICATE_API_KEY);

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  // 构建 webhook URL
  const webhookUrl = `${process.env.NEXTAUTH_URL}/api/replicate-webhook`;

  try {
    console.log("Starting Replicate prediction...");
    const prediction = await replicate.predictions.create({
      version: "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
      input: {
        image: imageUrl,
        top_p: 1,
        prompt: "Describe the core elements and context of the image in just one sentence.",
        max_tokens: 100,
        temperature: 0.2
      },
      webhook: webhookUrl,
      webhook_events_filter: ["completed"]
    });

    console.log("Replicate prediction started. ID:", prediction.id);

     // 返回预测 ID
     return res.status(202).json({ 
      message: 'Prediction started', 
      id: prediction.id
    });
  } catch (error) {
    console.error('Error starting prediction:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return res.status(500).json({ error: 'Failed to start prediction', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}