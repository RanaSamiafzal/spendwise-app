import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ReduxProvider } from '@/components/providers/redux-provider';

export const metadata: Metadata = {
  title: 'SpendWise',
  description: 'Budgeting and expense tracking made simple'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased')}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
