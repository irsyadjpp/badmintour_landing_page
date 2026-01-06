'use client';

import { Card } from '@/components/ui/card';
import { Trophy, Target, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Fix Import

import { doc, getDoc } from 'firebase/firestore'; // Import Firestore
import { db } from '@/lib/firebase'; // Import Client DB

export default function FeaturesSection() {
  const imgMabar = PlaceHolderImages.find((img) => img.id === 'feature-mabar');
  const imgTournament = PlaceHolderImages.find((img) => img.id === 'feature-sparring');
  const imgDrilling = PlaceHolderImages.find((img) => img.id === 'feature-coaching');

  // Live Stats State
  const [memberCount, setMemberCount] = useState<string | number>("1K+");

  useEffect(() => {
    // Fetch aggregated stats loosely
    const fetchStats = async () => {
      try {
        const snap = await getDoc(doc(db, "aggregates", "dashboard_stats"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.activeMemberCount) {
            // Format: 1200 -> 1.2K if needed, or just raw number if > 1000
            setMemberCount(data.activeMemberCount > 1000 ? (data.activeMemberCount / 1000).toFixed(1) + "K+" : data.activeMemberCount);
          }
        }
      } catch (e) {
        // Silent fail to default
      }
    };
    fetchStats();
  }, []);

  return (
    <section id="services" className="w-full py-24 bg-background dark:bg-black">
      <div className="container px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase">
              Our <span className="text-primary">Ecosystem</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-lg">
              Bukan sekadar lapangan. Kami membangun ekosistem badminton modern untuk semua level pemain, dari pemula hingga pro.
            </p>
          </div>
          <Link href="#schedule">
            <Button variant="link" className="text-foreground font-bold text-xl p-0 hover:text-primary transition-colors decoration-2 underline-offset-8">
              Lihat Semua Jadwal <ArrowUpRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>

        {/* BENTO GRID MD3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[450px]">

          {/* Card 1: Mabar (Primary Focus) */}
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-0 bg-zinc-900 md:col-span-2 shadow-2xl">
            <div className="absolute inset-0 z-0">
              {imgMabar && (
                <Image
                  src={imgMabar.imageUrl}
                  alt="Mabar Rutin Bandung"
                  fill
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end p-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Daily Mabar</h3>
              <p className="text-zinc-300 text-lg max-w-lg leading-relaxed">
                Cari keringat bareng circle baru. Fun game santai, kalah menang yang penting happy. Slot terbatas tiap harinya!
              </p>
              <div className="mt-8 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <a href="https://chat.whatsapp.com/FMw5bAV8RvGBrBijyHjU3b" target="_blank">
                  <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold">Gabung Group WA</Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Card 2: Tournament (Vertical) */}
          <Card className="group relative overflow-hidden rounded-[2.5rem] border bg-card shadow-xl flex flex-col">
            <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl" />

            <div className="p-10 flex-1 flex flex-col z-10">
              <div className="mb-auto">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <Trophy className="h-7 w-7" />
                </div>
                <h3 className="text-3xl font-black mb-2 uppercase text-foreground">Friendly Match</h3>
                <p className="text-muted-foreground font-medium">Uji strategi di lapangan. Sparring internal atau lawan komunitas lain. Serius dikit, seru-seruan yang banyak.</p>
              </div>
            </div>

            {/* Image at bottom half */}
            <div className="relative h-1/2 w-full mt-4 overflow-hidden rounded-t-[2.5rem]">
              {imgTournament && (
                <Image src={imgTournament.imageUrl} alt="Tournament" fill className="object-cover object-top hover:scale-105 transition-transform duration-500" />
              )}
            </div>
          </Card>

          {/* Card 3: Drilling (Yellow/Accent) */}
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-0 bg-accent md:col-span-1 shadow-xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay"></div>

            <div className="flex flex-col h-full p-10 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                  <Target className="h-7 w-7" />
                </div>
                <div className="bg-black/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Pro Program
                </div>
              </div>

              <h3 className="text-4xl font-black text-black mb-4 uppercase leading-[0.9]">Level Up /<br />Drilling.</h3>
              <p className="text-black/80 font-bold text-lg leading-snug">
                Skill stuck di situ-situ aja? Join program latihan bareng coach komunitas. Materi basic sampai taktik ganda.
              </p>

              <div className="mt-auto pt-8">
                <Link href="#schedule">
                  <Button className="w-full rounded-full bg-black text-white h-12 font-bold hover:scale-105 transition-transform">
                    Lihat Jadwal Drilling
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Card 4: Stats (Wide) */}
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white bg-zinc-100 md:col-span-2 flex items-center p-8 md:p-12 shadow-lg dark:bg-zinc-900 dark:border-zinc-800">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white to-transparent opacity-50 pointer-events-none dark:from-zinc-900" />

            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-black text-primary">50+</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Sesi / Bulan</p>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-4xl md:text-5xl font-black text-foreground">{memberCount}</h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Member Aktif</p>
              </div>
              <div className="col-span-2 flex items-center justify-center md:justify-end">
                <div className="bg-white dark:bg-black/50 p-4 rounded-2xl shadow-sm flex items-center gap-3 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-black/50" />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm leading-none text-foreground">Gabung Sekarang</p>
                    <p className="text-xs text-muted-foreground">Mulai karirmu disini.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
