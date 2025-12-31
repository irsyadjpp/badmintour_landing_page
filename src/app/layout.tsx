import type { Metadata } from 'next';
import { Outfit } from 'next/font/google'; // Hapus Oswald
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/components/providers/next-auth-provider';
import QueryProvider from '@/components/providers/query-provider';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'BadminTour - Komunitas Badminton Modern',
  description: 'Platform Mabar, Sparring, dan Coaching Badminton.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      {/* Hapus variable oswald dari className body */}
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        <NextAuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
