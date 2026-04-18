import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    currency: { type: String, default: 'USD' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
