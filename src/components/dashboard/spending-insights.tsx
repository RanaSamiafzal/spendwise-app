'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import type { Transaction, Budget } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState('');

  const handleAnalyze = async () => {
    setIsLoading(true);
    setInsights('');

    const expenseByCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce<Record<string, number>>((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

    const topCategories = Object.entries(expenseByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => `• ${category}: $${amount.toFixed(2)}`)
      .join('\n');

    const budgetFeedback = budgets
      .map((budget) => {
        const spent = expenseByCategory[budget.category] || 0;
        const delta = budget.limit - spent;
        if (delta >= 0) return `• ${budget.category}: $${delta.toFixed(2)} under budget.`;
        return `• ${budget.category}: $${Math.abs(delta).toFixed(2)} over budget.`;
      })
      .join('\n');

    const recommendation =
      'Recommendations:\n• Set a weekly cap for top expense category.\n• Review non-essential subscriptions this week.\n• Automate savings transfer after payday.';

    await new Promise((resolve) => setTimeout(resolve, 450));
    setInsights(`Top spending categories:\n${topCategories || '• No expense data yet.'}\n\nBudget status:\n${budgetFeedback}\n\n${recommendation}`);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>Instant analysis generated from your current dashboard data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
        {insights ? (
          <ScrollArea className="h-[200px] w-full sm:h-[234px]">
            <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
              <p style={{ whiteSpace: 'pre-wrap' }}>{insights}</p>
            </div>
          </ScrollArea>
        ) : (
          !isLoading && (
            <div className="flex h-[200px] items-center justify-center rounded-lg bg-secondary p-4 text-center text-muted-foreground sm:h-[234px]">
              Click "Generate Insights" to get a practical summary of spending and budget performance.
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
