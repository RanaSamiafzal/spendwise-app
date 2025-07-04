'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { useCurrency } from '@/contexts/currency-context';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatCurrency } = useCurrency();
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>A list of your most recent income and expenses.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>
                    <div className="font-medium">{txn.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.category}</Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium flex items-center justify-end gap-1.5',
                      txn.type === 'income' ? 'text-emerald-600' : 'text-destructive'
                    )}
                  >
                    {txn.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                    <span>{formatCurrency(txn.amount)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
