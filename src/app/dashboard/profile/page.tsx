'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/contexts/currency-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const currencies = [
  { value: 'USD', label: 'USD - United States Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'ZAR', label: 'ZAR - South African Rand' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
  { value: 'MXN', label: 'MXN - Mexican Peso' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
  { value: 'KRW', label: 'KRW - South Korean Won' },
  { value: 'PKR', label: 'PKR - Pakistani Rupee' },
];

export default function ProfilePage() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const [username, setUsername] = React.useState('demo_user');
  const [email, setEmail] = React.useState('demo@example.com');
  const [phone, setPhone] = React.useState('123-456-7890');

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save these details to your backend.
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been successfully saved.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
                <AvatarFallback>DU</AvatarFallback>
              </Avatar>
              <Button variant="outline" type="button">Change Photo</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      type="button"
                    >
                      {currency
                        ? currencies.find((c) => c.value === currency)?.label
                        : 'Select currency...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search currency..." />
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {currencies.map((curr) => (
                            <CommandItem
                              key={curr.value}
                              value={curr.label}
                              onSelect={() => {
                                setCurrency(curr.value as any);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  currency === curr.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {curr.label}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
