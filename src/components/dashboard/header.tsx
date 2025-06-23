import { PiggyBank } from 'lucide-react';

export function Header() {
  return (
    <header className="p-4 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <PiggyBank className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline text-primary">SpendWise</h1>
      </div>
    </header>
  );
}
