import mongoose from 'mongoose';

const walletConnectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, required: true },
    walletAddress: { type: String, required: true },
    capabilities: [{ type: String }],
    status: { type: String, enum: ['connected', 'disconnected'], default: 'connected' }
  },
  { timestamps: true }
);

export const WalletConnection = mongoose.model('WalletConnection', walletConnectionSchema);
