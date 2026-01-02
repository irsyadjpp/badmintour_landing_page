'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Repeat, Zap, CalendarClock } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-28 pb-12 lg:pt-36">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Container */}
      <div className="container px-4 md:px-6 relative z-10">

        {/* CENTER ALIGNED CONTENT */}
        <div className="flex flex-col items-center text-center space-y-8 mb-12 max-w-4xl mx-auto">

          {/* Pill Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-primary shadow-sm hover:shadow-md transition-all cursor-default">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-pulse"></span>
            Basecamp-nya Anak Badminton Bandung
          </div>

          {/* Main Typography */}
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
            STOP WACANA, <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                AYO MABAR.
              </span>
              {/* Dekorasi Garis Bawah */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent -z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-50" />
              </svg>
            </span>
          </h1>

          <p className="max-w-2xl text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            Gak perlu ribet atur jadwal. Di sini kamu bisa join Mabar, upgrade skill lewat Drilling, atau uji mental di Fun Match. Suasana santai, mainnya tetap kompetitif. Newbie sampai Advance, gas terus!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-4">
            <Link href="/#schedule">
              <Button size="lg" className="h-14 rounded-full px-10 text-lg font-bold bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20">
                GAS JOIN MABAR 🏸
              </Button>
            </Link>
            <Link href="/#services">
              <Button size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-bold bg-secondary hover:bg-secondary/80 text-foreground border border-border/50">
                LIHAT KELAS DRILLING
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual - Gambar Lebar di Bawah Teks */}
        <div className="relative w-full max-w-5xl mx-auto mt-8">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] bg-zinc-100 border-4 border-white shadow-2xl group">
            {/* UPDATE: Menggunakan badmintour-hero.webp */}
            <Image
              src="/images/badmintour-hero.webp"
              alt="Badmintour Mabar Rutin"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Floating Content inside Image (UPDATED: Recurring Theme) */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary text-white p-2 rounded-xl animate-pulse">
                  <Repeat className="w-5 h-5" />
                </div>
                <span className="font-bold text-white tracking-wider uppercase text-xs md:text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  Jadwal Rutin Mingguan
                </span>
              </div>
              <p className="text-2xl md:text-5xl font-black font-heading leading-tight">
                Mabar Setiap Hari <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
                  Senin s/d Minggu
                </span>
              </p>
            </div>
          </div>

          {/* Dekorasi Floating (UPDATED: Next Session Status) */}
          <div className="absolute -top-6 -right-4 md:-right-8 rotate-3 bg-white p-4 rounded-3xl shadow-xl border border-zinc-100 hidden md:block animate-float">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                <CalendarClock className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Next Session</p>
                </div>
                <p className="text-xl font-black text-foreground leading-none">Kamis, 17:00 WIB</p>
                <p className="text-xs font-bold text-primary mt-1">GOR Wartawan</p>
              </div>
            </div>
          </div>

          {/* Dekorasi Floating Kiri (New: Level Info) */}
          <div className="absolute -bottom-8 -left-4 md:-left-8 -rotate-2 bg-black text-white p-4 rounded-3xl shadow-2xl border border-zinc-800 hidden md:block animate-float delay-700">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800 p-2 rounded-full text-accent">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Level</p>
                <p className="text-sm font-black">Newbie - Intermediate</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Marquee Text */}
      <div className="mt-24 -rotate-1 bg-accent border-y-4 border-black py-4 overflow-hidden relative z-20 shadow-lg">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-4">
              <span className="text-3xl md:text-5xl font-black text-black italic tracking-tighter">
                MABAR SETIAP HARI • PAGI SIANG MALAM • GOR Wartawan & Garandiri • COACHING CLINIC • FUN MATCH WEEKEND •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
