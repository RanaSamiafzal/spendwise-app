'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAccounts, mockTransactions } from '@/lib/data';
import type { Account } from '@/lib/types';
import { useCurrency } from '@/contexts/currency-context';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Banknote, Landmark, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconMap = {
  checking: <Landmark className="w-8 h-8 text-muted-foreground" />,
  savings: <Banknote className="w-8 h-8 text-muted-foreground" />,
  debt: <CreditCard className="w-8 h-8 text-muted-foreground" />,
};

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const { formatCurrency } = useCurrency();

  // In a real app, you'd fetch this data.
  const account = mockAccounts.find((acc) => acc.id === accountId) as Account | undefined;
  // NOTE: The mock data does not link transactions to specific accounts.
  // For this prototype, we'll display all recent transactions as a placeholder.
  const transactions = mockTransactions;

  if (!account) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Account not found</h1>
        <p className="text-muted-foreground">The account you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4">
            <Link href="/dashboard/accounts"><ArrowLeft className="mr-2 h-4 w-4" />Back to Accounts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/accounts">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Accounts</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">{account.name}</h1>
            <p className="text-muted-foreground">Detailed view of your account.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-medium">Current Balance</CardTitle>
          {iconMap[account.type]}
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'text-4xl font-bold',
              account.balance >= 0 ? 'text-foreground' : 'text-destructive'
            )}
          >
            {formatCurrency(account.balance)}
          </div>
        </CardContent>
      </Card>

      <RecentTransactions transactions={transactions} />
      <p className="text-xs text-center text-muted-foreground">
        Note: The transaction list is for demonstration purposes and is not filtered by account.
      </p>

    </div>
  );
}
