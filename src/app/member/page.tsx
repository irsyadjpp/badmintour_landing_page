'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MemberPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/member/dashboard');
  }, [router]);

  return null;
}
