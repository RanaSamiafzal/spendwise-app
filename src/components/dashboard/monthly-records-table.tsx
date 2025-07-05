'use client';
import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCurrency } from '@/contexts/currency-context';

interface MonthlyRecordsTableProps {
  transactions: Transaction[];
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  transactions: Transaction[];
}

export function MonthlyRecordsTable({ transactions }: MonthlyRecordsTableProps) {
  const { formatCurrency } = useCurrency();

  const monthlyData = useMemo(() => {
    const groupedData: Record<string, MonthlyData> = {};

    transactions.forEach((t) => {
      const month = format(new Date(t.date), 'MMMM yyyy');
      if (!groupedData[month]) {
        groupedData[month] = {
          month,
          income: 0,
          expenses: 0,
          savings: 0,
          transactions: [],
        };
      }

      groupedData[month].transactions.push(t);
      if (t.type === 'income') {
        groupedData[month].income += t.amount;
      } else {
        groupedData[month].expenses += t.amount;
      }
    });

    Object.values(groupedData).forEach((data) => {
      data.savings = data.income - data.expenses;
      data.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    return Object.values(groupedData).sort((a,b) => new Date(b.transactions[0].date).getTime() - new Date(a.transactions[0].date).getTime());
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Browse your financial records month by month.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue={monthlyData[0]?.month}>
          {monthlyData.map((data) => (
            <AccordionItem value={data.month} key={data.month}>
              <AccordionTrigger>
                <div className="flex flex-col items-start text-left sm:flex-row sm:items-center sm:justify-between w-full pr-4 text-lg">
                  <span>{data.month}</span>
                  <div className="flex gap-4 sm:gap-8 text-sm sm:text-lg mt-1 sm:mt-0">
                     <span className="text-emerald-500">{formatCurrency(data.income)}</span>
                     <span className="text-destructive">{formatCurrency(data.expenses)}</span>
                     <span className={cn(data.savings >= 0 ? 'text-foreground' : 'text-destructive')}>
                        {formatCurrency(data.savings)}
                     </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="relative w-full overflow-auto">
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
                      {data.transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="whitespace-nowrap">{format(new Date(txn.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell>{txn.category}</TableCell>
                          <TableCell
                            className={cn(
                              'text-right font-medium whitespace-nowrap',
                              txn.type === 'income' ? 'text-emerald-600' : 'text-destructive'
                            )}
                          >
                            {txn.type === 'expense' ? '-' : ''}
                            {formatCurrency(txn.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {monthlyData.length === 0 && <p className="text-center text-muted-foreground p-8">No transactions found.</p>}
      </CardContent>
    </Card>
  );
}
