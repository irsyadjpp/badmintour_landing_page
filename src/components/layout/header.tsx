'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const SCROLL_THRESHOLD = 20;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    // Panggil sekali saat load untuk handle refresh di tengah halaman
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-6 px-4 pointer-events-none">
      
      <div 
        className={cn(
            "pointer-events-auto flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
            isScrolled
              ? 'w-auto max-w-[90%] bg-[#121212]/90 backdrop-blur-xl rounded-full py-3 px-6 shadow-2xl border border-white/10 mt-2'
              : 'w-full max-w-7xl py-4 px-2'
        )}
      >

        <Link href="/" className="flex items-center gap-1 group pl-2">
            <span className={cn("text-2xl transition-transform duration-500 origin-center", isScrolled ? 'scale-0 w-0 mr-0' : 'scale-100')}>🏸</span>
            <span className={cn("font-black tracking-tighter text-white drop-shadow-md group-hover:text-primary transition-colors duration-300", isScrolled ? 'text-lg' : 'text-2xl')}>
                Badmin<span className="text-primary">Tour</span><span className="text-accent">.</span>
            </span>
        </Link>

        <div className={cn("hidden md:flex items-center font-bold transition-all duration-500", isScrolled ? 'gap-5 text-gray-200' : 'gap-8 text-white')}>
            <Link href="#hero" className="hover:text-accent transition relative group text-sm tracking-wide">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#services" className="hover:text-accent transition relative group text-sm tracking-wide">
                Aktivitas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#schedule" className="hover:text-accent transition relative group text-sm tracking-wide">
                Jadwal
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#community" className="hover:text-accent transition flex items-center gap-1 text-sm tracking-wide">
                <span className="text-accent">📸</span> Momen
            </Link>
        </div>

        <Link href="/login" className="bg-white text-foreground px-6 py-2.5 rounded-full text-sm font-black hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap">
            LOGIN
        </Link>

      </div>
    </nav>
  );
}
