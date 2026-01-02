import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Details',
  description: 'Informasi lengkap event badminton.',
};

export default function EventDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
