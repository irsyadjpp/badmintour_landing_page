'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ca1f3d]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#ffbe00]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">

        {/* Large 404 Visual */}
        <div className="relative">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#ca1f3d] w-32 h-32 md:w-48 md:h-48 rounded-full blur-[60px] opacity-50 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-[#ffbe00] mb-4 drop-shadow-[0_0_15px_rgba(255,190,0,0.5)]" />
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-xl">
              OUT OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]">BOUNDS</span>
            </h2>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            Ups! Kok ini jatuh di lapangan sebelah. Halaman yang kamu cari sedang istirahat atau tidak ditemukan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="h-14 px-8 rounded-[1.5rem] border-white/10 text-white hover:bg-white/5 hover:text-[#ffbe00] font-bold text-lg transition-all"
            >
              <ChevronLeft className="mr-2 w-5 h-5" /> Kembalikan Service
            </Button>

            <Link href="/">
              <Button className="h-14 px-8 rounded-[1.5rem] bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold text-lg shadow-[0_10px_30px_-10px_rgba(202,31,61,0.5)] transition-all hover:scale-105">
                <Home className="mr-2 w-5 h-5" /> Home Base
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[#333] text-sm font-black tracking-[0.5em] uppercase">BADMINTOUR SYSTEM</p>
      </div>

    </div>
  );
}
