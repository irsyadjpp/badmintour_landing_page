import { Card } from '@/components/ui/card';
import { Award, Swords, Users, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

export default function FeaturesSection() {
  const imgMabar = PlaceHolderImages.find((img) => img.id === 'feature-mabar');
  const imgSparring = PlaceHolderImages.find((img) => img.id === 'feature-sparring');
  const imgCoaching = PlaceHolderImages.find((img) => img.id === 'feature-coaching');

  return (
    <section id="features" className="w-full py-20 bg-muted/30">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              GAME MODE
            </h2>
            <p className="text-lg text-muted-foreground">
              Pilih mode permainan yang cocok dengan mood dan skill kamu hari ini.
            </p>
          </div>
          <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto">
            Lihat Semua Mode <ArrowUpRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          
          {/* Card 1: MABAR (Large - Span 2 Columns) */}
          <Card className="group relative overflow-hidden rounded-[2rem] border-0 bg-black md:col-span-2 shadow-xl">
             <div className="absolute inset-0 z-0">
               {imgMabar && (
                 <Image src={imgMabar.imageUrl} alt="Mabar" fill className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
             </div>
             <div className="relative z-10 flex h-full flex-col justify-end p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                   <Users className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Mabar (Social Play)</h3>
                <p className="text-gray-300 max-w-md">Cari temen main santai? Join slot mabar, ketemu circle baru, yang penting keringetan dan happy!</p>
             </div>
          </Card>

          {/* Card 2: SPARRING (Vertical Stack Top) */}
          <Card className="group relative overflow-hidden rounded-[2rem] border-0 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-all">
             <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="flex flex-col h-full p-8">
                <div className="mb-auto">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                        <Swords className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Sparring Kompetitif</h3>
                    <p className="text-muted-foreground text-sm">Uji mental dan skill. Ranked match dengan sistem poin.</p>
                </div>
                <div className="mt-6 relative h-32 rounded-xl overflow-hidden">
                    {imgSparring && <Image src={imgSparring.imageUrl} alt="Sparring" fill className="object-cover" />}
                </div>
             </div>
          </Card>

          {/* Card 3: COACHING (Span 1 but distinct style) */}
          <Card className="group relative overflow-hidden rounded-[2rem] border-0 bg-accent md:col-span-1 shadow-lg">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
             <div className="flex flex-col h-full p-8 relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white mb-6">
                    <Award className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Pro Coaching</h3>
                <p className="text-black/80 font-medium">Drilling teknik dasar sampai advance bareng coach bersertifikat.</p>
                <div className="mt-auto pt-8">
                    <Button className="w-full rounded-full bg-black text-white hover:bg-black/80">Cari Coach</Button>
                </div>
             </div>
          </Card>

           {/* Card 4: Additional Info / Stats (Span 2) */}
           <Card className="group relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary/20 bg-background md:col-span-2 flex items-center justify-center p-8">
              <div className="text-center space-y-2">
                 <h3 className="text-4xl md:text-6xl font-black text-foreground">200+</h3>
                 <p className="text-lg font-medium text-muted-foreground uppercase tracking-widest">Active Members</p>
              </div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
           </Card>

        </div>
      </div>
    </section>
  );
}
