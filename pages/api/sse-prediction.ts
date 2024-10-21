import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse(JSON.stringify({ error: 'Valid prediction ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let checkCount = 0;
      const maxChecks = 60; // 最多检查60次，总共5分钟

      const checkPrediction = async () => {
        try {
          console.log(`Checking prediction for id: ${id} (attempt ${checkCount + 1}/${maxChecks})`);
          
          // 调用 check-prediction API
          const response = await fetch(`${req.nextUrl.origin}/api/check-prediction-image?id=${id}`);
          const result = await response.json();

          console.log(`Result for id ${id}:`, result);

          if (result.status === 'not_found') {
            sendEvent({ status: 'not_found', message: 'Prediction not found' });
            controller.close();
            return;
          }

          sendEvent(result);
          if (result.status === 'succeeded' || result.status === 'failed') {
            controller.close();
            return;
          }

          checkCount++;
          if (checkCount < maxChecks) {
            sendEvent({ status: 'processing', message: `Still processing (${checkCount}/${maxChecks})` });
            await new Promise(resolve => setTimeout(resolve, 5000)); // 每5秒检查一次
            checkPrediction();
          } else {
            sendEvent({ status: 'timeout', message: 'Prediction check timed out' });
            controller.close();
          }
        } catch (error) {
          console.error(`Error checking prediction for id ${id}:`, error);
          sendEvent({ status: 'error', message: 'Error checking prediction', details: error instanceof Error ? error.message : 'Unknown error' });
          controller.close();
        }
      };

      checkPrediction();
    }
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}