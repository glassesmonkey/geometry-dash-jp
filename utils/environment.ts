export function isTestEnvironment(): boolean {
    return process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_ENV === 'test';
  }