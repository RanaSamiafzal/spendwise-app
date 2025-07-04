'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTransactions } from '@/lib/data';
import { useCurrency } from '@/contexts/currency-context';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function SummaryDetailPage() {
  const params = useParams();
  const { type } = params;
  const { formatCurrency } = useCurrency();

  const isIncome = type === 'income';

  const { title, transactions, total } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = mockTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear && t.type === type;
    });

    const totalAmount = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
        title: isIncome ? "Current Month's Income" : "Current Month's Expenses",
        transactions: monthlyTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        total: totalAmount,
    };
  }, [type, isIncome]);
  

  if (type !== 'income' && type !== 'expenses') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{title}</h1>
            <p className="text-muted-foreground">A detailed list of transactions for the current month.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                {isIncome ? <ArrowUpCircle className="w-6 h-6 text-emerald-500" /> : <ArrowDownCircle className="w-6 h-6 text-destructive" />}
                Total {isIncome ? 'Income' : 'Expenses'} this month
            </CardTitle>
        </CardHeader>
        <CardContent>
             <div className={cn('text-4xl font-bold', isIncome ? 'text-emerald-500' : 'text-destructive')}>
                {formatCurrency(total)}
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            {transactions.length > 0 ? `Here are your ${type} for this month.` : `No ${type} recorded this month.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{format(new Date(txn.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{txn.description}</TableCell>
                    <TableCell>{txn.category}</TableCell>
                    <TableCell
                      className={cn('text-right font-medium', isIncome ? 'text-emerald-600' : 'text-destructive')}
                    >
                      {formatCurrency(txn.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
                No transactions to display.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
