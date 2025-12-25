'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ShoppingBag, Check, ArrowRight, Info, X, Shirt, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function JerseyDropPage() {
  const [selectedSize, setSelectedSize] = useState('L');
  const [playerName, setPlayerName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  
  const { toast } = useToast();

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
     if (!whatsAppNumber) {
        toast({
            title: "Nomor WhatsApp Wajib Diisi",
            description: "Mohon isi nomor WhatsApp agar kami bisa menghubungi Anda.",
            variant: "destructive"
        })
      document.getElementById('inputWA')?.focus();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsClaimed(true);
    }, 1500);
  };

  const toggleSizeChart = () => setIsSizeChartOpen(!isSizeChartOpen);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="bg-bad-dark min-h-screen font-sans pb-48">
      
      <header className="fixed top-0 w-full z-40 bg-bad-dark/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="bg-surface p-2 rounded-full hover:bg-white/10 transition border border-white/5 group">
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
          </Link>
          
          <div className="text-center">
              <span className="text-[10px] font-bold text-bad-yellow tracking-[0.2em] uppercase block animate-pulse">Public Access</span>
              <span className="font-black text-lg tracking-tight">LIMITED DROP</span>
          </div>

          <div className="p-2 opacity-50">
              <ShoppingBag className="w-6 h-6" />
          </div>
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-bad-red font-bold animate-pulse text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-bad-red rounded-full"></span> SISA 3 SLOT LAGI!
            </span>
            <span className="text-xs font-mono text-gray-400"><span className="text-white font-bold text-lg">9</span>/12 Claimed</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-bad-yellow to-bad-red w-[75%] rounded-full shadow-[0_0_10px_#D32F2F]"></div>
          </div>
        </div>

        <div className="relative bg-surface rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden mb-8 aspect-square flex items-center justify-center group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-bad-red/20 blur-[50px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
          
          <Image 
              src="https://via.placeholder.com/500x500/1E1E1E/333333?text=JERSEY+BACK"
              alt="Jersey Back" 
              width={500}
              height={500}
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition duration-500"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pointer-events-none">
            <h2 id="previewName" className="font-jersey font-bold text-4xl sm:text-5xl text-white tracking-wider uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-2 transition-all">
              {playerName || 'YOUR NAME'}
            </h2>
            <h3 id="previewClub" className="font-jersey font-medium text-xl sm:text-2xl text-bad-yellow tracking-[0.2em] uppercase drop-shadow-sm transition-all">
              BADMINTOUR
            </h3>
          </div>

          <div className="absolute top-4 left-4 -rotate-6 bg-bad-yellow text-black px-3 py-1 font-black text-sm shadow-lg border-2 border-black z-10">
            LIMITED EDITION
          </div>
        </div>

        <form id="orderForm" className="space-y-8">
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="font-bold text-sm text-gray-300 uppercase tracking-wide">1. Pilih Ukuran</label>
              <button type="button" onClick={toggleSizeChart} className="text-[10px] font-bold text-bad-yellow border border-bad-yellow px-2 py-1 rounded hover:bg-bad-yellow hover:text-black transition flex items-center gap-1">
                <Shirt className="w-3 h-3"/>
                LIHAT SIZE CHART
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {sizes.map(size => (
                <div key={size} className="relative">
                  <input
                    type="radio"
                    name="size"
                    id={`size-${size.toLowerCase()}`}
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={`size-${size.toLowerCase()}`}
                    className={cn(
                      "block w-full py-3 rounded-xl border text-center font-bold text-gray-400 cursor-pointer transition-all hover:border-white text-sm",
                      "border-gray-700 peer-checked:bg-bad-yellow peer-checked:text-black peer-checked:border-bad-yellow peer-checked:scale-105 peer-checked:font-black"
                    )}
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-bad-yellow to-bad-red"></div>
            
            <h3 className="font-bold text-sm text-white uppercase tracking-wide mb-6">2. Detail Pesanan</h3>

            <div className="space-y-6">
              
                <div className="relative group">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nama Punggung (Max 12 Char)</label>
                    <input
                      type="text"
                      id="inputName"
                      placeholder="CONTOH: KEVIN.S"
                      maxLength={12}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                      className="w-full bg-surface border-b-2 border-gray-600 text-white text-xl font-jersey font-bold py-2 focus:outline-none focus:border-bad-yellow placeholder-gray-700 uppercase tracking-wider transition-colors"
                    />
                     <div className="absolute right-0 top-8 text-gray-500 group-hover:text-bad-yellow transition">
                        <Pencil className="w-5 h-5" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nomor WhatsApp (Aktif)</label>
                    <input
                      type="tel"
                      id="inputWA"
                      placeholder="08xxxxxxxxxx"
                      value={whatsAppNumber}
                      onChange={(e) => setWhatsAppNumber(e.target.value)}
                      className="w-full bg-surface border-b-2 border-gray-600 text-white text-lg font-sans font-bold py-2 focus:outline-none focus:border-bad-green placeholder-gray-700 tracking-wider transition-colors"
                    />
                    <p className="text-[9px] text-gray-500 mt-1">*Admin akan menghubungi untuk pembayaran & konfirmasi.</p>
                </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Klub / Komunitas</label>
                <div className="relative">
                  <input
                    type="text"
                    value="BADMINTOUR"
                    className="w-full bg-surface border-b-2 border-gray-700 text-gray-400 text-lg font-jersey font-bold py-2 cursor-not-allowed"
                    disabled
                  />
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 pt-4 pb-6 px-6 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Harga Pre-Order</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">Rp 150k</span>
              <span className="text-xs text-bad-red bg-bad-red/10 px-1 rounded font-bold">-20%</span>
            </div>
          </div>
          <button
            id="claimBtn"
            onClick={handleClaim}
            disabled={isLoading}
            className="flex-[2] bg-bad-yellow text-black h-14 rounded-full font-black text-lg shadow-[0_0_20px_rgba(255,235,59,0.4)] hover:shadow-[0_0_30px_rgba(255,235,59,0.6)] hover:scale-102 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <span>PESAN SEKARANG</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Size Chart Modal */}
      <div id="sizeChartModal" className={cn(
        "fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] items-center justify-center p-4 transition-opacity duration-300",
        isSizeChartOpen ? "flex opacity-100" : "hidden opacity-0"
      )} onClick={toggleSizeChart}>
        <div className={cn("bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden transform transition-transform duration-300", isSizeChartOpen ? "scale-100" : "scale-95")} onClick={(e) => e.stopPropagation()}>
            <div className="bg-bad-yellow p-4 flex justify-between items-center">
                <h3 className="text-black font-black text-xl uppercase tracking-tighter">📏 Size Chart (CM)</h3>
                <button onClick={toggleSizeChart} className="text-black hover:bg-black/10 p-1 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6">
                <p className="text-xs text-gray-400 mb-4 text-center">DEWASA UNISEX (REGULAR FIT)</p>
                <div className="overflow-hidden rounded-xl border border-white/10">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-white/5">
                            <tr>
                                <th className="px-4 py-3 font-bold">Size</th>
                                <th className="px-4 py-3 font-mono text-right">Lebar</th>
                                <th className="px-4 py-3 font-mono text-center text-gray-500">x</th>
                                <th className="px-4 py-3 font-mono text-left">Panjang</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-200 font-medium [&_tr:nth-child(even)]:bg-white/5">
                            <tr><td className="p-3 px-4 font-bold text-bad-yellow">S</td><td className="p-3 px-4 text-right">47</td><td className="p-3 px-4 text-center text-gray-600">x</td><td className="p-3 px-4 text-left">67</td></tr>
                            <tr><td className="p-3 px-4 font-bold text-bad-yellow">M</td><td className="p-3 px-4 text-right">50</td><td className="p-3 px-4 text-center text-gray-600">x</td><td className="p-3 px-4 text-left">70</td></tr>
                            <tr><td className="p-3 px-4 font-bold text-bad-yellow">L</td><td className="p-3 px-4 text-right">52</td><td className="p-3 px-4 text-center text-gray-600">x</td><td className="p-3 px-4 text-left">72</td></tr>
                            <tr><td className="p-3 px-4 font-bold text-bad-yellow">XL</td><td className="p-3 px-4 text-right">54</td><td className="p-3 px-4 text-center text-gray-600">x</td><td className="p-3 px-4 text-left">74</td></tr>
                            <tr><td className="p-3 px-4 font-bold text-bad-yellow">XXL</td><td className="p-3 px-4 text-right">56</td><td className="p-3 px-4 text-center text-gray-600">x</td><td className="p-3 px-4 text-left">77</td></tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-[10px] text-gray-500 mt-4 text-center italic">*Toleransi jahit 1-2 cm.</p>
            </div>
        </div>
      </div>

      {/* Success Modal */}
      <div id="successModal" className={cn(
        "fixed inset-0 bg-bad-dark/95 backdrop-blur-md z-[70] flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
        isClaimed ? "flex opacity-100" : "hidden opacity-0"
      )}>
        <div className="w-24 h-24 bg-bad-green rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_40px_rgba(0,200,83,0.4)]">
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Order Received!</h2>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Terima kasih! Admin kami akan menghubungi WhatsApp kamu untuk konfirmasi pembayaran.</p>
        
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8 w-full max-w-xs relative overflow-hidden group cursor-pointer hover:bg-white/10 transition">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-bad-yellow"></div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Kode Pesanan</p>
            <p className="text-2xl font-mono font-bold text-white tracking-widest group-hover:tracking-[0.2em] transition-all">BDG-PUB-001</p>
        </div>

        <Link href="/" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition uppercase tracking-widest">
            Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
