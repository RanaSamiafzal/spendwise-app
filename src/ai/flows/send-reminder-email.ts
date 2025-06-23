'use server';
/**
 * @fileOverview A flow to simulate sending a daily reminder email.
 *
 * - sendReminderEmail - A function that simulates subscribing a user to daily emails.
 * - SendReminderEmailInput - The input type for the sendReminderEmail function.
 * - SendReminderEmailOutput - The return type for the sendReminderEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SendReminderEmailInputSchema = z.object({
  email: z.string().email().describe('The email address to send reminders to.'),
});
export type SendReminderEmailInput = z.infer<typeof SendReminderEmailInputSchema>;

const SendReminderEmailOutputSchema = z.object({
  message: z.string().describe('A confirmation message.'),
});
export type SendReminderEmailOutput = z.infer<typeof SendReminderEmailOutputSchema>;

export async function sendReminderEmail(input: SendReminderEmailInput): Promise<SendReminderEmailOutput> {
  return sendReminderEmailFlow(input);
}

const sendReminderEmailFlow = ai.defineFlow(
  {
    name: 'sendReminderEmailFlow',
    inputSchema: SendReminderEmailInputSchema,
    outputSchema: SendReminderEmailOutputSchema,
  },
  async (input) => {
    console.log(`Simulating subscription for ${input.email} to daily reminders.`);
    // In a real application, you would integrate with an email service
    // like SendGrid or Resend here and set up a cron job to trigger this daily.
    return { message: `Successfully subscribed ${input.email} to daily reminders!` };
  }
);
