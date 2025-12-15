'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const SCROLL_THRESHOLD = 20;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <nav
        id="island"
        className={cn(
          'pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isScrolled
            ? 'w-auto max-w-5xl py-3 px-4'
            : 'w-full max-w-7xl py-5 px-6 rounded-none bg-transparent'
        )}
      >
        <Link href="/" className="flex items-center gap-2 group z-20">
          <div
            id="logo-icon"
            className={cn(
              'text-3xl transition-transform duration-500 origin-center',
              isScrolled ? 'scale-0 w-0' : 'scale-100 mr-2'
            )}
          >
            🏸
          </div>
          <span className="font-black text-2xl tracking-tighter text-white drop-shadow-md group-hover:text-accent transition-colors">
            Badmin<span className="text-accent">Tour</span><span className="text-yellow-400">.</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1 z-20">
          <div className="relative group">
            <button className="px-5 py-2 text-white font-black uppercase tracking-wider text-sm hover:text-accent transition flex items-center gap-1">
              Play Area
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" strokeWidth={3} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
                <Link href="#schedule" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                  🔥 Mabar Rutin
                </Link>
                <Link href="#services" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                  ⚔️ Sparring & Fun Game
                </Link>
                <Link href="#schedule" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-accent transition text-sm font-medium border-t border-white/5 mt-1">
                  🏆 Turnamen Resmi
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="px-5 py-2 text-white font-black uppercase tracking-wider text-sm hover:text-accent transition flex items-center gap-1">
              Training
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" strokeWidth={3} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                <Link href="#services" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                  🚀 Drilling Program
                </Link>
                <Link href="#" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                  👟 Private Coach
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="px-5 py-2 text-white font-black uppercase tracking-wider text-sm hover:text-accent transition flex items-center gap-1">
              Community
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-300" strokeWidth={3} />
            </button>
            <div className="absolute top-full right-0 mt-4 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
              <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                <Link href="#" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-accent transition text-sm font-medium">
                  👑 Hall of Fame
                </Link>
                <Link href="#" className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition text-sm font-medium">
                  📸 Momen Seru
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-20">
          <Link
            href="/login"
            id="btn-login"
            className={cn(
              'bg-white text-foreground rounded-full text-sm font-black hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap',
              isScrolled ? 'px-5 py-2' : 'px-7 py-3'
            )}
          >
            LOGIN
          </Link>
          <button className="lg:hidden text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>

        <div
          id="island-bg"
          className={cn(
            'absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10',
            isScrolled
              ? 'bg-[#121212]/80 backdrop-blur-xl rounded-full border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              : 'bg-transparent backdrop-blur-0 rounded-none border-transparent shadow-none'
          )}
        ></div>
      </nav>
    </header>
  );
}
