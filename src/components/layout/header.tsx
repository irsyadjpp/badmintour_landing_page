'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { 
  Menu, 
  Trophy, 
  Zap, 
  Users, 
  Swords, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const components: { title: string; href: string; description: string; icon: React.ElementType }[] = [
  {
    title: "Mabar Rutin",
    href: "/mabar",
    description: "Jadwal main rutin mingguan untuk semua level (Newbie - Advance).",
    icon: Users,
  },
  {
    title: "Cari Lawan Sparring",
    href: "/sparring",
    description: "Terima tantangan Fun Match atau Sparring antar komunitas.",
    icon: Swords,
  },
  {
    title: "Drilling & Academy",
    href: "/academy",
    description: "Program latihan intensif dan pengembangan bakat muda.",
    icon: Zap,
  },
  {
    title: "Info Turnamen",
    href: "/tournament",
    description: "Update jadwal turnamen BadminTour dan liga lokal Bandung.",
    icon: Trophy,
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  // Efek scroll untuk mengubah style header saat digulir
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // MD3 Concept: "Floating Surface". Header tidak menempel di atas, tapi mengambang.
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out p-4",
      isScrolled ? "pt-4" : "pt-6"
    )}>
      <div className={cn(
        "relative flex items-center justify-between w-full max-w-6xl transition-all duration-300",
        // Glassmorphism & Shape
        "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-white/20 shadow-xl dark:shadow-black/20",
        // Bentuk Pill (Kapsul) khas MD3 & Gen-Z
        "rounded-full px-6 h-[72px]" 
      )}>

        {/* 1. LOGO SECTION */}
        <Link href="/" className="flex items-center gap-2 group mr-4">
          <div className="relative flex items-center justify-center w-10 h-10 bg-primary rounded-full text-white overflow-hidden group-hover:scale-105 transition-transform">
             {/* Icon Badminton Abstrak */}
             <Zap className="w-5 h-5 absolute z-10" />
             <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
          <span className="font-heading font-black text-xl tracking-tighter">
            Badmin<span className="text-primary">Tour</span>
            <span className="text-accent">.</span>
          </span>
        </Link>

        {/* 2. DESKTOP NAVIGATION (MD3 Style) */}
        <div className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              
              {/* Menu 1: PLAY (Mabar, Sparring) */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-full bg-transparent hover:bg-secondary/50 data-[state=open]:bg-secondary/50 font-bold text-base">
                  Main
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-card rounded-[2rem]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-[1.5rem] bg-gradient-to-b from-primary/80 to-primary p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <Users className="h-8 w-8 text-white mb-2" />
                          <div className="mb-2 mt-2 text-lg font-black text-white">
                            Komunitas
                          </div>
                          <p className="text-sm leading-tight text-white/90 font-medium">
                            Bergabung dengan 1000+ member aktif di Bandung.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/mabar" title="Mabar Rutin" icon={Users}>
                      Jadwal main harian untuk Newbie - Advance.
                    </ListItem>
                    <ListItem href="/sparring" title="Sparring & Fun Match" icon={Swords}>
                      Tantang komunitas lain atau cari lawan sepadan.
                    </ListItem>
                    <ListItem href="/hall-of-fame" title="Hall of Fame" icon={Trophy}>
                      Apresiasi untuk member paling aktif & suportif di komunitas.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Menu 2: TRAIN (Drilling, Development) */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-full bg-transparent hover:bg-secondary/50 data-[state=open]:bg-secondary/50 font-bold text-base">
                  Latihan
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card rounded-[2rem]">
                    <ListItem href="/drilling" title="Drilling Program" icon={Zap}>
                      Latihan footwork & stroke intensif dengan coach.
                    </ListItem>
                    <ListItem href="/development" title="Player Development" icon={TrendingUp}>
                      Program jangka panjang (Development) untuk atlet muda.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Menu 3: COMPETE (Tournament) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/tournament"
                    className={cn(navigationMenuTriggerStyle(), "rounded-full bg-transparent hover:bg-secondary/50 font-bold text-base")}
                  >
                    Turnamen
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 3. CTA & MOBILE MENU */}
        <div className="flex items-center gap-3">
            {/* Login Button - Pill Shape, Accent Color for Gen-Z Pop */}
            <Link href="/login">
                <Button className="hidden md:flex rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6 shadow-lg shadow-accent/20 h-10 transition-transform hover:scale-105">
                    Join Member
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </Link>

            {/* Mobile Toggle */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-secondary">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full rounded-b-[2.5rem] pt-12 pb-12 bg-background/95 backdrop-blur-xl border-b border-border">
                    <SheetHeader className="mb-8 text-center">
                        <SheetTitle className="font-heading font-black text-3xl">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4 px-4">
                        {components.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors group"
                            >
                                <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium line-clamp-1">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                         <Link href="/login">
                            <Button className="w-full rounded-full bg-accent text-accent-foreground font-bold h-12 mt-4 text-lg">
                                Gabung Member Sekarang
                            </Button>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

      </div>
    </header>
  );
}

// Komponen Helper untuk Dropdown Item
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-[1.25rem] p-4 leading-none no-underline outline-none transition-colors hover:bg-secondary focus:bg-secondary group",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 mb-2">
             <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
             <div className="text-base font-bold leading-none text-foreground group-hover:text-primary transition-colors">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground font-medium">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
