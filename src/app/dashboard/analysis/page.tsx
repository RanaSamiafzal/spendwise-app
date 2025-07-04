'use client';

import { useState } from 'react';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { mockTransactions, mockBudgets } from '@/lib/data';
import type { Transaction, Budget } from '@/lib/types';

export default function AnalysisPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [budgets] = useState<Budget[]>(mockBudgets);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Spending Analysis</h1>
        <p className="text-muted-foreground">
          Explore your spending habits with charts and AI-powered insights.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart transactions={transactions} />
        <SpendingInsights transactions={transactions} budgets={budgets} />
      </div>
    </div>
  );
}
