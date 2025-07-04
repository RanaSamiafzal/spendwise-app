'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BalanceOverview } from '@/components/dashboard/balance-overview';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { BudgetGoals } from '@/components/dashboard/budget-goals';
import { SpendingInsights } from '@/components/dashboard/spending-insights';
import { AddTransaction } from '@/components/dashboard/add-transaction';
import { mockAccounts, mockTransactions, mockBudgets } from '@/lib/data';
import type { Transaction, Budget, Account, Category } from '@/lib/types';
import { MonthlySummary } from '@/components/dashboard/monthly-summary';
import { DailyReminder } from '@/components/dashboard/daily-reminder';

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const [categories, setCategories] = useState<Category[]>(() => {
    const expenseCats = mockTransactions.filter(t => t.type === 'expense').map((t) => t.category);
    const budgetCats = mockBudgets.map((b) => b.category);
    return Array.from(new Set([...expenseCats, ...budgetCats]));
  });

  const handleAddCategory = (newCategory: Category) => {
    if (newCategory && !categories.includes(newCategory)) {
        setCategories((prev) => [...prev, newCategory].sort());
    }
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const transactionWithIdAndDate: Transaction = {
      ...newTransaction,
      id: `txn_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions((prev) => [transactionWithIdAndDate, ...prev]);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (acc.type === 'checking') {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <AddTransaction 
            onAddTransaction={handleAddTransaction} 
            categories={categories}
            onAddCategory={handleAddCategory} 
          />
        </div>
      </div>

      <MonthlySummary transactions={transactions} />

      <BalanceOverview accounts={accounts} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Link href="/dashboard/budgets" className="block h-full rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <BudgetGoals budgets={budgets} transactions={transactions} />
          </Link>
        </div>
        <div className="lg:col-span-2">
           <Link href="/dashboard/analysis" className="block h-full rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <SpendingChart transactions={transactions} />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Link href="/dashboard/records" className="block h-full rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <RecentTransactions transactions={transactions} />
          </Link>
        </div>
        <div className="lg:col-span-2 space-y-6">
           <Link href="/dashboard/analysis" className="block rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </Link>
          <DailyReminder />
        </div>
      </div>
    </div>
  );
}
