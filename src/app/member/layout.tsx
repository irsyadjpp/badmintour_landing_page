import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import MemberHeader from '@/components/layout/member-header';

export const metadata: Metadata = {
  title: 'Member Area | BADMINTOUR',
  description: 'Community hub for Badmintour members.',
};

export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-bad-dark text-white selection:bg-accent selection:text-black min-h-screen">
        <MemberHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
