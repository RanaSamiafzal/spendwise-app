'use client';

import { useState } from 'react';
import { mockTransactions, mockBudgets } from '@/lib/data';
import type { Transaction, Budget } from '@/lib/types';
import { BudgetsDetailView } from '@/components/dashboard/budgets-detail-view';

export default function BudgetsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [budgets] = useState<Budget[]>(mockBudgets);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Budgets</h1>
        <p className="text-muted-foreground">
          Manage your budgets and see how your spending aligns with your goals.
        </p>
      </div>
      <BudgetsDetailView budgets={budgets} transactions={transactions} />
    </div>
  );
}
