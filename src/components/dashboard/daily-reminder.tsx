'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DailyReminder() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubscribed(true);
    setIsLoading(false);
    toast({
      title: 'Subscribed',
      description: 'Daily reminder preference saved (development simulation).'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reminders</CardTitle>
        <CardDescription>Get a reminder to update your expenses each day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscribed ? (
          <div className="rounded-lg bg-secondary p-4 text-center text-sm text-secondary-foreground">
            <p>
              You are subscribed to daily reminders at <strong>{email}</strong>.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">(Simulation mode for local development.)</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="email-reminder">Email Address</Label>
            <Input
              id="email-reminder"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>
            <p className="pt-2 text-center text-xs text-muted-foreground">Hook this to a real job queue for production emails.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
