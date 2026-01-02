import type { Metadata } from 'next';
import MemberSidebar from '@/components/layout/member-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { PinAnnouncementModal } from '@/components/auth/pin-announcement-modal';

export const metadata: Metadata = {
  title: 'Member Dashboard',
  description: 'Manage your badminton schedule.',
};

export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // REVISI: Tambahkan 'flex flex-col' untuk memastikan div membungkus penuh
    // dan background color diterapkan ke seluruh tinggi konten (bukan hanya viewport)
    <div className="min-h-screen w-full flex flex-col bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#ffbe00] selection:text-black relative">

      {/* Background Ambience Global - Fixed position agar tetap di tempat saat scroll */}
      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ffbe00]/5 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Sidebar Navigation */}
      <MemberSidebar />

      {/* Main Content Wrapper */}
      {/* Tambahkan 'flex-1' agar main mengisi sisa ruang jika konten sedikit */}
      <main className="relative z-10 w-full flex-1 pl-0 md:pl-32 pr-0 md:pr-8 py-4 md:py-8">
        <div className="max-w-[1400px] mx-auto w-full h-full">
          {children}
        </div>
      </main>
      <Toaster />
      <PinAnnouncementModal />
    </div>
  );
}
