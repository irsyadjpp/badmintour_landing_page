import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BadminTour',
  description: 'Aturan main dan kode etik di komunitas BadminTour.',
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
