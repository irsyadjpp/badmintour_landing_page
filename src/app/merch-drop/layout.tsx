import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
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
      <body className={`${outfit.variable} font-sans antialiased bg-bad-dark text-white selection:bg-accent selection:text-black`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
