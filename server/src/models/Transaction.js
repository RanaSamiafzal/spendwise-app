import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    source: { type: String, default: 'manual' }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
