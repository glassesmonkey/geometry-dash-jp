import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';
import Cors from 'cors';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../lib/prismadb';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface PredictionResult {
    id: string;
    status: 'processing' | 'succeeded' | 'failed' | string;
    output?: string[];
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

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID_NOS}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID_NOS!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY_NOS!,
    },
});

async function uploadToR2(imageUrl: string): Promise<string> {
    try {
        console.log('Starting R2 upload process for image:', imageUrl);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        const key = `generated-images/${uuidv4()}.png`;
        const bucketName = process.env.R2_BUCKET_NAME_NOS!;

        console.log('Uploading to R2 with key:', key);
        
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: Buffer.from(arrayBuffer),
            ContentType: 'image/png',
        });

        const result = await S3.send(command);
        console.log('R2 upload result:', result);

        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
        console.log('R2 upload successful. Public URL:', publicUrl);
        
        return publicUrl;
    } catch (error) {
        console.error('Error in uploadToR2:', error);
        throw new Error(`Failed to upload image to R2: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

async function saveToDatabase(imageUrl: string, userEmail: string) {
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!user) {
        throw new Error('User not found');
    }

    await prisma.generatedImage.create({
        data: {
            imageUrl,
            userId: user.id,
        },
    });
}

async function restoreCredit(userEmail: string) {
    if (!userEmail) return;

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { credit: { increment: 1 } },
            });
            console.log(`Restored 1 credit for user: ${userEmail}`);
        } else {
            console.error(`User not found for email: ${userEmail}`);
        }
    } catch (error) {
        console.error(`Failed to restore credit for user ${userEmail}:`, error);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 运行 CORS 中间件
    await runMiddleware(req, res, cors);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const predictionResult = req.body as PredictionResult;
    console.log('Image webhook received:', JSON.stringify(predictionResult, null, 2));

    if (!predictionResult.id) {
        return res.status(400).json({ error: 'Missing prediction ID' });
    }
    let userEmail = '';
    try {
        let redisValue: { 
            status: string; 
            output?: string[]; 
            error?: string; 
            userEmail?: string;
            creditDeducted?: boolean;
        };

        
        let creditDeducted = false;

        const existingData = await redis.get(`prediction:${predictionResult.id}`);
        if (existingData) {
            if (typeof existingData === 'string') {
                try {
                    const parsedData = JSON.parse(existingData);
                    userEmail = parsedData.userEmail || '';
                    creditDeducted = parsedData.creditDeducted || false;
                } catch (error) {
                    console.error('Error parsing existing data:', error);
                }
            } else if (typeof existingData === 'object' && existingData !== null) {
                userEmail = (existingData as any).userEmail || '';
                creditDeducted = (existingData as any).creditDeducted || false;
            } else {
                console.error('Unexpected existingData type:', typeof existingData);
            }
        }

        switch (predictionResult.status) {
            case 'processing':
                redisValue = { status: 'processing', userEmail, creditDeducted };
                break;
            case 'succeeded':
                if (predictionResult.output && predictionResult.output.length > 0) {
                    const r2Urls = await Promise.all(predictionResult.output.map(uploadToR2));
                    await Promise.all(r2Urls.map(url => saveToDatabase(url, userEmail)));
                    redisValue = { status: 'succeeded', output: r2Urls, userEmail, creditDeducted };
                } else {
                    redisValue = { status: 'failed', error: 'No output images', userEmail, creditDeducted };
                    await restoreCredit(userEmail);
                }
                break;
            case 'failed':
                redisValue = { status: 'failed', error: predictionResult.error || 'Unknown error', userEmail, creditDeducted };
                await restoreCredit(userEmail);
                break;
            default:
                console.warn(`Received unexpected status: ${predictionResult.status} for ID: ${predictionResult.id}`);
                redisValue = { status: predictionResult.status, error: 'Unexpected status', userEmail, creditDeducted };
                await restoreCredit(userEmail);
        }

        // 存储结果到 Redis
        await redis.set(`prediction:${predictionResult.id}`, JSON.stringify(redisValue));
        console.log(`Stored image prediction result for ID: ${predictionResult.id}`, redisValue);

        // 设置过期时间
        await redis.expire(`prediction:${predictionResult.id}`, 1800);

        res.status(200).json({ message: 'Image webhook received and processed' });
    } catch (error) {
        console.error('Error processing image webhook:', error);
        // 如果处理过程中发生错误，尝试恢复 credit
        if (userEmail) {
            await restoreCredit(userEmail);
        }
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}