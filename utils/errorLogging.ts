// utils/errorLogging.ts

export async function logError(message: string, details?: any) {
    try {
      const response = await fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          details,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to log error:', await response.text());
      }
    } catch (error) {
      console.error('Error while logging:', error);
    }
  }