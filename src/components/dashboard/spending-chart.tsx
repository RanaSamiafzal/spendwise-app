'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const { spendingData, chartConfig } = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(categoryTotals)
      .map(([category, total], index) => ({
        name: category,
        value: total,
        fill: `var(--chart-${(index % 5) + 1})`,
      }))
      .sort((a, b) => b.value - a.value);

    const config: ChartConfig = {};
    data.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });

    return { spendingData: data, chartConfig: config };
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>A breakdown of your expenses.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {spendingData.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={spendingData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-mt-4 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
