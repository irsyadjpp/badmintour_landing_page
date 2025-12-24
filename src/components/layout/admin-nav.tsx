'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function AdminNav() {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState<{ left?: string; opacity: number, transform?: string }>({ opacity: 0 });
  
  const navRef = useRef<HTMLDivElement>(null);
  const leftDockRef = useRef<HTMLDivElement>(null);
  const rightDockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentPage = 'dashboard'; // Default
    if (pathname.includes('/admin/dashboard')) currentPage = 'dashboard';
    else if (pathname.includes('/admin/members')) currentPage = 'members';
    else if (pathname.includes('/admin/events')) currentPage = 'events';
    setActivePage(currentPage);
  }, [pathname]);

  useEffect(() => {
    if (!activePage) {
        setIndicatorStyle({ opacity: 0 });
        return;
    };

    const item: HTMLElement | null = navRef.current?.querySelector(`[data-page='${activePage}']`);
    if (!item) return;

    const parentDock = ['dashboard', 'members'].includes(activePage) ? leftDockRef.current : rightDockRef.current;
    if (!parentDock) return;

    const rect = item.getBoundingClientRect();
    const parentRect = parentDock.getBoundingClientRect();
    const offset = rect.left - parentRect.left + (rect.width / 2) - 16; // 16 is half of indicator width (w-8/2)

    setIndicatorStyle({
        transform: `translateX(${offset}px)`,
        opacity: 1,
    });

  }, [activePage]);

  const navItems = [
    { page: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard, dock: 'left' },
    { page: 'members', href: '#', icon: Users, dock: 'left' },
    { page: 'events', href: '#', icon: Calendar, dock: 'right' },
  ]

  const renderNavItem = (item: any) => (
    <Link 
        key={item.page}
        href={item.href} 
        data-page={item.page}
        className="admin-nav-item w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
    >
        <item.icon className={cn("w-6 h-6 transition-colors duration-300", activePage === item.page ? (['dashboard', 'members'].includes(item.page) ? 'text-black' : 'text-bad-red') : 'text-gray-400')} />
    </Link>
  );

  return (
    <nav ref={navRef} className="fixed bottom-6 left-0 right-0 z-[99] px-4 pointer-events-none font-sans">
        <div className="max-w-md mx-auto flex items-end justify-between gap-2">

            {/* Left Dock */}
            <div ref={leftDockRef} className="pointer-events-auto flex-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-1.5 shadow-2xl flex justify-around items-center h-16 relative overflow-hidden">
                 <div id="admin-indicator-left" className="absolute bottom-1 w-8 h-1 bg-black rounded-full blur-[1px] transition-all duration-300" style={{ transform: indicatorStyle.transform, opacity: ['dashboard', 'members'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'left').map(renderNavItem)}
            </div>

            {/* Center Action Button */}
            <div className="pointer-events-auto relative -top-3">
                <button className="group w-16 h-16 bg-black text-white rounded-[1.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-white hover:scale-110 hover:-translate-y-1 transition-all duration-300">
                    <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            {/* Right Dock */}
            <div ref={rightDockRef} className="pointer-events-auto flex-1 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-[2rem] p-1.5 shadow-2xl flex justify-around items-center h-16 relative overflow-hidden">
                <div id="admin-indicator-right" className="absolute bottom-1 w-8 h-1 bg-bad-red rounded-full blur-[1px] transition-all duration-300" style={{ transform: indicatorStyle.transform, opacity: ['events'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'right').map(renderNavItem)}
                 <Link href="/login" className="admin-nav-item w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                        ADM
                    </div>
                </Link>
            </div>
        </div>
    </nav>
  );
}