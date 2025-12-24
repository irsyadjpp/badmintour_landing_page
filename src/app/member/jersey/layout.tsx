import type { Metadata } from 'next';
import { Outfit, Oswald } from 'next/font/google';
import '../../globals.css';
import { Toaster } from '@/components/ui/toaster';

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
  title: 'Exclusive Drop | BADMINTOUR',
  description: 'Limited edition merchandise drop for Badmintour community members.',
};

export default function MerchDropLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${oswald.variable} font-sans antialiased bg-bad-dark text-white selection:bg-accent selection:text-black`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
