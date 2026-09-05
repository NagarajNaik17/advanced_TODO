import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { catchUpResets, initCronJobs } from './services/cronService.js';

// Route Imports
import taskRoutes from './routes/taskRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import statRoutes from './routes/statRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connection
app.use(cors({
  origin: '*', // Allow all origins for local testing, or adjust to Vite dev server port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Mount API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/stats', statRoutes);

// Health check endpoints for uptime & keep-alive monitoring (e.g. UptimeRobot, Render)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Connect database and run jobs
const startServer = async () => {
  await connectDB();
  
  // Perform downtime reset catchup before starting cron loops
  console.log('Starting System Config Check...');
  await catchUpResets();
  
  // Start node-cron scheduling
  initCronJobs();

  app.listen(PORT, () => {
    console.log(`LifeOS API Server is running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start LifeOS Server:', err);
});
