import type { Metadata } from 'next';
import '../globals.css';
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-[#ffbe00] selection:text-black">
      <MemberHeader />
      <main>{children}</main>
    </div>
  );
}
