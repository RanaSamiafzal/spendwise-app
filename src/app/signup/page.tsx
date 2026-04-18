'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';
import { useState } from 'react';
import { useAuthSession } from '@/components/providers/redux-provider';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuthSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await auth.signup({ name, email, phone, password });
    if (result) {
      localStorage.setItem('spendwise_auth', JSON.stringify(result));
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <div className="mb-4 flex items-center justify-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold text-primary">SpendWise</h1>
          </div>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create your SpendWise account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={auth.loading}>
                {auth.loading ? 'Creating account...' : 'Create account'}
              </Button>
              {auth.error ? <p className="text-sm text-destructive">{auth.error}</p> : null}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
