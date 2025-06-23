'use client';

import { useState } from 'react';
import { mockTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import { MonthlyRecordsTable } from '@/components/dashboard/monthly-records-table';

export default function RecordsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Monthly Records</h1>
        <p className="text-muted-foreground">
          A detailed view of your income, expenses, and savings by month.
        </p>
      </div>
      <MonthlyRecordsTable transactions={transactions} />
    </div>
  );
}
