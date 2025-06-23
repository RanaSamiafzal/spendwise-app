import { Header } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';
import { CurrencyProvider } from '@/contexts/currency-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-1 bg-muted/40 p-4 lg:p-6">{children}</main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
}
