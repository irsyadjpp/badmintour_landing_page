'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false); // State untuk kontrol Sheet

  React.useEffect(() => {
    const SCROLL_THRESHOLD = 30;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll(); 
    window.addEventListener('scroll', handleScroll, { passive: true });
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
        <Link href="/" className="flex items-center gap-3 group z-20" onClick={() => window.scrollTo(0,0)}>
          <div className={cn("h-8 w-auto transition-transform duration-500 origin-left flex items-center", isScrolled ? 'scale-0 w-0' : 'scale-100')}>
             {/* Pastikan file ini ada di public/images/logo.png, jika tidak, ganti src atau hapus Image */}
             {/* <Image src="/images/logo.png" alt="Badmintour Logo" width={28} height={28} className="object-contain" /> */}
             <span className="text-2xl">🏸</span>
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
        </Link>

        {/* DESKTOP MENU (Hidden on Mobile) */}
        <div
          id="menu-group"
          className={cn(
            'hidden lg:flex items-center gap-1 z-20',
            isScrolled ? 'text-white' : 'text-gray-900'
          )}
        >
          {/* Menu Item 1: Play Area */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Play Area
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-56 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
              <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl overflow-hidden ring-1 ring-black/5 text-left">
                <Link href="/#schedule" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">🔥 Mabar Rutin</Link>
                <Link href="/#services" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">⚔️ Sparring & Fun</Link>
                <Link href="/#schedule" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-accent hover:text-black transition text-sm font-bold border-t border-gray-100 mt-1">🏆 Turnamen Resmi</Link>
              </div>
            </div>
          </div>

          {/* Menu Item 2: Training */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Training
              <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5 text-left">
                        <Link href="/#services" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">🚀 Drilling Program</Link>
                        <Link href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">👟 Private Coach</Link>
                    </div>
                </div>
          </div>
          
          {/* Menu Item 3: Community */}
          <div className="relative group">
            <button className={cn('menu-link px-5 py-2 font-black uppercase tracking-wider text-sm transition flex items-center gap-1', isScrolled ? 'hover:text-accent' : 'hover:text-primary')}>
              Community
               <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" strokeWidth={3} />
            </button>
             <div className="absolute top-full right-0 mt-6 w-48 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out pt-2">
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-2 shadow-xl ring-1 ring-black/5 text-left">
                        <Link href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-accent hover:text-black transition text-sm font-bold">👑 Hall of Fame</Link>
                        <Link href="#" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition text-sm font-bold">📸 Momen Seru</Link>
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
          
          {/* MOBILE MENU TOGGLE (SHEET) */}
          <div className="lg:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className={cn(
                      'p-2 rounded-full transition flex items-center justify-center',
                      isScrolled
                        ? 'text-white bg-white/10 hover:bg-white/20'
                        : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                    )}
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                
                {/* DRAWER CONTENT */}
                <SheetContent side="top" className="w-full border-b border-border bg-background/95 backdrop-blur-xl p-6 rounded-b-[2rem]">
                    <SheetHeader className="mb-6 flex flex-row items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <span className="text-2xl">🏸</span>
                            <span className="font-heading text-xl font-black tracking-tight">
                                BADMIN<span className="text-primary">TOUR</span>
                            </span>
                        </SheetTitle>
                        {/* Tombol Close otomatis ada di kanan atas oleh SheetContent */}
                    </SheetHeader>
                    
                    <div className="flex flex-col gap-2">
                        <div className="grid gap-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mt-2 mb-1">Play Area</p>
                            <SheetClose asChild>
                                <Link href="/#schedule" className="flex items-center justify-between py-3 px-4 text-sm font-bold bg-secondary/50 rounded-xl">
                                    Mabar Rutin <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/#services" className="flex items-center justify-between py-3 px-4 text-sm font-bold bg-secondary/50 rounded-xl">
                                    Turnamen <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                                </Link>
                            </SheetClose>
                        </div>
                        
                        <div className="grid gap-2 mt-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mt-2 mb-1">Training</p>
                            <SheetClose asChild>
                                <Link href="/#services" className="flex items-center justify-between py-3 px-4 text-sm font-bold bg-secondary/50 rounded-xl">
                                    Drilling Program <ArrowRight className="w-4 h-4 text-muted-foreground"/>
                                </Link>
                            </SheetClose>
                        </div>

                         <div className="mt-6 pt-6 border-t border-border">
                            <SheetClose asChild>
                                <Link href="/login" className="flex items-center justify-center w-full h-12 rounded-xl text-base font-bold bg-primary text-white shadow-lg hover:bg-primary/90 transition">
                                    Login Member
                                </Link>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Island Background */}
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
