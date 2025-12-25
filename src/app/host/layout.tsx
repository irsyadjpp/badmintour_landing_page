import type { Metadata } from 'next';
import HostSidebar from '@/components/layout/host-sidebar';

export const metadata: Metadata = {
  title: 'Host Dashboard | BadminTour',
  description: 'Manage your badminton events.',
};

export default function HostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Menggunakan warna background #0a0a0a yang konsisten
    <div className="min-h-screen w-full flex flex-col bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#ffbe00] selection:text-black relative overflow-x-hidden">
       
       {/* Background Ambience Global (Red Tint for Host) */}
       <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#ca1f3d]/10 via-transparent to-transparent pointer-events-none z-0"></div>

       <HostSidebar />
       
       <main className="relative z-10 w-full flex-1 pl-0 md:pl-32 pr-0 md:pr-8 py-4 md:py-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
       </main>
    </div>
  );
}
