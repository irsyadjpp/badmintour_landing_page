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
    <>
        {children}
        <Toaster />
    </>
  );
}
