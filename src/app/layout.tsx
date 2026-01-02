import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/components/providers/next-auth-provider';
import QueryProvider from '@/components/providers/query-provider';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
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
      <body className={`${outfit.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground`}>
        <NextAuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
