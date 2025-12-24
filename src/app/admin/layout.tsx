import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import AdminSidebar from '@/components/layout/admin-sidebar';

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
    <div className={`font-sans antialiased bg-muted/20 min-h-screen text-bad-dark`}>
      <AdminSidebar />
      <main className="ml-24 p-6 transition-all duration-500">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
