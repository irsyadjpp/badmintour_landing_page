import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-player');

  return (
    <section className="relative w-full overflow-hidden pt-28 pb-12 lg:pt-36">
      {/* Background Gradients (Subtle MD3 Vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
            
            {/* Pill Badge (MD3 Style) */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-primary shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse"></span>
              #1 Sports Management di Bandung
            </div>
            
            {/* Main Typography */}
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.9]">
              BANDUNG <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  BADMINTON HUB.
                </span>
                {/* Underline Decoration */}
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-accent -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-50" />
                </svg>
              </span>
            </h1>

            <p className="max-w-[700px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Platform manajemen olahraga terintegrasi. Reservasi mabar, drilling program, hingga turnamen profesional dalam satu ekosistem.
            </p>

            {/* Buttons (MD3 High Emphasis & Tonal) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="h-14 rounded-full px-10 text-lg font-bold bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                Join Mabar Rutin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-bold bg-secondary hover:bg-secondary/80 text-foreground border border-border/50">
                Info Turnamen
              </Button>
            </div>
        </div>

        {/* Hero Visual - Floating Card MD3 Style */}
        <div className="relative w-full max-w-5xl mx-auto mt-8">
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-zinc-100 border-4 border-white shadow-2xl group">
               {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt="Badmintour Tournament Bandung"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Floating Content inside Image */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="bg-accent text-black p-2 rounded-xl">
                          <Trophy className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-accent tracking-wider uppercase text-sm">Upcoming Major Event</span>
                  </div>
                  <p className="text-2xl md:text-4xl font-black font-heading">Bandung Open Championship 2026</p>
              </div>
            </div>

            {/* Floating Decorative Elements (Gen-Z Chaos) */}
            <div className="absolute -top-12 -right-8 md:-right-12 rotate-12 bg-white p-4 rounded-3xl shadow-xl border border-zinc-100 hidden md:block animate-float">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Total Prize</p>
                        <p className="text-xl font-black text-foreground">IDR 50 Juta</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Marquee Text - Diperhalus */}
      <div className="mt-20 -rotate-1 bg-accent border-y-4 border-black py-4 overflow-hidden relative z-20 shadow-[0_10px_0_rgba(0,0,0,0.1)]">
        <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center mx-4">
                    <span className="text-3xl md:text-5xl font-black text-black italic tracking-tighter">JOIN THE COMMUNITY</span>
                    <span className="text-3xl md:text-5xl font-black text-white mx-6 stroke-black text-stroke-2">READY TO SMASH?</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
