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
    <div className={`font-sans antialiased bg-bad-bg text-white min-h-screen selection:bg-white selection:text-black`}>
      <AdminSidebar />
      <main className="ml-28 mr-6 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
