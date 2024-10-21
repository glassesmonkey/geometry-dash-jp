// customLogger.ts

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface Logger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

const isProduction = process.env.NODE_ENV === 'production';

const createLogger = (level: LogLevel): ((...args: any[]) => void) => {
  if (level === 'error' || !isProduction) {
    return console[level];
  }
  return () => {};
};

const logger: Logger = {
  log: createLogger('log'),
  warn: createLogger('warn'),
  error: createLogger('error'),
  info: createLogger('info'),
  debug: createLogger('debug'),
};

export default logger;
