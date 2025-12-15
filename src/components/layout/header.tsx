'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] px-4",
      isScrolled ? "py-4" : "pt-6" // Adjusted padding for top position
    )}>
      <div className={cn(
        "flex items-center justify-between transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-white/20 shadow-xl dark:shadow-black/20 rounded-full px-6 h-[60px]"
          : "w-full max-w-6xl h-[72px]"
      )}>

        {/* 1. LOGO SECTION */}
        <Link href="/" className="flex items-center gap-2 group">
           <div className={cn("relative flex items-center justify-center w-10 h-10 rounded-full text-white overflow-hidden group-hover:scale-105 transition-transform", isScrolled ? "bg-primary" : "bg-primary")}>
             <Zap className="w-5 h-5 absolute z-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <span className={cn("font-heading font-black text-xl tracking-tighter", isScrolled ? "text-foreground" : "text-foreground")}>
            Badmin<span className="text-primary">Tour</span>
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* 2. DESKTOP NAVIGATION */}
        <div className={cn(
            "hidden md:flex items-center font-bold text-sm",
            isScrolled ? "gap-6 text-muted-foreground" : "gap-8 text-foreground/90"
        )}>
            <Link href="#hero" className="hover:text-primary transition relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#services" className="hover:text-primary transition relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#schedule" className="hover:text-primary transition relative group">
                Schedule
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#community" className="hover:text-primary transition flex items-center gap-1">
                Community
            </Link>
        </div>

        {/* 3. CTA */}
        <Link href="/login" className={cn(
            "rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg",
             isScrolled ? "bg-primary text-primary-foreground px-5 py-2" : "bg-primary text-primary-foreground px-6 py-2.5"
        )}>
            Join Member
        </Link>

      </div>
    </header>
  );
}
