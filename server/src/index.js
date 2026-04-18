import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = Number(process.env.PORT || 5000);
connectDb(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
