'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api-client';

interface SupportChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  role: 'user' | 'agent';
  text: string;
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('spendwise_auth');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token || null;
  } catch {
    return null;
  }
}

export function SupportChat({ open, onOpenChange }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: "Hi! I'm your SpendWise AI agent. Ask for advice, budgeting, or automation help." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const message = input;
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setInput('');
    setIsLoading(true);

    try {
      const token = readToken();
      if (!token) {
        setMessages((prev) => [...prev, { role: 'agent', text: 'Please log in to use AI support.' }]);
        return;
      }

      const result = await apiRequest<{ reply: string }>('/ai/chat', {
        method: 'POST',
        token,
        body: JSON.stringify({ message })
      });

      setMessages((prev) => [...prev, { role: 'agent', text: result.reply }]);
    } catch (error) {
      console.error('Error with support chat:', error);
      toast({
        title: 'AI Unavailable',
        description: 'Could not reach the AI backend. Verify server and API key setup.',
        variant: 'destructive'
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickTask = async () => {
    setIsLoading(true);
    try {
      const token = readToken();
      if (!token) {
        toast({ title: 'Login required', description: 'Login first to run automations.', variant: 'destructive' });
        return;
      }

      const task = await apiRequest<{ status: string; note: string }>('/ai/automations/simulate-wallet-action', {
        method: 'POST',
        token,
        body: JSON.stringify({ action: 'pay_subscription', amount: 9.99, target: 'netflix' })
      });

      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: `Automation task status: ${task.status}. ${task.note}` }
      ]);
    } catch (error) {
      console.error('Quick task failed:', error);
      toast({ title: 'Task failed', description: 'Could not run automation task.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[70vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Support Chat</DialogTitle>
          <DialogDescription>Powered by backend AI agent (OpenAI key stays server-side).</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef as never}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' && 'justify-end')}>
                  {message.role === 'agent' && (
                    <div className="rounded-full bg-primary p-2 text-primary-foreground">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3',
                      message.role === 'agent' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <Bot size={20} />
                  </div>
                  <div className="flex items-center rounded-lg bg-muted p-3">
                    <Loader2 className="animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2 pt-4 sm:flex-row">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Type your question..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
          <Button variant="outline" onClick={runQuickTask} disabled={isLoading}>
            <Zap className="mr-1 h-4 w-4" /> Run Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
