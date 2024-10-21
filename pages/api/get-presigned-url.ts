import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//tranformer image to r2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID_NOS}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID_NOS!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY_NOS!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filename = `expanded-${Date.now()}.jpg`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME_NOS,
      Key: filename,
      ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.status(200).json({ 
      url: signedUrl, 
      key: filename,
      publicUrl: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL_NOS}/${filename}`
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
}