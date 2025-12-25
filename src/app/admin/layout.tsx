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
    // Background global gelap
    <div className={`font-sans antialiased bg-[#121212] text-white min-h-screen selection:bg-bad-yellow selection:text-black`}>
      <AdminSidebar />
      {/* PERBAIKAN LAYOUT:
         - ml-24: Memberi jarak pas untuk sidebar (w-20 + gap)
         - p-8: Padding keliling yang konsisten
         - max-w-7xl: Mencegah konten terlalu melebar di layar ultrawide
      */}
      <main className="ml-24 p-8 w-[calc(100%-6rem)] mx-auto max-w-[1600px]">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
