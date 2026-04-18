import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateFinanceAdvice({ profile, transactions, subscriptions }) {
  if (!client) {
    return 'OpenAI key not configured. Add OPENAI_API_KEY to enable personalized financial advice.';
  }

  const prompt = `You are a practical finance assistant. User profile: ${JSON.stringify(profile)}\n\nTransactions (latest first): ${JSON.stringify(transactions.slice(0, 20))}\n\nSubscriptions: ${JSON.stringify(subscriptions)}\n\nReturn concise advice in 4 bullet points covering savings, subscriptions, cashflow and one next action.`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: prompt
  });

  return response.output_text;
}

export async function chatWithFinanceAgent({ message, context }) {
  if (!client) {
    return 'OpenAI key not configured. Add OPENAI_API_KEY to enable chat.';
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content:
          'You are SpendWise Copilot. Give safe, actionable personal finance guidance. Never claim to execute real payments; suggest confirmation flows.'
      },
      {
        role: 'user',
        content: `Context: ${JSON.stringify(context)}\n\nUser message: ${message}`
      }
    ]
  });

  return response.output_text;
}
