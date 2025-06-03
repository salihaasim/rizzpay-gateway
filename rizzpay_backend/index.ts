
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { PayoutQueueService } from './services/PayoutQueueService';
import { RealTimeService } from './services/RealTimeService';

// Route imports
import authRoutes from './routes/authRoutes';
import merchantRoutes from './routes/merchantRoutes';
import payoutRoutes from './routes/payoutRoutes';
import webhookRoutes from './routes/webhookRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  const queueStatus = PayoutQueueService.getQueueStatus();
  const connectedClients = RealTimeService.getConnectedClients();
  
  res.status(200).json({
    status: 'OK',
    message: 'RizzPay Backend API is running',
    timestamp: new Date().toISOString(),
    services: {
      payoutQueue: queueStatus,
      connectedClients: Object.keys(connectedClients).length,
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);

// WebSocket endpoint for real-time updates
app.get('/api/ws/:merchantId', (req, res) => {
  const { merchantId } = req.params;
  
  if (req.headers.upgrade !== 'websocket') {
    return res.status(400).json({
      success: false,
      message: 'Expected WebSocket connection'
    });
  }
  
  // This would be handled by a WebSocket server in production
  res.status(200).json({
    success: true,
    message: 'WebSocket endpoint available',
    merchantId
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 RizzPay Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background services
  console.log('🔄 Starting payout queue processing...');
  PayoutQueueService.startProcessing();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  PayoutQueueService.stopProcessing();
  
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  
  PayoutQueueService.stopProcessing();
  
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

export default app;
