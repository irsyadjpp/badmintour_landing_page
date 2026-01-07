import type { Metadata } from 'next';
import HostSidebar from '@/components/layout/host-sidebar';
import { PinAnnouncementModal } from '@/components/auth/pin-announcement-modal';

export const metadata: Metadata = {
  title: 'Host Dashboard',
  description: 'Manage your badminton events.',
};

import HostMainWrapper from "@/components/layout/host-main-wrapper";
import RoleSwitcher from "@/components/layout/role-switcher";

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

      {/* FLOATING ROLE SWITCHER (TOP RIGHT) */}
      <div className="fixed top-8 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <RoleSwitcher />
      </div>

      <HostMainWrapper>
        {children}
      </HostMainWrapper>

      <PinAnnouncementModal />
    </div>
  );
}
