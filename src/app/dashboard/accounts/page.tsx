'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Banknote, Landmark, CreditCard } from 'lucide-react';
import { mockAccounts } from '@/lib/data';
import type { Account } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/currency-context';
import Link from 'next/link';
import { AddAccount } from '@/components/dashboard/add-account';

const iconMap = {
  checking: <Landmark className="w-8 h-8 text-muted-foreground" />,
  savings: <Banknote className="w-8 h-8 text-muted-foreground" />,
  debt: <CreditCard className="w-8 h-8 text-muted-foreground" />,
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const { formatCurrency } = useCurrency();

  const handleAddAccount = useCallback((newAccount: Omit<Account, 'id'>) => {
    const accountWithId: Account = {
        ...newAccount,
        id: `acc_${Date.now()}`
    };
    setAccounts((prev) => [...prev, accountWithId]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Accounts</h1>
          <p className="text-muted-foreground">Manage your checking, savings, and credit accounts.</p>
        </div>
        <AddAccount onAddAccount={handleAddAccount} />
      </div>

      {accounts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {accounts.map((account) => (
            <Link href={`/dashboard/accounts/${account.id}`} key={account.id} className="block rounded-lg transition-all hover:shadow-lg hover:ring-2 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Card className="shadow-sm h-full">
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
                  <p className="text-muted-foreground text-sm">Click to view transaction history for this account.</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center p-12">
            <CardTitle>No Accounts Found</CardTitle>
            <CardDescription className="mt-2">
                Get started by adding your first bank account or credit card.
            </CardDescription>
        </Card>
      )}
    </div>
  );
}
