'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, User, Scan, Shirt, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function MemberNav() {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState<{ left?: string; opacity: number, transform?: string }>({ opacity: 0 });
  
  const navRef = useRef<HTMLDivElement>(null);
  const leftDockRef = useRef<HTMLDivElement>(null);
  const rightDockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentPage = '';
    if (pathname.includes('/dashboard')) currentPage = 'dashboard';
    else if (pathname.includes('/jersey')) currentPage = 'jersey';
    else if (pathname.includes('/history')) currentPage = 'history';
    else if (pathname.includes('/profile')) currentPage = 'profile';
    setActivePage(currentPage);
  }, [pathname]);

  useEffect(() => {
    if (!activePage) {
        setIndicatorStyle({ opacity: 0 });
        return;
    };

    const item: HTMLElement | null = navRef.current?.querySelector(`[data-page='${activePage}']`);
    if (!item) return;

    const parentDock = ['dashboard', 'history'].includes(activePage) ? leftDockRef.current : rightDockRef.current;
    if (!parentDock) return;

    const rect = item.getBoundingClientRect();
    const parentRect = parentDock.getBoundingClientRect();
    const offset = rect.left - parentRect.left + (rect.width / 2) - 24; // 24 is half of indicator width (w-12/2)

    const indicatorColorClass = ['dashboard', 'history'].includes(activePage) ? 'bg-accent/80' : 'bg-primary/80';
    
    setIndicatorStyle({
        transform: `translateX(${offset}px)`,
        opacity: 1,
    });

  }, [activePage]);

  const navItems = [
    { page: 'dashboard', href: '/member/dashboard', icon: Home, dock: 'left' },
    { page: 'history', href: '#', icon: History, dock: 'left' },
    { page: 'jersey', href: '/member/jersey', icon: Shirt, dock: 'right', notification: true },
    { page: 'profile', href: '#', icon: User, dock: 'right' },
  ]

  const renderNavItem = (item: any) => (
    <Link 
        key={item.page}
        href={item.href} 
        data-page={item.page}
        className="nav-item relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 active:scale-90 group"
    >
        {item.notification && (
             <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border border-[#121212] z-10"></span>
        )}
        <item.icon className={cn("w-6 h-6 transition-colors duration-300", activePage === item.page ? (item.dock === 'left' ? 'text-accent' : 'text-primary') : 'text-gray-400')} />
    </Link>
  );

  return (
    <nav ref={navRef} className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <div className="max-w-md mx-auto flex items-end justify-between gap-3">

            {/* Left Dock */}
            <div ref={leftDockRef} className="pointer-events-auto flex-1 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 shadow-2xl flex justify-around items-center h-20 relative overflow-hidden">
                 <div id="left-indicator" className="absolute bottom-2 w-12 h-1 bg-accent/80 rounded-full blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" style={{ transform: indicatorStyle.transform, opacity: ['dashboard', 'history'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'left').map(renderNavItem)}
            </div>

            {/* Center Action Button */}
            <div className="pointer-events-auto relative -top-2">
                <button className="group w-20 h-20 bg-gradient-to-br from-accent to-[#FBC02D] rounded-[2rem] shadow-[0_10px_30px_rgba(255,235,59,0.4)] flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-110 hover:-translate-y-2 hover:rotate-3 border-4 border-background">
                    <Scan className="w-8 h-8 text-black mb-0.5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                    <span className="text-[10px] font-black text-black uppercase tracking-wider">SCAN</span>
                    <span className="absolute inset-0 rounded-[2rem] ring-4 ring-white/20 animate-ping opacity-0 group-hover:opacity-100"></span>
                </button>
            </div>

            {/* Right Dock */}
            <div ref={rightDockRef} className="pointer-events-auto flex-1 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-2 shadow-2xl flex justify-around items-center h-20 relative overflow-hidden">
                <div id="right-indicator" className="absolute bottom-2 w-12 h-1 bg-primary/80 rounded-full blur-[2px] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" style={{ transform: indicatorStyle.transform, opacity: ['jersey', 'profile'].includes(activePage) ? indicatorStyle.opacity : 0 }}></div>
                {navItems.filter(i => i.dock === 'right').map(item => {
                    if (item.page === 'profile') {
                        return (
                             <Link key={item.page} href={item.href} data-page={item.page} className="nav-item relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 active:scale-90">
                                <div className={cn("w-8 h-8 rounded-full bg-gray-600 overflow-hidden border-2 transition-all", activePage === 'profile' ? 'border-primary' : 'border-transparent')}>
                                    <Image src="https://ui-avatars.com/api/?name=User&background=333&color=fff" alt="Profile" width={32} height={32} />
                                </div>
                            </Link>
                        )
                    }
                    return renderNavItem(item);
                })}
            </div>

        </div>
    </nav>
  );
}
