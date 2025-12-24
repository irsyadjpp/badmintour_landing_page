'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, ShoppingBag, Check } from 'lucide-react';

export default function JerseyDropPage() {
  const [selectedSize, setSelectedSize] = useState('L');
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const jerseyImage = PlaceHolderImages.find((img) => img.id === 'jersey-mockup');

  const handleClaim = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsClaimed(true);
    }, 1500);
  };

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="bg-bad-dark min-h-screen pb-32 font-sans">
      <header className="fixed top-0 w-full z-40 bg-bad-dark/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="bg-surface p-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase block">Badmintour Merch</span>
          <span className="font-black text-lg tracking-tight">LIMITED DROP V.1</span>
        </div>
        <div className="p-2 opacity-50">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-primary font-bold animate-pulse">🔥 ALMOST GONE!</span>
            <span className="text-sm font-mono text-gray-400"><span className="text-white font-bold text-lg">9</span> / 12 Claimed</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(255,235,59,0.5)]"></div>
          </div>
        </div>

        <div className="relative bg-surface rounded-[2.5rem] p-8 mb-8 border border-white/5 shadow-2xl group overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 blur-[60px] rounded-full"></div>
          
          <div className="absolute top-6 left-6 z-20 transform -rotate-12">
            <span className="bg-accent text-black px-4 py-1 rounded-sm font-black text-xl shadow-lg border-2 border-black">
              RP 0,-
            </span>
          </div>

          <div className="relative z-10 transform transition duration-500 group-hover:scale-105 group-hover:-rotate-2">
             {jerseyImage && (
                <Image 
                    src={jerseyImage.imageUrl} 
                    alt="Jersey Badmintour" 
                    width={400}
                    height={400}
                    className="w-full drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]"
                    data-ai-hint={jerseyImage.imageHint}
                />
             )}
          </div>

          <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-30">
            <div className="whitespace-nowrap animate-marquee text-[4rem] font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] leading-none">
                LIMITED EDITION • LIMITED EDITION • LIMITED EDITION •
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 leading-none uppercase">Season 1 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Official Kit.</span></h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Material Dry-Fit premium dengan sirkulasi udara maksimal. Desain eksklusif member Badmintour. <span className="text-white font-bold">Gratis khusus 12 orang tercepat.</span>
          </p>
        </div>

        <form id="orderForm" className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-sm text-gray-300 uppercase tracking-wide">Pilih Size</label>
              <a href="#" className="text-xs text-accent underline decoration-accent decoration-2">Lihat Size Chart</a>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {sizes.map(size => (
                <div key={size} className="relative">
                  <input
                    type="radio"
                    name="size"
                    id={`size-${size.toLowerCase()}`}
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size)}
                    disabled={size === 'XL'}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`size-${size.toLowerCase()}`}
                    className={cn(
                      "block w-full py-4 rounded-2xl border-2 text-center font-bold transition-all",
                      size === 'XL' 
                        ? "border-gray-800 bg-gray-900 text-gray-700 cursor-not-allowed relative overflow-hidden"
                        : "border-gray-700 text-gray-400 cursor-pointer hover:border-gray-500",
                      selectedSize === size && "bg-accent text-black border-accent scale-105 font-black"
                    )}
                  >
                    {size}
                    {size === 'XL' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-red-500 rotate-12 font-black uppercase">Sold Out</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-sm text-gray-300 uppercase tracking-wide mb-4 block">Custom Nama Punggung</label>
            <div className="relative">
              <input type="text" placeholder="Cth: KEVIN.S" maxLength={12} className="w-full bg-surface border-b-2 border-gray-700 text-white text-2xl font-black py-2 focus:outline-none focus:border-accent placeholder-gray-700 uppercase tracking-widest transition-colors" />
              <span className="absolute right-0 bottom-4 text-xs text-gray-500">MAX 12 HURUF</span>
            </div>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-bad-dark via-bad-dark to-transparent pt-12 pb-8 px-6 z-50">
        <div className="max-w-lg mx-auto">
          <button id="claimBtn" onClick={handleClaim} disabled={isLoading} className="w-full group relative bg-white text-black h-16 rounded-full font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,235,59,0.6)] transition-all overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            
            {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-black relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
                <>
                    <span className="relative z-10 group-hover:tracking-wider transition-all">CLAIM SEKARANG</span>
                    <span className="relative z-10 bg-black text-white text-xs px-2 py-0.5 rounded ml-2 group-hover:bg-black group-hover:text-accent">FREE</span>
                </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4">
            *Hanya 1x klaim per member. Stok terbatas.
          </p>
        </div>
      </div>

      <div id="successModal" className={cn(
        "fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
        isClaimed ? "flex opacity-100" : "hidden opacity-0"
      )}>
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check className="w-12 h-12 text-black" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase italic">Got 'Em!</h2>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Jersey berhasil diamankan. Tunjukkan kode QR di meja registrasi saat mabar selanjutnya.</p>
        
        <div className="bg-surface p-4 rounded-xl border border-white/10 mb-8 w-full max-w-xs">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Kode Unik</p>
          <p className="text-2xl font-mono font-bold text-accent tracking-widest">JER-BDG-009</p>
        </div>

        <Link href="/" className="text-white font-bold underline decoration-2 decoration-accent hover:text-accent transition">
            Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
