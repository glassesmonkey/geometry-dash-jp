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
      const maxChecks = 24;
      let waitTime = 0;
      const checkPrediction = async () => {
        try {
          console.log(`Checking prediction for id: ${id} (attempt ${checkCount + 1}/${maxChecks})`);
          
          // 使用 fetch 调用单独的 API 端点来检查 Redis
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/check-prediction?id=${id}`);
          const result = await response.json();

          console.log(`Result for id ${id}:`, result);

          if (result !== null) {
            sendEvent(result);
            controller.close();
          } else {
            checkCount++;
            waitTime=checkCount*1000;
            if (checkCount < maxChecks) {
              sendEvent({ status: 'processing', message: `Still checking (${checkCount}/${maxChecks})` });
              setTimeout(checkPrediction, waitTime);
            } else {
              sendEvent({ status: 'timeout', message: 'Prediction check timed out' });
              controller.close();
            }
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