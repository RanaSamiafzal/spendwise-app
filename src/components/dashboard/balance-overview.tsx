'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Landmark, CreditCard } from 'lucide-react';
import type { Account } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/currency-context';
import Link from 'next/link';

interface BalanceOverviewProps {
  accounts: Account[];
}

const iconMap = {
  checking: <Landmark className="w-6 h-6 text-muted-foreground" />,
  savings: <Banknote className="w-6 h-6 text-muted-foreground" />,
  debt: <CreditCard className="w-6 h-6 text-muted-foreground" />,
};

export function BalanceOverview({ accounts }: BalanceOverviewProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {accounts.map((account) => (
        <Link href={`/dashboard/accounts/${account.id}`} key={account.id} className="block h-full rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Card className="shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                {iconMap[account.type]}
            </CardHeader>
            <CardContent>
                <div
                className={cn(
                    'text-2xl font-bold',
                    account.balance >= 0 ? 'text-foreground' : 'text-destructive'
                )}
                >
                {formatCurrency(account.balance)}
                </div>
                <p className="text-xs text-muted-foreground">Current Balance</p>
            </CardContent>
            </Card>
        </Link>
      ))}
    </div>
  );
}
