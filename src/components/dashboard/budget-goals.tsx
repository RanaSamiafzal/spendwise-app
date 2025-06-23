'use client';

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

  const getSpentAmount = (category: string) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
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
