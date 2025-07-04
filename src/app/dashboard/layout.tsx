'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';
import { CurrencyProvider } from '@/contexts/currency-context';
import { SupportChat } from '@/components/layout/support-chat';

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
      <SupportChat open={supportChatOpen} onOpenChange={setSupportChatOpen} />
    </CurrencyProvider>
  );
}
