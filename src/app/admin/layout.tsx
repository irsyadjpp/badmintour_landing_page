import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import AdminNav from '@/components/layout/admin-nav';

export const metadata: Metadata = {
  title: 'Admin Dashboard | BADMINTOUR',
  description: 'System management for Badmintour.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
       <body className={`font-sans antialiased bg-muted/20`} suppressHydrationWarning>
        {children}
        <Toaster />
        <AdminNav />
      </body>
    </html>
  );
}
