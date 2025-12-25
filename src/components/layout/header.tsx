'use client'; // WAJIB ADA untuk interaksi UI (Mobile Menu)

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Definisi Menu Navigasi
const navItems = [
  { name: 'Home', href: '/#hero' },
  { name: 'Services', href: '/#services' },
  { name: 'Jadwal Mabar', href: '/#schedule' },
  { name: 'Jersey', href: '/jersey' },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0,0)}>
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
             {/* Ganti dengan Image jika sudah ada logo.png */}
             {/* <Image src="/images/logo.png" alt="Logo" width={40} height={40} /> */}
             <span className="text-xl">🏸</span>
          </div>
          <span className="font-heading text-xl font-black tracking-tight hidden sm:block">
            BADMIN<span className="text-primary">TOUR</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            Join Member
          </Button>
        </nav>

        {/* MOBILE NAV (SHEET) */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {/* TRIGGER BUTTON */}
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>

            {/* DRAWER CONTENT */}
            <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-border bg-background/95 backdrop-blur-xl p-6">
              <SheetHeader className="mb-8 text-left">
                <SheetTitle className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-lg">🏸</div>
                   <span className="font-heading text-lg font-black tracking-tight">
                      MENU <span className="text-primary">UTAMA</span>
                   </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center py-4 px-4 text-base font-bold uppercase tracking-wider rounded-xl transition-all",
                        pathname === item.href 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-muted"
                      )}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
                
                <div className="my-4 h-[1px] bg-border w-full" />

                <SheetClose asChild>
                   <Button className="w-full h-12 rounded-xl text-base font-bold bg-primary text-white shadow-lg">
                      Daftar / Login
                   </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
