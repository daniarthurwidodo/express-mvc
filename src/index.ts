import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`👋 Hello API: http://localhost:${PORT}/api/hello`);
  console.log(`🌍 Hello Random: http://localhost:${PORT}/api/hello/random`);
  console.log(`🗣️  Hello Languages: http://localhost:${PORT}/api/hello/languages`);
});

export default app;
