import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Transaction } from '../models/Transaction.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 }).limit(200);
  return res.json({ transactions });
});

router.post('/', async (req, res) => {
  const payload = { ...req.body, userId: req.user.id };
  const transaction = await Transaction.create(payload);
  return res.status(201).json({ transaction });
});

router.get('/summary/monthly', async (req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const transactions = await Transaction.find({ userId: req.user.id, date: { $gte: start } });
  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') acc.income += tx.amount;
      else acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  return res.json({ ...totals, savings: totals.income - totals.expense });
});

export default router;
