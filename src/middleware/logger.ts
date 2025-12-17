import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

const logger = new Logger({ module: 'RequestLogger' });

/**
 * Request logging middleware
 * Logs incoming requests and outgoing responses
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Add request ID to request object for tracing
  (req as any).requestId = requestId;

  // Log incoming request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture the original end function
  const originalEnd = res.end;

  // Override res.end to log response
  res.end = function(chunk?: any, encoding?: any, callback?: any): Response {
    const duration = Date.now() - startTime;
    
    // Log outgoing response
    logger.info('Outgoing response', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    // Call original end function
    return originalEnd.call(this, chunk, encoding, callback) as Response;
  };

  next();
};

/**
 * Error logging middleware
 * Logs errors that occur during request processing
 */
export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req as any).requestId || 'unknown';

  logger.error('Request error', {
    requestId,
    method: req.method,
    url: req.url,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });

  next(err);
};
