import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Subscription } from '../models/Subscription.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.user.id }).sort({ renewalDate: 1 });
  return res.json({ subscriptions });
});

router.post('/', async (req, res) => {
  const subscription = await Subscription.create({ ...req.body, userId: req.user.id });
  return res.status(201).json({ subscription });
});

router.get('/insights', async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.user.id, status: 'active' });
  const monthly = subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount);
  }, 0);

  const upcomingRenewals = subscriptions
    .filter((sub) => new Date(sub.renewalDate).getTime() - Date.now() <= 1000 * 60 * 60 * 24 * 30)
    .map((sub) => ({ id: sub._id, name: sub.name, renewalDate: sub.renewalDate, amount: sub.amount }));

  return res.json({ monthlyBurn: Number(monthly.toFixed(2)), upcomingRenewals });
});

export default router;
