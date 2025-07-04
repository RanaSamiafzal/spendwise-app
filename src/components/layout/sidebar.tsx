'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, User, Landmark, Target, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onOpenSupportChat: () => void;
}

export function Sidebar({ onOpenSupportChat }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/records', label: 'Monthly Records', icon: FileText },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Landmark },
    { href: '/dashboard/budgets', label: 'Budgets', icon: Target },
    { href: '/dashboard/analysis', label: 'Analysis', icon: BarChart2 },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 pt-6">
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                { 'bg-muted text-primary': pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Card>
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Contact our support team if you have any questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <Button size="sm" className="w-full" onClick={onOpenSupportChat}>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
