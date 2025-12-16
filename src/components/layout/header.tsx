'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const SCROLL_THRESHOLD = 30;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    // Panggil sekali saat load
    handleScroll(); 
    
    // Tambahkan event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Hapus event listener saat komponen unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none font-sans">
      <nav
        id="island"
        className={cn(
          'pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          // Tentukan warna teks berdasarkan state scroll
          isScrolled ? 'text-white' : 'text-gray-900',
          // Logika perubahan shape dari JS user
          isScrolled
            ? 'w-auto max-w-5xl py-3 px-5'
            : 'w-full max-w-7xl py-5 px-6'
        )}
      >
        <a href="#" className="flex items-center gap-3 group z-20">
          <div className={cn("h-10 w-auto transition-transform duration-500 origin-left flex items-center", isScrolled ? 'scale-0 w-0' : 'scale-100')}>
             <Image src="/images/logo.png" alt="Badmintour Logo" width={40} height={40} className="object-contain" />
          </div>
          <span
            id="brand-text"
            className={cn(
              'font-black tracking-tighter group-hover:text-primary transition-colors',
              isScrolled ? 'text-white text-xl' : 'text-gray-900 text-2xl'
            )}
          >
            BADMINTOUR<span className={cn(isScrolled ? "text-accent" : "text-primary")}>.</span>
          </span>
        </a>

        <div
          id="menu-group"
          className={cn(
            'hidden lg:flex items-center gap-1 z-20',
            isScrolled ? 'text-white' : 'text-gray-900'
          )}
        >
          {/* Menu Item 1 */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Play Area
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
              <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl overflow-hidden ring-1 ring-black/5">
                <a href="#schedule" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">🔥 Mabar Rutin</a>
                <a href="#services" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">⚔️ Sparring & Fun</a>
                <a href="#schedule" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-accent hover:text-black transition text-sm font-bold border-t border-gray-100 mt-1">🏆 Turnamen Resmi</a>
              </div>
            </div>
          </div>

          {/* Menu Item 2 */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Training
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5">
                        <a href="#services" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">🚀 Drilling Program</a>
                        <a href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">👟 Private Coach</a>
                    </div>
                </div>
          </div>
          
          {/* Menu Item 3 */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Community
               <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
             <div className="absolute top-full right-0 mt-6 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5">
                        <a href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-accent hover:text-black transition text-sm font-bold">👑 Hall of Fame</a>
                        <a href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">📸 Momen Seru</a>
                    </div>
                </div>
          </div>

        </div>

        <div className="flex items-center gap-3 z-20">
          <Link
            href="/login"
            id="btn-login"
            className={cn(
              'rounded-full text-sm font-black hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap',
              isScrolled
                ? 'bg-white text-black px-6 py-2'
                : 'bg-primary text-white px-7 py-3'
            )}
          >
            LOGIN
          </Link>
          <button
            id="mobile-toggle"
            className={cn(
              'lg:hidden p-2 rounded-full transition',
              isScrolled
                ? 'text-white bg-white/10'
                : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
            )}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div
          id="island-bg"
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10',
            isScrolled
              ? 'bg-[#1A1A1A]/90 backdrop-blur-xl rounded-full border-white/10 shadow-2xl border'
              : 'bg-white/0 backdrop-blur-0 rounded-none border-transparent shadow-none'
          )}
        ></div>
      </nav>
    </header>
  );
}
