'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BalanceOverview } from '@/components/dashboard/balance-overview';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { BudgetGoals } from '@/components/dashboard/budget-goals';
import { AddTransaction } from '@/components/dashboard/add-transaction';
import { mockAccounts, mockTransactions, mockBudgets } from '@/lib/data';
import type { Transaction, Budget, Account, Category } from '@/lib/types';
import { MonthlySummary } from '@/components/dashboard/monthly-summary';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { clarifyTransaction } from '@/ai/flows/clarify-transaction';
import { suggestCategory } from '@/ai/flows/suggest-category';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const SpendingInsights = dynamic(() => import('@/components/dashboard/spending-insights').then((mod) => mod.SpendingInsights), {
  loading: () => <Skeleton className="h-[320px] w-full" />,
});

const DailyReminder = dynamic(() => import('@/components/dashboard/daily-reminder').then((mod) => mod.DailyReminder), {
  loading: () => <Skeleton className="h-[230px] w-full" />,
});


export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>(() => {
    const expenseCats = mockTransactions.filter(t => t.type === 'expense').map((t) => t.category);
    const budgetCats = mockBudgets.map((b) => b.category);
    return Array.from(new Set([...expenseCats, ...budgetCats, 'Uncategorized', 'Salary']));
  });

  const handleAddCategory = useCallback((newCategory: Category) => {
    if (newCategory && !categories.includes(newCategory)) {
        setCategories((prev) => [...prev, newCategory].sort());
    }
  }, [categories]);

  const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id' | 'date'>) => {
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
  }, []);

  const handleSyncTransactions = useCallback(async () => {
    setIsSyncing(true);
    try {
      const newSyncedTransactions = [
        { crypticDescription: 'Vending Machine', amount: 3.25 },
        { crypticDescription: 'TFL.GOV.UK/CP', amount: 12.80 },
        { crypticDescription: 'AMZN Mktp US', amount: 42.99 },
      ];

      const processedTransactions: Transaction[] = [];
      let totalSyncedExpenses = 0;

      for (const syncedTxn of newSyncedTransactions) {
        const [clarifiedResult, categoryResult] = await Promise.all([
          clarifyTransaction({ description: syncedTxn.crypticDescription }),
          suggestCategory({ description: syncedTxn.crypticDescription, categories }),
        ]);
        
        const newTransaction: Transaction = {
          id: `sync_${Date.now()}_${Math.random()}`,
          date: new Date().toISOString().split('T')[0],
          description: clarifiedResult.clarifiedDescription,
          category: categoryResult.category || 'Uncategorized',
          amount: syncedTxn.amount,
          type: 'expense',
        };
        processedTransactions.push(newTransaction);
        totalSyncedExpenses += newTransaction.amount;
      }
      
      setTransactions((prev) => [...processedTransactions, ...prev]);
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) => {
          if (acc.type === 'checking') {
            return { ...acc, balance: acc.balance - totalSyncedExpenses };
          }
          return acc;
        })
      );

      toast({
        title: "Sync Complete",
        description: `${processedTransactions.length} new transactions were added.`,
      });

    } catch (error) {
      console.error("Failed to sync transactions:", error);
      toast({
        title: "Sync Failed",
        description: "Could not sync transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [categories, toast]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <Button variant="outline" onClick={handleSyncTransactions} disabled={isSyncing} className="w-full sm:w-auto">
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync with Bank
          </Button>
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
        <div className="lg:col-span-3 h-full">
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
