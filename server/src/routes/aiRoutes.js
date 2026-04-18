import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Transaction } from '../models/Transaction.js';
import { Subscription } from '../models/Subscription.js';
import { User } from '../models/User.js';
import { generateFinanceAdvice, chatWithFinanceAgent } from '../services/openaiService.js';

const router = express.Router();
router.use(requireAuth);

router.get('/advice', async (req, res) => {
  const [profile, transactions, subscriptions] = await Promise.all([
    User.findById(req.user.id).select('name email currency'),
    Transaction.find({ userId: req.user.id }).sort({ date: -1 }).limit(50),
    Subscription.find({ userId: req.user.id, status: 'active' })
  ]);

  const advice = await generateFinanceAdvice({ profile, transactions, subscriptions });
  return res.json({ advice });
});

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  const [transactions, subscriptions] = await Promise.all([
    Transaction.find({ userId: req.user.id }).sort({ date: -1 }).limit(20),
    Subscription.find({ userId: req.user.id, status: 'active' })
  ]);

  const reply = await chatWithFinanceAgent({
    message,
    context: { transactions, subscriptions, now: new Date().toISOString() }
  });

  return res.json({ reply });
});

router.post('/automations/simulate-wallet-action', async (req, res) => {
  const { action, amount, target } = req.body;
  return res.json({
    status: 'queued',
    action,
    amount,
    target,
    note: 'Simulation only. Add provider SDK + signed transaction flow to execute real payments safely.'
  });
});

export default router;
