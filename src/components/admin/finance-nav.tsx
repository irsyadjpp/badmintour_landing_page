
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DollarSign, Package, FileSpreadsheet, Wallet, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FinanceNav() {
  const pathname = usePathname();

  const navItems = [
    { title: "Transactions (Ledger)", href: "/admin/finance", icon: DollarSign, exact: true },
    { title: "Inventory & Assets", href: "/admin/finance/inventory", icon: Package, exact: false },
    { title: "Chart of Accounts", href: "/admin/finance/coa", icon: Wallet, exact: false }, // Re-using icon or new one
    { title: "Approvals", href: "/admin/finance/approvals", icon: CheckCircle, exact: false },
    { title: "Laba Rugi (Reports)", href: "/admin/finance/reports", icon: FileSpreadsheet, exact: false }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#151515] p-2 rounded-2xl border border-white/5 w-fit">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "flex items-center gap-2 rounded-xl h-10 px-4 transition-all",
                isActive
                  ? "bg-[#ffbe00] text-black font-bold shadow-lg hover:bg-[#ffbe00]/90"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </div>
  );
}
