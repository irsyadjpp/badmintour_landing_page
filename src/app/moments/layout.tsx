import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Moments Gallery',
  description: 'Kumpulan momen seru komunitas BadminTour.',
};

export default function MomentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
