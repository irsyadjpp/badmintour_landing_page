import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import HostSidebar from '@/components/layout/host-sidebar';

export const metadata: Metadata = {
  title: 'Host Dashboard | BADMINTOUR',
  description: 'Session management for Badmintour hosts.',
};

export default function HostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans antialiased bg-bad-dark text-white min-h-screen`}>
        <HostSidebar />
        <main className="ml-24 p-6 transition-all duration-500">
            {children}
        </main>
      <Toaster />
    </div>
  );
}
