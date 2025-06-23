'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { analyzeSpendingHabits } from '@/ai/flows/analyze-spending-habits';
import type { Transaction, Budget } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setInsights('');
    try {
      const result = await analyzeSpendingHabits({
        transactions: JSON.stringify(transactions),
        budgetGoals: JSON.stringify(budgets.map((b) => ({ category: b.category, targetAmount: b.limit }))),
      });
      setInsights(result.insights);
    } catch (error) {
      console.error('Error analyzing spending habits:', error);
      toast({
        title: 'Error Generating Insights',
        description: 'Failed to get insights from the AI. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Spending Insights</CardTitle>
        <CardDescription>Get AI-powered analysis of your spending habits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>
        {insights && (
          <ScrollArea className="h-[234px] w-full">
            <div className="p-4 bg-secondary rounded-lg text-sm text-secondary-foreground">
              <p style={{ whiteSpace: 'pre-wrap' }}>{insights}</p>
            </div>
          </ScrollArea>
        )}
        {!insights && !isLoading && (
            <div className="h-[234px] flex items-center justify-center text-center text-muted-foreground p-4 bg-secondary rounded-lg">
                Click "Generate Insights" to get an AI-powered summary of your spending and tips for saving money.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
