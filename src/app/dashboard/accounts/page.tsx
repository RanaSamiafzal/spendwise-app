'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Landmark, CreditCard } from 'lucide-react';
import { mockAccounts } from '@/lib/data';
import type { Account } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/currency-context';

const iconMap = {
  checking: <Landmark className="w-8 h-8 text-muted-foreground" />,
  savings: <Banknote className="w-8 h-8 text-muted-foreground" />,
  debt: <CreditCard className="w-8 h-8 text-muted-foreground" />,
};

export default function AccountsPage() {
  const [accounts] = useState<Account[]>(mockAccounts);
  const { formatCurrency } = useCurrency();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Accounts</h1>
        <p className="text-muted-foreground">A detailed view of your accounts.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {accounts.map((account) => (
          <Card key={account.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
              {iconMap[account.type]}
            </CardHeader>
            <CardContent>
              <div className="pb-4">
                <p className="text-xs text-muted-foreground">Current Balance</p>
                <div
                  className={cn(
                    'text-3xl font-bold',
                    account.balance >= 0 ? 'text-foreground' : 'text-destructive'
                  )}
                >
                  {formatCurrency(account.balance)}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">Transaction history for this account would appear here.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
