'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { sendReminderEmail } from '@/ai/flows/send-reminder-email';
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
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await sendReminderEmail({ email });
      toast({
        title: 'Success!',
        description: result.message,
      });
      setSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to reminders:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Could not subscribe to daily reminders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reminders</CardTitle>
        <CardDescription>Get an email reminder to update your expenses every day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscribed ? (
          <div className="p-4 bg-secondary rounded-lg text-sm text-center text-secondary-foreground">
            <p>You are subscribed to daily reminders at <strong>{email}</strong>.</p>
            <p className="text-xs mt-2 text-muted-foreground">(This is a simulation. No actual emails will be sent.)</p>
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
            <p className="text-xs text-center text-muted-foreground pt-2">A cron job would be needed for a real app.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
