'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ChevronLeft, ShoppingBag, Check, ArrowRight, Info } from 'lucide-react';

export default function JerseyDropPage() {
  const [selectedSize, setSelectedSize] = useState('L');
  const [playerName, setPlayerName] = useState('');
  const [playerClub, setPlayerClub] = useState('INDONESIA');
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const jerseyImage = PlaceHolderImages.find((img) => img.id === 'jersey-mockup');
  const { toast } = useToast()

  const handleClaim = () => {
    if (!playerName) {
        toast({
            title: "Nama Punggung Wajib Diisi",
            description: "Mohon isi nama punggung terlebih dahulu.",
            variant: "destructive"
        })
      document.getElementById('inputName')?.focus();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsClaimed(true);
    }, 1500);
  };

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="bg-bad-dark min-h-screen font-sans">
      <header className="fixed top-0 w-full z-40 bg-bad-dark/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="bg-surface p-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <div className="text-center">
          <span className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase block">Official Kit</span>
          <span className="font-black text-lg tracking-tight">LIMITED DROP</span>
        </div>
        <div className="p-2 opacity-50">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto pb-48">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-primary font-bold animate-pulse text-xs">🔥 SISA 3 SLOT LAGI!</span>
            <span className="text-xs font-mono text-gray-400"><span className="text-white font-bold text-lg">9</span>/12 Claimed</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent to-primary w-[75%] rounded-full"></div>
          </div>
        </div>

        <div className="relative bg-surface rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden mb-8 aspect-square flex items-center justify-center group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>
          
          {jerseyImage && (
            <Image 
                src="https://via.placeholder.com/500x500/1E1E1E/333333?text=BACK+VIEW+JERSEY" 
                alt="Jersey Back" 
                width={500}
                height={500}
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition duration-500"
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pointer-events-none">
            <h2 id="previewName" className="font-jersey font-bold text-4xl sm:text-5xl text-white tracking-wider uppercase drop-shadow-md mb-2 transition-all">
              {playerName || 'YOUR NAME'}
            </h2>
            <h3 id="previewClub" className="font-jersey font-medium text-xl sm:text-2xl text-accent tracking-[0.2em] uppercase drop-shadow-sm transition-all">
              {playerClub || 'INDONESIA'}
            </h3>
          </div>

          <div className="absolute top-4 left-4 rotate-[-10deg] bg-accent text-black px-3 py-1 font-black text-sm shadow-lg border-2 border-black z-10">
            FREE (RP 0)
          </div>
        </div>

        <form id="orderForm" className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-sm text-gray-300 uppercase tracking-wide">1. Pilih Ukuran</label>
              <a href="#" className="text-[10px] text-accent underline">Size Chart</a>
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
                    className="sr-only"
                  />
                  <label
                    htmlFor={`size-${size.toLowerCase()}`}
                    className={cn(
                      "block w-full py-3 rounded-xl border text-center font-bold text-gray-400 cursor-pointer transition-all hover:border-white",
                      "border-gray-700",
                      selectedSize === size && "bg-accent text-black border-accent scale-105 font-black"
                    )}
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            
            <h3 className="font-bold text-sm text-white uppercase tracking-wide mb-1">2. Custom Nama Punggung</h3>
            <p className="text-[10px] text-gray-400 mb-6 flex items-start gap-1">
              <Info className="w-3 h-3 text-accent mt-0.5 shrink-0" />
              Sesuai standar BWF/PBSI: Gunakan Nama Belakang (Surname) atau Nama Panggilan Jelas.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Baris 1: Nama Pemain</label>
                <input
                  type="text"
                  id="inputName"
                  placeholder="CONTOH: KEVIN.S"
                  maxLength={12}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-surface border-b border-gray-600 text-white text-xl font-jersey font-bold py-2 focus:outline-none focus:border-accent placeholder-gray-700 uppercase tracking-wider transition-colors"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-gray-500">Max 12 Karakter</span>
                  <span className="text-[9px] text-accent font-bold">Wajib Diisi</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Baris 2: Klub / Negara</label>
                <div className="relative">
                  <select
                    id="inputClub"
                    value={playerClub}
                    onChange={(e) => setPlayerClub(e.target.value)}
                    className="w-full bg-surface border-b border-gray-600 text-accent text-lg font-jersey font-medium py-2 pr-8 focus:outline-none focus:border-accent appearance-none uppercase tracking-widest cursor-pointer"
                  >
                    <option value="INDONESIA">INDONESIA</option>
                    <option value="BADMINTOUR">BADMINTOUR</option>
                    <option value="BANDUNG">BANDUNG</option>
                    <option value="PB. JARUM">PB. DJARUM</option>
                    <option value="PB. JAYA RAYA">PB. JAYA RAYA</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                    <ChevronLeft className="w-4 h-4 transform rotate-[-90deg]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 leading-relaxed text-center px-4">
            *Jersey ini menggunakan sablon standar kompetisi. Pastikan ejaan nama sudah benar. Kesalahan input tidak dapat direvisi setelah claim.
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-bad-dark/95 backdrop-blur-xl border-t border-white/10 pt-4 pb-8 px-6 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase">Total Bayar</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">GRATIS</span>
              <span className="text-xs text-gray-500 line-through decoration-primary">Rp 150.000</span>
            </div>
          </div>
          <button
            id="claimBtn"
            onClick={handleClaim}
            disabled={isLoading}
            className="flex-[2] bg-accent text-black h-14 rounded-full font-black text-lg shadow-[0_0_20px_rgba(255,235,59,0.4)] hover:shadow-[0_0_30px_rgba(255,235,59,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span>CLAIM JERSEY</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      <div id="successModal" className={cn(
        "fixed inset-0 bg-black/95 backdrop-blur-md z-[60] flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
        isClaimed ? "flex opacity-100" : "hidden opacity-0"
      )}>
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_30px_rgba(0,200,83,0.5)]">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase italic">Order Confirmed!</h2>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm">Jersey kamu masuk antrean produksi. Tunjukkan kode ini ke admin.</p>
        
        <div className="bg-surface p-4 rounded-xl border border-white/10 mb-8 w-full max-w-xs relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-accent"></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Kode Unik</p>
            <p className="text-2xl font-mono font-bold text-white tracking-widest">BDG-JER-009</p>
        </div>

        <Link href="/" className="px-8 py-3 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition">
            Kembali ke Menu
        </Link>
      </div>
    </div>
  );
}

// Dummy useToast hook to prevent errors since it's not defined in this file.
// In a real app, this would be imported from the actual hook file.
const useToast = () => ({
  toast: (options: { title: string; description: string, variant: string}) => {
    if(typeof alert !== 'undefined') {
        alert(`${options.title}: ${options.description}`);
    }
  },
});
