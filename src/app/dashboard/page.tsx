'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api-client';
import { useAuthSession } from '@/components/providers/redux-provider';

type Tx = {
  _id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
};

type Sub = {
  _id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuthSession();
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [monthlyBurn, setMonthlyBurn] = useState(0);
  const [advice, setAdvice] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);

  const [txForm, setTxForm] = useState({ description: '', category: 'General', amount: 0, type: 'expense' as 'income' | 'expense' });
  const [subForm, setSubForm] = useState({ name: '', amount: 0, billingCycle: 'monthly' as 'monthly' | 'yearly', renewalDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('spendwise_auth');
    if (!raw) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(raw) as { token: string; user: unknown };
    auth.hydrate(parsed as never);
  }, [auth, router]);

  useEffect(() => {
    if (!auth.token) return;

    const load = async () => {
      const [txRes, subRes, insightRes, adviceRes] = await Promise.all([
        apiRequest<{ transactions: Tx[] }>('/transactions', { token: auth.token }),
        apiRequest<{ subscriptions: Sub[] }>('/subscriptions', { token: auth.token }),
        apiRequest<{ monthlyBurn: number }>('/subscriptions/insights', { token: auth.token }),
        apiRequest<{ advice: string }>('/ai/advice', { token: auth.token })
      ]);

      setTransactions(txRes.transactions);
      setSubscriptions(subRes.subscriptions);
      setMonthlyBurn(insightRes.monthlyBurn);
      setAdvice(adviceRes.advice);
    };

    load().catch(() => undefined);
  }, [auth.token]);

  const monthlyStats = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') acc.income += tx.amount;
        else acc.expense += tx.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const onAddTransaction = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth.token) return;
    const response = await apiRequest<{ transaction: Tx }>('/transactions', {
      method: 'POST',
      token: auth.token,
      body: JSON.stringify({ ...txForm, date: new Date().toISOString() })
    });
    setTransactions((prev) => [response.transaction, ...prev]);
    setTxForm({ description: '', category: 'General', amount: 0, type: 'expense' });
  };

  const onAddSubscription = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth.token) return;

    const response = await apiRequest<{ subscription: Sub }>('/subscriptions', {
      method: 'POST',
      token: auth.token,
      body: JSON.stringify({ ...subForm, category: 'General', status: 'active' })
    });

    setSubscriptions((prev) => [...prev, response.subscription]);
    const insightRes = await apiRequest<{ monthlyBurn: number }>('/subscriptions/insights', { token: auth.token });
    setMonthlyBurn(insightRes.monthlyBurn);
    setSubForm({ name: '', amount: 0, billingCycle: 'monthly', renewalDate: '' });
  };

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth.token || !message.trim()) return;

    setChat((prev) => [...prev, { role: 'user', text: message }]);
    const outgoing = message;
    setMessage('');

    const response = await apiRequest<{ reply: string }>('/ai/chat', {
      method: 'POST',
      token: auth.token,
      body: JSON.stringify({ message: outgoing })
    });

    setChat((prev) => [...prev, { role: 'assistant', text: response.reply }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Finance Command Center</h1>
        <p className="text-muted-foreground">Track daily transactions, subscriptions, and AI recommendations in one place.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardDescription>Monthly Income</CardDescription><CardTitle>${monthlyStats.income.toFixed(2)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Monthly Expense</CardDescription><CardTitle>${monthlyStats.expense.toFixed(2)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Net Savings</CardDescription><CardTitle>${(monthlyStats.income - monthlyStats.expense).toFixed(2)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Subscriptions / month</CardDescription><CardTitle>${monthlyBurn.toFixed(2)}</CardTitle></CardHeader></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Add transaction</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onAddTransaction} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Description</Label><Input value={txForm.description} onChange={(e) => setTxForm((p) => ({ ...p, description: e.target.value }))} required /></div>
              <div><Label>Category</Label><Input value={txForm.category} onChange={(e) => setTxForm((p) => ({ ...p, category: e.target.value }))} required /></div>
              <div><Label>Amount</Label><Input type="number" step="0.01" value={txForm.amount} onChange={(e) => setTxForm((p) => ({ ...p, amount: Number(e.target.value) }))} required /></div>
              <div><Label>Type</Label><select className="w-full rounded-md border bg-background px-3 py-2" value={txForm.type} onChange={(e) => setTxForm((p) => ({ ...p, type: e.target.value as 'income' | 'expense' }))}><option value="expense">Expense</option><option value="income">Income</option></select></div>
              <div className="sm:col-span-2"><Button type="submit" className="w-full">Save transaction</Button></div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Add subscription</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={onAddSubscription} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Name</Label><Input value={subForm.name} onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))} required /></div>
              <div><Label>Amount</Label><Input type="number" step="0.01" value={subForm.amount} onChange={(e) => setSubForm((p) => ({ ...p, amount: Number(e.target.value) }))} required /></div>
              <div><Label>Cycle</Label><select className="w-full rounded-md border bg-background px-3 py-2" value={subForm.billingCycle} onChange={(e) => setSubForm((p) => ({ ...p, billingCycle: e.target.value as 'monthly' | 'yearly' }))}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
              <div className="sm:col-span-2"><Label>Renewal Date</Label><Input type="date" value={subForm.renewalDate} onChange={(e) => setSubForm((p) => ({ ...p, renewalDate: e.target.value }))} required /></div>
              <div className="sm:col-span-2"><Button type="submit" className="w-full">Save subscription</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Recent transactions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {transactions.slice(0, 8).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div><p className="font-medium">{tx.description}</p><p className="text-muted-foreground">{tx.category}</p></div>
                <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>{tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Active subscriptions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {subscriptions.slice(0, 8).map((sub) => (
              <div key={sub._id} className="rounded-lg border p-3 text-sm"><p className="font-medium">{sub.name}</p><p className="text-muted-foreground">${sub.amount.toFixed(2)} / {sub.billingCycle}</p></div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>AI financial advice</CardTitle></CardHeader><CardContent><pre className="whitespace-pre-wrap text-sm text-muted-foreground">{advice || 'Loading advice...'}</pre></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Chat with finance agent</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {chat.map((item, index) => (<p key={`${item.role}-${index}`} className="text-sm"><strong>{item.role === 'user' ? 'You' : 'Agent'}:</strong> {item.text}</p>))}
            </div>
            <form onSubmit={onSendMessage} className="flex gap-2"><Input placeholder="Ask for budget optimization..." value={message} onChange={(e) => setMessage(e.target.value)} /><Button type="submit">Send</Button></form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
