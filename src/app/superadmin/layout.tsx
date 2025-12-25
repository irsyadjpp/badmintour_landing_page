import type { Metadata } from 'next';
import '../../globals.css';
import { Toaster } from '@/components/ui/toaster';
import SuperAdminSidebar from '@/components/layout/superadmin-sidebar';

export const metadata: Metadata = {
  title: 'Superadmin Command Center | BADMINTOUR',
  description: 'Highest level access control.',
};

export default function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans flex flex-col antialiased selection:bg-[#ffbe00] selection:text-black overflow-x-hidden">
      
      <SuperAdminSidebar />
      
      {/* Background Ambience khusus Superadmin (Gold Tint) */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ffbe00]/5 via-transparent to-transparent pointer-events-none z-0"></div>

      <main className="flex-1 w-full pl-6 md:pl-28 pr-6 py-8 relative z-10">
        <div className="max-w-[1600px] mx-auto w-full">
            {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}
