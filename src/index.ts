import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import { config } from './config/env';
import sql from './config/database';
import userRoutes from './routes/users';
import productRoutes from './routes/products';

const app: Express = express();
const port = config.server.port;
const host = config.server.host;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    const result = await sql`SELECT version()`;
    const dbVersion = (result && result[0] && (result[0] as any).version) || 'unknown';

    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        version: dbVersion,
      },
      environment: config.server.nodeEnv,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, host, () => {
  console.log(`\n🚀 Server running at http://${host}:${port}`);
  console.log(`📊 Health check: http://${host}:${port}/health`);
  console.log(`👥 User routes: http://${host}:${port}/users`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}\n`);
});
