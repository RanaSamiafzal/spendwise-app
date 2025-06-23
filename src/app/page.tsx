'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { BalanceOverview } from '@/components/dashboard/balance-overview';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { BudgetGoals } from '@/components/dashboard/budget-goals';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { AddTransaction } from '@/components/dashboard/add-transaction';
import { mockAccounts, mockTransactions, mockBudgets } from '@/lib/data';
import type { Transaction, Budget, Account } from '@/lib/types';

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const allCategories = Array.from(
    new Set(mockTransactions.filter(t => t.type === 'expense').map((t) => t.category).concat(mockBudgets.map((b) => b.category)))
  ) as (Transaction['category'])[];

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transactionWithIdAndDate: Transaction = {
      ...newTransaction,
      id: `txn_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [transactionWithIdAndDate, ...prev]);

    // Update account balance
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.type === 'checking') {
          // Assuming all transactions affect checking
          const newBalance =
            newTransaction.type === 'income'
              ? acc.balance + newTransaction.amount
              : acc.balance - newTransaction.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8 space-y-6 container mx-auto">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex items-center space-x-2">
            <AddTransaction onAddTransaction={handleAddTransaction} categories={allCategories} />
          </div>
        </div>

        <BalanceOverview accounts={accounts} />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <BudgetGoals budgets={budgets} transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <SpendingChart transactions={transactions} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <RecentTransactions transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </div>
        </div>
      </main>
    </div>
  );
}
