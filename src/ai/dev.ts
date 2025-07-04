import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-spending-habits.ts';
import '@/ai/flows/send-reminder-email.ts';
import '@/ai/flows/support-chat-flow.ts';
import '@/ai/flows/suggest-category.ts';
import '@/ai/flows/clarify-transaction.ts';
