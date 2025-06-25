'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { supportChat } from '@/ai/flows/support-chat-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SupportChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  role: 'user' | 'agent';
  text: string;
}

export function SupportChat({ open, onOpenChange }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: "Hello! I'm the SpendWise AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await supportChat({ query: input });
      const agentMessage: Message = { role: 'agent', text: result.response };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error with support chat:', error);
      toast({
        title: 'Error',
        description: 'Sorry, I am unable to respond right now. Please try again later.',
        variant: 'destructive',
      });
      setMessages(prev => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Support Chat</DialogTitle>
          <DialogDescription>
            Ask our AI assistant anything about the SpendWise app.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef as any}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'agent' && (
                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[80%]',
                      message.role === 'agent'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="p-2 bg-muted rounded-full text-muted-foreground">
                       <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                      <Bot size={20} />
                    </div>
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                        <Loader2 className="animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex items-center gap-2 pt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
