'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Users, DollarSign, ScanQr, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function HostNav() {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('dashboard');
  const [indicatorStyle, setIndicatorStyle] = useState<{ left?: string; opacity: number, transform?: string }>({ opacity: 0 });
  
  const navRef = useRef<HTMLDivElement>(null);
  const leftDockRef = useRef<HTMLDivElement>(null);
  const rightDockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, you'd listen to tab changes or scroll sections
    // For now, we'll just set it to dashboard
    let currentPage = 'dashboard';
    if (pathname.includes('/host/dashboard')) {
        // A more complex logic would be needed if using hash routes like #players
        // This is a simplified version.
        setActivePage(currentPage);
    }
  }, [pathname]);

  useEffect(() => {
    const item: HTMLElement | null = navRef.current?.querySelector(`[data-page='${activePage}']`);
    if (!item) return;

    const parentDock = ['dashboard', 'players'].includes(activePage) ? leftDockRef.current : rightDockRef.current;
    if (!parentDock) return;

    const rect = item.getBoundingClientRect();
    const parentRect = parentDock.getBoundingClientRect();
    const offset = rect.left - parentRect.left + (rect.width / 2) - 16; // 16 is half of indicator width

    setIndicatorStyle({
        transform: `translateX(${offset}px)`,
        opacity: 1,
    });
  }, [activePage]);

  const navItems = [
    { page: 'dashboard', href: '/host/dashboard', icon: ClipboardList, dock: 'left' },
    { page: 'players', href: '#players', icon: Users, dock: 'left' },
    { page: 'finance', href: '#finance', icon: DollarSign, dock: 'right' },
  ]

  const renderNavItem = (item: any) => (
    <Link 
        key={item.page}
        href={item.href} 
        data-page={item.page}
        onClick={() => setActivePage(item.page)}
        className="host-nav-item w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition"
    >
        <item.icon className={cn("w-6 h-6 transition-colors duration-300", activePage === item.page ? (['dashboard', 'players'].includes(item.page) ? 'text-green-500' : 'text-bad-red') : 'text-gray-400')} />
    </Link>
  );

  return (
    <nav ref={navRef} className="fixed bottom-6 left-0 right-0 z-[99] px-4 pointer-events-none font-sans">
        <div className="max-w-md mx-auto flex items-end justify-between gap-2">

            {/* Left Dock */}
            <div ref={leftDockRef} className="pointer-events-auto flex-1 bg-[#1A1A1A] border border-white/10 rounded-[2rem] p-1.5 shadow-2xl flex justify-around items-center h-16 relative overflow-hidden">
                 <div id="host-indicator-left" className="absolute bottom-1 w-8 h-1 bg-green-500 rounded-full blur-[2px] transition-all duration-300" style={{ transform: indicatorStyle.transform, opacity: ['dashboard', 'players'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'left').map(renderNavItem)}
            </div>

            {/* Center Action Button */}
            <div className="pointer-events-auto relative -top-3">
                <button onClick={() => alert('Buka Kamera Scan QR...')} className="group w-16 h-16 bg-bad-yellow rounded-[1.5rem] shadow-[0_8px_20px_rgba(255,235,59,0.3)] flex items-center justify-center border-4 border-gray-100 dark:border-background hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                    <ScanQr className="w-8 h-8 text-black group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Right Dock */}
            <div ref={rightDockRef} className="pointer-events-auto flex-1 bg-[#1A1A1A] border border-white/10 rounded-[2rem] p-1.5 shadow-2xl flex justify-around items-center h-16 relative overflow-hidden">
                <div id="host-indicator-right" className="absolute bottom-1 w-8 h-1 bg-bad-red rounded-full blur-[2px] transition-all duration-300" style={{ transform: indicatorStyle.transform, opacity: ['finance'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'right').map(renderNavItem)}
                <Link href="/login" className="host-nav-item w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition">
                   <div className="w-8 h-8 rounded-full bg-gray-600 border border-gray-500 overflow-hidden">
                        <Image src="https://ui-avatars.com/api/?name=Host&background=D32F2F&color=fff" alt="Host" width={32} height={32}/>
                    </div>
                </Link>
            </div>
        </div>
    </nav>
  );
}
