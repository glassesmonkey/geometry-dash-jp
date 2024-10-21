import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from '../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { imageUrl, prompt, resolution, direction, amount } = req.body;

  if (!imageUrl || !prompt || !resolution || !direction || !amount) {
    console.log("Missing required parameters");
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const [width, height] = resolution.split('x').map(Number);

  try {
    // Check user credit
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { credit: true },
    });

    if (!user || user.credit < amount) {
      return res.status(400).json({ error: 'Insufficient credit' });
    }

    const apiKey = process.env.PICSART_KEY;
    console.log("PICSART_KEY is set:", !!apiKey);

    const formData = new FormData();
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('direction', direction);
    formData.append('count', amount.toString());
    formData.append('format', 'JPG');
    formData.append('mode', 'sync');
    formData.append('image_url', imageUrl);
    formData.append('prompt', prompt);
    formData.append('negative_prompt', "Chinese characters,characters,subtitling,letter,word,label,text,watermark,artist logo,NSFW,nude,nipples,bad anatomy,multiple limbs,floating limbs,disconnected limbs,fused limbs,malformed hands,malformed feet");

    const response = await fetch('https://genai-api.picsart.io/v1/painting/expand', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Picsart-Api-Key': apiKey as string,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    if (data.data && Array.isArray(data.data)) {
      const expandedImages = data.data.filter((item: any) => item.url && item.id);
      if (expandedImages.length > 0) {
        // Deduct credit
        await prisma.user.update({
          where: { email: session.user.email },
          data: { credit: { decrement: amount } },
        });

        console.log("Successful expansion. Returning URLs.");
        return res.status(200).json({ data: expandedImages });
      }
    }
    
    console.error('Unexpected API response structure:', data);
    return res.status(500).json({ error: 'Unexpected API response structure' });
  } catch (error: any) {
    console.error('Error expanding image:', error);
    console.error('Error details:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to expand image', 
      details: error.response?.data || error.message 
    });
  }
}