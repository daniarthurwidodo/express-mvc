import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { requestLogger, errorLogger } from './middleware/logger';
import { Logger } from './utils/logger';
import { testConnection, closeConnection } from './config/database';

const logger = new Logger({ module: 'Server' });
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Express TypeScript MVC Server is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      hello: '/api/hello',
      helloPersonalized: '/api/hello/personalized/:name',
      helloRandom: '/api/hello/random',
      helloLanguages: '/api/hello/languages'
    }
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use(routes);

// Error handling middleware
app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

// Start server
let server: Server;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    logger.info('✅ Database connected successfully');

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📍 Health check: http://localhost:${PORT}/health`);
      logger.info(`👥 Users API: http://localhost:${PORT}/api/users`);
      logger.info(`👋 Hello API: http://localhost:${PORT}/api/hello`);
      logger.info(`🌍 Hello Random: http://localhost:${PORT}/api/hello/random`);
      logger.info(`🗣️  Hello Languages: http://localhost:${PORT}/api/hello/languages`);
      logger.info('Server started successfully');
    });
  } catch (error) {
    logger.fatal('Failed to start server', error as Error);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful shutdown handler
 * Handles SIGTERM and SIGINT signals for clean shutdown
 */
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      // Close database connection
      await closeConnection();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection', error as Error);
    }
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.fatal('Uncaught exception', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.fatal('Unhandled rejection', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

export default app;
