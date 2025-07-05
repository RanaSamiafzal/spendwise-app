'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Budget, Transaction } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { useCurrency } from '@/contexts/currency-context';

interface BudgetGoalsProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function BudgetGoals({ budgets, transactions }: BudgetGoalsProps) {
  const { formatCurrency } = useCurrency();

  const spentAmounts = useMemo(() => {
    const amounts = new Map<string, number>();
    for (const transaction of transactions) {
      if (transaction.type === 'expense') {
        const currentAmount = amounts.get(transaction.category) || 0;
        amounts.set(transaction.category, currentAmount + transaction.amount);
      }
    }
    return amounts;
  }, [transactions]);

  const getSpentAmount = (category: string) => {
    return spentAmounts.get(category) || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        <CardDescription>Track your spending against your monthly budget.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-4 pr-4">
            {budgets.map((budget) => {
              const spent = getSpentAmount(budget.category);
              const progress = Math.min((spent / budget.limit) * 100, 100);
              return (
                <div key={budget.id}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-muted-foreground">
                      <span className={progress > 100 ? 'text-destructive font-bold' : ''}>
                        {formatCurrency(spent)}
                      </span>{' '}
                      / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <Progress value={progress} className={progress > 100 ? '[&>div]:bg-destructive' : ''} />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
