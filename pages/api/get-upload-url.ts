// pages/api/get-upload-url.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CF_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CF_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_R2_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
    const command = new PutObjectCommand({
      Bucket: process.env.CF_R2_BUCKET_NAME,
      Key: key,
      ContentType: 'image/jpeg',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.status(200).json({ url, key });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}