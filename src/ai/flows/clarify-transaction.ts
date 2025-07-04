'use server';
/**
 * @fileOverview Clarifies cryptic transaction descriptions.
 *
 * - clarifyTransaction - A function that makes a transaction description more readable.
 * - ClarifyTransactionInput - The input type for the clarifyTransaction function.
 * - ClarifyTransactionOutput - The return type for the clarifyTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClarifyTransactionInputSchema = z.object({
  description: z.string().describe('The cryptic transaction description from the bank.'),
});
export type ClarifyTransactionInput = z.infer<typeof ClarifyTransactionInputSchema>;

const ClarifyTransactionOutputSchema = z.object({
  clarifiedDescription: z.string().describe('The human-readable transaction description.'),
});
export type ClarifyTransactionOutput = z.infer<typeof ClarifyTransactionOutputSchema>;

export async function clarifyTransaction(input: ClarifyTransactionInput): Promise<ClarifyTransactionOutput> {
  return clarifyTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clarifyTransactionPrompt',
  input: {schema: ClarifyTransactionInputSchema},
  output: {schema: ClarifyTransactionOutputSchema},
  prompt: `You are an AI assistant that clarifies cryptic bank transaction descriptions into human-readable descriptions.
For example, 'AMZN Mktp US' could become 'Amazon Marketplace Purchase' and 'SQ*COFFEESHOP' could become 'Coffee Shop'.
Do not add any preamble, just provide the clarified description.

Cryptic Description: {{{description}}}`,
});

const clarifyTransactionFlow = ai.defineFlow(
  {
    name: 'clarifyTransactionFlow',
    inputSchema: ClarifyTransactionInputSchema,
    outputSchema: ClarifyTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
