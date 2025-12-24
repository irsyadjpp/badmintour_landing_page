import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import HostNav from '@/components/layout/host-nav';

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
    <html lang="id" className="dark" suppressHydrationWarning>
       <body className={`font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        {children}
        <Toaster />
        <HostNav />
      </body>
    </html>
  );
}
