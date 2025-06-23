import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col">
          <Header />
          <div className="flex-1 gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
