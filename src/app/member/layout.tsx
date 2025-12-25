import type { Metadata } from 'next';
import MemberSidebar from '@/components/layout/member-sidebar';

export const metadata: Metadata = {
  title: 'Member Area | BadminTour',
  description: 'Manage your badminton schedule.',
};

export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#ffbe00] selection:text-black relative">
       
       {/* Background Ambience Global */}
       <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ffbe00]/5 via-transparent to-transparent pointer-events-none z-0"></div>

       {/* Sidebar Navigation */}
       <MemberSidebar />
       
       {/* Main Content Wrapper */}
       {/* pl-0 md:pl-32 memberikan ruang untuk sidebar di desktop */}
       <main className="relative z-10 w-full pl-0 md:pl-32 pr-0 md:pr-8 py-4 md:py-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
       </main>
    </div>
  );
}
