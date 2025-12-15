import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react'; // Ganti icon Zap jadi Trophy agar lebih 'Tournament'
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-player');

  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-12 lg:pt-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Kolom Kiri: Typography Agresif */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary w-fit">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              #1 Sports Management di Bandung
            </div>
            
            <div className="space-y-4">
              <h1 className="font-heading text-5xl font-black tracking-tighter sm:text-7xl xl:text-8xl text-foreground">
                BANDUNG <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  BADMINTON HUB.
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
                Platform manajemen olahraga dan komunitas bulutangkis terintegrasi. Kami melayani reservasi mabar rutin, program latihan drilling, hingga penyelenggaraan turnamen profesional.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 rounded-full px-8 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Join Mabar Rutin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 rounded-full px-8 text-lg font-bold border-2 hover:bg-secondary/50">
                Info Turnamen
              </Button>
            </div>
          </div>

          {/* Kolom Kanan: Visual dengan Shape MD3 */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Dekorasi Background Blob */}
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl opacity-50 animate-pulse" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50" />

            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-muted border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 ease-in-out group">
               {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt="Badmintour Tournament Bandung"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              )}
              {/* Overlay Gradient Sporty */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent rounded-lg text-black">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">Next Big Event</p>
                        <p className="text-sm text-white/80">Bandung Open Championship 2026</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Text / Running Text Section */}
      <div className="mt-24 w-full overflow-hidden border-y border-border bg-accent/5 py-6">
        <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center mx-4">
                    <span className="text-4xl font-black text-foreground/10 mx-4">MABAR RUTIN</span>
                    <span className="text-4xl font-black text-primary mx-4">•</span>
                    <span className="text-4xl font-black text-foreground/10 mx-4">DRILLING PROGRAM</span>
                    <span className="text-4xl font-black text-primary mx-4">•</span>
                    <span className="text-4xl font-black text-foreground/10 mx-4">EVENT ORGANIZER</span>
                    <span className="text-4xl font-black text-primary mx-4">•</span>
                    <span className="text-4xl font-black text-foreground/10 mx-4">KOMUNITAS BANDUNG</span>
                    <span className="text-4xl font-black text-primary mx-4">•</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
