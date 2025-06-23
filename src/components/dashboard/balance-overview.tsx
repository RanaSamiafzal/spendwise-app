import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Landmark, CreditCard } from 'lucide-react';
import type { Account } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BalanceOverviewProps {
  accounts: Account[];
}

const iconMap = {
  checking: <Landmark className="w-6 h-6 text-muted-foreground" />,
  savings: <Banknote className="w-6 h-6 text-muted-foreground" />,
  debt: <CreditCard className="w-6 h-6 text-muted-foreground" />,
};

export function BalanceOverview({ accounts }: BalanceOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {accounts.map((account) => (
        <Card key={account.id} className="shadow-sm hover:shadow-md transition-shadow duration-300">
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
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(account.balance)}
            </div>
            <p className="text-xs text-muted-foreground">Current Balance</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
