import pino from 'pino';

/**
 * Logger configuration based on environment
 */
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Create and configure Pino logger
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  
  // Use pino-pretty in development for human-readable logs
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '{levelLabel} - {msg}',
        },
      }
    : undefined,

  // Base configuration
  base: {
    env: process.env.NODE_ENV || 'development',
  },

  // Timestamp format
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Serializers for different types of objects
  serializers: {
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
      headers: res.getHeaders(),
    }),
    err: pino.stdSerializers.err,
  },
});

/**
 * Create child logger with additional context
 * @param context - Additional context to include in logs
 */
export function createLogger(context: Record<string, any>) {
  return logger.child(context);
}

/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Logger utility class with convenience methods
 */
export class Logger {
  private logger: pino.Logger;

  constructor(context?: Record<string, any>) {
    this.logger = context ? logger.child(context) : logger;
  }

  /**
   * Log trace message
   */
  trace(message: string, data?: any): void {
    this.logger.trace(data, message);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.logger.debug(data, message);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.logger.info(data, message);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.logger.warn(data, message);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any): void {
    if (error instanceof Error) {
      this.logger.error({ err: error }, message);
    } else {
      this.logger.error(error, message);
    }
  }

  /**
   * Log fatal message
   */
  fatal(message: string, error?: Error | any): void {
    if (error instanceof Error) {
      this.logger.fatal({ err: error }, message);
    } else {
      this.logger.fatal(error, message);
    }
  }

  /**
   * Create child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    const childLogger = new Logger();
    childLogger.logger = this.logger.child(context);
    return childLogger;
  }
}

// Export default logger instance
export default logger;
