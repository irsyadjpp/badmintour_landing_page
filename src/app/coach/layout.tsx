
import type { Metadata } from 'next';
import CoachSidebar from '@/components/layout/coach-sidebar';

export const metadata: Metadata = {
  title: 'Coach Dashboard | BadminTour',
  description: 'Manage your coaching sessions.',
};

export default function CoachLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#00f2ea] selection:text-black relative overflow-x-hidden">
       
       {/* Background Ambience (Cyan Tint for Coach) */}
       <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#00f2ea]/10 via-transparent to-transparent pointer-events-none z-0"></div>

       <CoachSidebar />
       
       <main className="relative z-10 w-full flex-1 pl-0 md:pl-32 pr-0 md:pr-8 py-4 md:py-8">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
       </main>
    </div>
  );
}
