'use server';

/**
 * @fileOverview Analyzes user spending habits and provides insights for potential savings.
 *
 * - analyzeSpendingHabits - A function that analyzes spending habits and provides insights.
 * - AnalyzeSpendingHabitsInput - The input type for the analyzeSpendingHabits function.
 * - AnalyzeSpendingHabitsOutput - The return type for the analyzeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingHabitsInputSchema = z.object({
  transactions: z.string().describe('A list of transactions as a JSON string. Each transaction should include the category, amount, and date.'),
  budgetGoals: z.string().describe('A list of budget goals as a JSON string. Each budget goal should include the category and the target amount.'),
});
export type AnalyzeSpendingHabitsInput = z.infer<typeof AnalyzeSpendingHabitsInputSchema>;

const AnalyzeSpendingHabitsOutputSchema = z.object({
  insights: z.string().describe('A summary of spending insights and potential savings opportunities.'),
});
export type AnalyzeSpendingHabitsOutput = z.infer<typeof AnalyzeSpendingHabitsOutputSchema>;

export async function analyzeSpendingHabits(input: AnalyzeSpendingHabitsInput): Promise<AnalyzeSpendingHabitsOutput> {
  return analyzeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingHabitsPrompt',
  input: {schema: AnalyzeSpendingHabitsInputSchema},
  output: {schema: AnalyzeSpendingHabitsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending habits based on their transaction history and budget goals. Provide insights into potential savings opportunities.

Transaction History: {{{transactions}}}
Budget Goals: {{{budgetGoals}}}

Provide a concise summary of your findings and recommendations. Focus on actionable steps the user can take to optimize their budget and achieve their financial goals.`,
});

const analyzeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingHabitsFlow',
    inputSchema: AnalyzeSpendingHabitsInputSchema,
    outputSchema: AnalyzeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
