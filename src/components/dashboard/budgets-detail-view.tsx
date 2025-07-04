'use client';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Budget, Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCurrency } from '@/contexts/currency-context';

interface BudgetsDetailViewProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export function BudgetsDetailView({ budgets, transactions }: BudgetsDetailViewProps) {
  const { formatCurrency } = useCurrency();

  const budgetDetails = useMemo(() => {
    return budgets.map(budget => {
      const budgetTransactions = transactions.filter(t => t.type === 'expense' && t.category === budget.category);
      const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
      const progress = Math.min((spent / budget.limit) * 100, 100);
      return {
        ...budget,
        spent,
        progress,
        transactions: budgetTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      };
    });
  }, [budgets, transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Details</CardTitle>
        <CardDescription>A detailed breakdown of your budgets and related spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {budgetDetails.map(detail => (
            <AccordionItem value={detail.id} key={detail.id}>
              <AccordionTrigger>
                <div className="w-full pr-4">
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span>{detail.category}</span>
                    <span className="text-muted-foreground">
                      <span className={detail.progress > 100 ? 'text-destructive font-bold' : ''}>
                        {formatCurrency(detail.spent)}
                      </span>{' '}
                      / {formatCurrency(detail.limit)}
                    </span>
                  </div>
                  <Progress value={detail.progress} className={detail.progress > 100 ? '[&>div]:bg-destructive' : ''} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {detail.transactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.transactions.map(txn => (
                        <TableRow key={txn.id}>
                          <TableCell>{format(new Date(txn.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell className="text-right font-medium text-destructive">
                            -{formatCurrency(txn.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">No expenses recorded for this budget category yet.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {budgetDetails.length === 0 && <p className="text-center text-muted-foreground p-8">No budgets set up.</p>}
      </CardContent>
    </Card>
  );
}
