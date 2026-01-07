'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function HostMainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMatchPage = pathname?.startsWith('/host/match');

  return (
    <main
      className={cn(
        "relative z-10 w-full flex-1 transition-all duration-300",
        isMatchPage
          // Match Page: Minimal padding, extend to edges
          ? "pl-0 pr-0 md:pl-28 md:pr-0 py-0"
          // Standard: Boxed with padding
          : "pl-6 md:pl-28 pr-6 py-8"
      )}
    >
      <div className={cn(
        "w-full mx-auto transition-all duration-300",
        isMatchPage ? "" : "max-w-[1400px]"
      )}>
        {children}
      </div>
    </main>
  )
}
