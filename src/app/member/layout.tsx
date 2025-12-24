import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import MemberNav from '@/components/layout/member-nav';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
  variable: '--font-oswald',
});

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
    <div className={`${outfit.variable} ${oswald.variable} font-sans antialiased bg-bad-dark text-white selection:bg-accent selection:text-black min-h-screen`}>
      {children}
      <Toaster />
      <MemberNav />
    </div>
  );
}
