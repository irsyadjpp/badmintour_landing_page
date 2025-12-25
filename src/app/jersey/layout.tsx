import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="id" className="scroll-smooth">
        <body className='font-sans bg-bad-dark text-white selection:bg-bad-yellow selection:text-black'>
            {children}
            <Toaster />
        </body>
    </html>
  );
}
