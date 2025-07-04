'use server';
/**
 * @fileOverview Suggests a category for a transaction based on its description.
 *
 * - suggestCategory - A function that suggests a transaction category.
 * - SuggestCategoryInput - The input type for the suggestCategory function.
 * - SuggestCategoryOutput - The return type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestCategoryInputSchema = z.object({
  description: z.string().describe('The transaction description.'),
  categories: z.array(z.string()).describe('The list of available categories to choose from.'),
});
export type SuggestCategoryInput = z.infer<typeof SuggestCategoryInputSchema>;

export const SuggestCategoryOutputSchema = z.object({
  category: z.string().describe('The suggested category from the provided list. Should be an empty string if no category is a good fit.'),
});
export type SuggestCategoryOutput = z.infer<typeof SuggestCategoryOutputSchema>;

export async function suggestCategory(input: SuggestCategoryInput): Promise<SuggestCategoryOutput> {
  if (input.description.trim().length < 3) {
    return { category: '' };
  }
  return suggestCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCategoryPrompt',
  input: {schema: SuggestCategoryInputSchema},
  output: {schema: SuggestCategoryOutputSchema},
  prompt: `You are an expert personal finance assistant. Your job is to categorize a transaction based on its description.
You are given a transaction description and a list of valid categories. You must choose the most appropriate category from the list.

If the description is too generic or you cannot confidently determine a category from the list, suggest an empty string for the category.

Transaction Description: {{{description}}}
Available Categories: {{{json categories}}}`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: SuggestCategoryInputSchema,
    outputSchema: SuggestCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
