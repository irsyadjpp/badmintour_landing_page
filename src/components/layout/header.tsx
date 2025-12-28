'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, UserCircle2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

// Definisi Menu agar konsisten Desktop & Mobile
const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Jadwal Mabar', href: '/#schedule' },
    { label: 'Program Latihan', href: '/#services' },
    { label: 'Momen Seru', href: '/moments' }, // Menu Baru
];

export default function Header() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = React.useState(false);

    // Logic: Navbar jadi gelap jika di-scroll ATAU sedang di halaman /moments
    const isDarkHeader = isScrolled || pathname === '/moments';

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isDarkHeader 
                    ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-lg" 
                    : "bg-transparent py-5"
            )}
        >
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                
                {/* 1. LOGO */}
                <Link href="/" className="flex items-center gap-2 group z-50">
                    <div className="relative w-9 h-9 md:w-10 md:h-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-1 group-hover:border-[#ffbe00]/50 transition-colors">
                        <Image 
                            src="/images/logo-light.png" 
                            alt="Badmintour Logo" 
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <span className="font-black text-lg md:text-xl tracking-tighter text-white">
                        BADMINTOUR<span className="text-[#ffbe00]">.</span>
                    </span>
                </Link>

                {/* 2. DESKTOP NAVIGATION (Hidden on Mobile) */}
                <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/10">
                    {NAV_ITEMS.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-bold transition-all duration-300",
                                pathname === item.href 
                                    ? "bg-[#ffbe00] text-black shadow-lg shadow-[#ffbe00]/20" 
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* 3. DESKTOP ACTION (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login">
                        <Button className="rounded-full font-bold bg-white text-black hover:bg-gray-200 px-6 h-11 transition-transform hover:scale-105">
                            Login Member
                        </Button>
                    </Link>
                </div>

                {/* 4. MOBILE MENU (Visible on Mobile) */}
                <div className="md:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 w-10 h-10">
                                <Menu className="w-7 h-7" />
                            </Button>
                        </SheetTrigger>
                        
                        <SheetContent side="right" className="w-[85%] max-w-[320px] bg-[#0a0a0a] border-l border-white/10 p-0 text-white flex flex-col">
                            {/* Mobile Header */}
                            <SheetHeader className="p-6 border-b border-white/10 text-left">
                                <SheetTitle className="text-white font-black text-xl flex items-center gap-2">
                                     <Image 
                                        src="/images/logo-light.png" 
                                        alt="Logo" 
                                        width={32} 
                                        height={32}
                                        className="object-contain"
                                    />
                                    MENU
                                </SheetTitle>
                            </SheetHeader>
                            
                            {/* Mobile Links */}
                            <div className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto">
                                {NAV_ITEMS.map((item) => (
                                    <SheetClose key={item.href} asChild>
                                        <Link 
                                            href={item.href}
                                            className={cn(
                                                "flex items-center w-full p-4 rounded-xl text-base font-bold transition-all",
                                                pathname === item.href 
                                                    ? "bg-[#ffbe00] text-black" 
                                                    : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </div>

                            {/* Mobile Footer Action */}
                            <div className="p-6 border-t border-white/10 bg-[#151515]">
                                <SheetClose asChild>
                                    <Link href="/login" className="w-full">
                                        <Button className="w-full h-14 rounded-2xl font-black text-lg bg-white text-black hover:bg-gray-200 shadow-xl">
                                            <UserCircle2 className="w-5 h-5 mr-2" />
                                            LOGIN / DAFTAR
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <p className="text-center text-[10px] text-gray-600 mt-4 font-bold uppercase tracking-widest">
                                    &copy; 2026 Badmintour App
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}