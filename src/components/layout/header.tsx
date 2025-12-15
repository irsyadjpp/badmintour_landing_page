'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, Menu, X, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '#services', label: 'Layanan' },
  { href: '#schedule', label: 'Jadwal' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavContent = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            isMobile && 'block w-full p-4 text-lg'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'border-b border-border/40 bg-background/95 backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 z-50">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-headline font-black text-xl tracking-tight">BadminTour</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavContent />
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold">Masuk</Button>
          </Link>
          <Link href="/login?role=non-member">
             <Button className="hidden sm:flex rounded-full px-6 font-bold shadow-lg shadow-accent/20" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                Daftar Sekarang
             </Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px]">
                <div className="flex flex-col h-full mt-6">
                  <nav className="flex-1 space-y-4">
                    <NavContent isMobile />
                  </nav>
                   <div className="mt-auto p-4 space-y-4">
                        <Link href="/login" className="w-full block">
                            <Button variant="outline" className="w-full">Masuk</Button>
                        </Link>
                        <Link href="/login?role=non-member" className="w-full block">
                             <Button className="w-full font-bold" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Daftar Member</Button>
                        </Link>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
