'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';
import { CurrencyProvider } from '@/contexts/currency-context';

const SupportChat = dynamic(() => import('@/components/layout/support-chat').then((mod) => mod.SupportChat), {
  ssr: false,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supportChatOpen, setSupportChatOpen] = useState(false);

  const handleOpenSupportChat = () => setSupportChatOpen(true);

  return (
    <CurrencyProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header onOpenSupportChat={handleOpenSupportChat} />
        <main className="flex-1 bg-muted/40 p-4 lg:p-6">{children}</main>
        <Footer onOpenSupportChat={handleOpenSupportChat} />
      </div>
      {supportChatOpen && <SupportChat open={supportChatOpen} onOpenChange={setSupportChatOpen} />}
    </CurrencyProvider>
  );
}
