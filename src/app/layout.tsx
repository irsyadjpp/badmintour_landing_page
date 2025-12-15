import type { Metadata } from 'next';
import { Outfit } from 'next/font/google'; // Import font Outfit
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit', // Set variable CSS
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
      <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
