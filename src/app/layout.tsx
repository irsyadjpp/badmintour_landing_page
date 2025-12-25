import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google'; // Import font Oswald
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit', // Set variable CSS
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '700'],
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
      <body className={`${outfit.variable} ${oswald.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
