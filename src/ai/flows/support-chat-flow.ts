'use server';
/**
 * @fileOverview An AI support agent for the SpendWise application.
 *
 * - supportChat - A function that provides answers to user questions about the app.
 * - SupportChatInput - The input type for the supportChat function.
 * - SupportChatOutput - The return type for the supportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatInputSchema = z.object({
  query: z.string().describe('The user\'s question about the application.'),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response to the user\'s query.'),
});
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {schema: SupportChatInputSchema},
  output: {schema: SupportChatOutputSchema},
  prompt: `You are a friendly and helpful support agent for the "SpendWise" application.

SpendWise is a personal finance app with the following features:
- Dashboard: An overview of finances, including balance, recent transactions, spending charts, and budget goals.
- Transaction Input: Users can manually add income and expense transactions and assign them to categories.
- Categories: Users can create custom spending categories.
- Budgeting: Users can set monthly budgets for different categories and track their progress.
- Spending Analysis: An AI tool can analyze spending habits and suggest savings.
- Monthly Records: A page that shows a detailed, month-by-month table of all transactions.
- Profile: Users can manage their username, email, and preferred currency.
- Currency: Supports multiple world currencies.
- Reminders: Users can subscribe to (simulated) daily email reminders to log their transactions.

Your role is to answer user questions about these features. Be concise, clear, and friendly.

User's question: {{{query}}}`,
});


const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
