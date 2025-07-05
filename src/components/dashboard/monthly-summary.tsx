'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { useCurrency } from '@/contexts/currency-context';
import Link from 'next/link';

interface MonthlySummaryProps {
  transactions: Transaction[];
}

export function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const { formatCurrency } = useCurrency();
  
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;
    
    return {
      income,
      expenses,
      savings,
      month: now.toLocaleString('default', { month: 'long' })
    };
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
        <Link href="/dashboard/summary/income" className="block rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                    <ArrowUpCircle className="w-6 h-6 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-500">{formatCurrency(stats.income)}</div>
                    <p className="text-xs text-muted-foreground">For {stats.month}</p>
                </CardContent>
            </Card>
        </Link>
        <Link href="/dashboard/summary/expenses" className="block rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                    <ArrowDownCircle className="w-6 h-6 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{formatCurrency(stats.expenses)}</div>
                    <p className="text-xs text-muted-foreground">For {stats.month}</p>
                </CardContent>
            </Card>
        </Link>
        <Link href="/dashboard/records" className="block rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
                    <PiggyBank className="w-6 h-6 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className={cn("text-2xl font-bold", stats.savings >= 0 ? 'text-foreground' : 'text-destructive')}>{formatCurrency(stats.savings)}</div>
                    <p className="text-xs text-muted-foreground">For {stats.month}</p>
                </CardContent>
            </Card>
        </Link>
    </div>
  );
}
