import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google'; // Import font Oswald
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import NextAuthProvider from '@/components/providers/next-auth-provider';

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
  title: 'BadminTour | Community Hub',
  description: 'Platform booking lapangan dan komunitas badminton Bandung.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${outfit.variable} ${oswald.variable} font-sans antialiased`}>
        <NextAuthProvider>
            {children}
            <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
