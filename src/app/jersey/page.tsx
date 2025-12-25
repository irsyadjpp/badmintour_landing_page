'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ArrowRight, Shirt, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function JerseyDropPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('L');
  const [playerName, setPlayerName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  const { toast } = useToast();

  const basePrice = 150000;

  const totalPrice = useMemo(() => {
    const paidQty = Math.max(0, quantity - 1);
    return paidQty * basePrice;
  }, [quantity]);

  const updateQty = (change: number) => {
    setQuantity(prev => {
      const newQty = prev + change;
      if (newQty < 1) return 1;
      if (newQty > 10) return 10; // Max limit
      return newQty;
    });
  };

  const handleClaim = () => {
    if (!playerName) {
      toast({ title: "Nama Punggung Wajib Diisi", description: "Mohon isi nama punggung terlebih dahulu.", variant: "destructive" });
      return;
    }
    if (!whatsAppNumber) {
      toast({ title: "Nomor WhatsApp Wajib Diisi", description: "Mohon isi nomor WhatsApp agar kami bisa menghubungi Anda.", variant: "destructive" });
      return;
    }

    setIsClaimed(true);
  };
  
  const toggleSizeChart = () => setIsSizeChartOpen(!isSizeChartOpen);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const priceNote = useMemo(() => {
    if (totalPrice === 0) {
      return "✨ Selamat! Kamu berhak mendapatkan 1 Jersey Gratis.";
    }
    return `ℹ️ Info Tagihan: 1 Pcs Gratis + ${quantity - 1} Pcs Berbayar (@150k)`;
  }, [totalPrice, quantity]);


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
          <Link href="/" className="pointer-events-auto w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition border border-white/10 text-white">
              <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="pointer-events-auto bg-bad-yellow text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,214,10,0.4)] animate-pulse border-2 border-black">
              Public Access
          </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-1/2 relative bg-[#121212] flex items-center justify-center p-8 lg:sticky lg:top-0 lg:h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-bad-red/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-bad-yellow/5 blur-[120px] rounded-full"></div>

            <div className="relative w-full max-w-md aspect-square z-10 group">
                <Image src="https://via.placeholder.com/1000x1000/121212/333333?text=MOCKUP+1000x1000" alt="Jersey Preview" width={1000} height={1000} className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pointer-events-none">
                    <h2 id="previewName" className="font-jersey font-bold text-5xl md:text-7xl text-white tracking-widest uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] opacity-90 transition-all">
                        {playerName || 'YOUR NAME'}
                    </h2>
                    <h3 className="font-jersey font-medium text-2xl md:text-3xl text-bad-yellow tracking-[0.3em] uppercase mt-2 drop-shadow-md">
                        BADMINTOUR
                    </h3>
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest">Season 1</p>
                    <p className="text-white font-black text-lg">Official Kit</p>
                </div>
            </div>
        </div>

        <div className="lg:w-1/2 bg-bad-dark relative flex flex-col">
            <div className="flex-1 p-6 md:p-12 lg:p-16 space-y-10 max-w-2xl mx-auto w-full">
                
                <div className="pt-8 lg:pt-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 text-white">
                        Claim Your <br/><span className="text-bad-yellow">Legacy.</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="bg-bad-green/20 text-bad-green px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-bad-green/30">Free Claim Available</span>
                        <p className="text-gray-300 text-sm font-medium">Khusus member terdaftar & publik.</p>
                    </div>
                </div>

                <div className="bg-bad-card p-5 rounded-[1.5rem] border border-white/10">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Jumlah Pesanan</label>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center bg-black/30 rounded-xl p-1 border border-white/10">
                            <button onClick={() => updateQty(-1)} className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/20 transition text-xl font-bold text-white">-</button>
                            <input type="number" value={quantity} readOnly className="w-16 bg-transparent text-center font-black text-2xl outline-none text-white" />
                            <button onClick={() => updateQty(1)} className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center hover:bg-gray-200 transition text-xl font-bold">+</button>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Estimasi Harga</p>
                            <div id="priceDisplay">
                                {totalPrice === 0 ? (
                                    <>
                                        <span className="text-3xl font-black text-bad-yellow">FREE</span>
                                        <span className="text-sm text-gray-500 line-through decoration-bad-red ml-1">Rp 150k</span>
                                    </>
                                ) : (
                                    <span className="text-3xl font-black text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div id="priceNote" className={cn(
                        "mt-3 pt-3 border-t border-white/5 text-[11px] font-bold italic",
                        totalPrice === 0 ? "text-bad-green" : "text-gray-400"
                    )}>
                       {priceNote}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Pilih Ukuran</label>
                        <button type="button" onClick={toggleSizeChart} className="text-xs font-bold text-bad-yellow hover:text-white transition flex items-center gap-1">
                            <Shirt className="w-4 h-4" />
                            Lihat Size Chart
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {sizes.map(size => (
                             <label key={size} className="cursor-pointer group">
                                <input type="radio" name="size" value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} className="peer sr-only" />
                                <div className="h-14 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center font-bold text-gray-300 group-hover:border-white transition-all peer-checked:bg-bad-yellow peer-checked:text-black peer-checked:border-bad-yellow peer-checked:font-black peer-checked:scale-105">
                                    {size}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Punggung (Max 12)</label>
                        <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value.toUpperCase())} maxLength={12} placeholder="CONTOH: KEVIN.S" className="w-full bg-bad-card border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-500 focus:border-bad-yellow focus:ring-1 focus:ring-bad-yellow focus:outline-none transition uppercase tracking-widest" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nomor WhatsApp</label>
                        <input type="tel" value={whatsAppNumber} onChange={e => setWhatsAppNumber(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full bg-bad-card border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-500 focus:border-bad-green focus:ring-1 focus:ring-bad-green focus:outline-none transition" />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 pb-12">
                    <Button onClick={handleClaim} className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-xl hover:bg-bad-yellow transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,214,10,0.6)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group h-auto">
                        <span>KONFIRMASI PESANAN</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-center text-[10px] text-gray-500 mt-4">Dengan memesan, Anda setuju dengan Syarat & Ketentuan BadminTour.</p>
                </div>

            </div>
        </div>
      </div>

       {/* Success Modal */}
      <div className={cn(
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

      <div id="sizeChartModal" className={cn("fixed inset-0 z-[60] items-center justify-center p-4 transition-opacity duration-300", isSizeChartOpen ? 'flex opacity-100' : 'hidden opacity-0')} onClick={toggleSizeChart}>
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        <div className={cn("bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden transform transition-all duration-300", isSizeChartOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0')} onClick={(e) => e.stopPropagation()}>
            <div className="bg-bad-yellow p-6 flex justify-between items-center">
                <h3 className="text-black font-black text-2xl uppercase tracking-tighter">📏 Size Chart</h3>
                <button onClick={toggleSizeChart} className="text-black bg-black/10 p-2 rounded-full hover:bg-black/20"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
                <p className="text-xs text-gray-400 mb-6 text-center uppercase tracking-widest font-bold">Unisex Regular Fit (CM)</p>
                <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-bad-yellow w-8">S</span> <span className="text-white">47 x 67</span></div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-bad-yellow w-8">M</span> <span className="text-white">50 x 70</span></div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-bad-yellow w-8">L</span> <span className="text-white">52 x 72</span></div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-bad-yellow w-8">XL</span> <span className="text-white">54 x 74</span></div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-bad-yellow w-8">XXL</span> <span className="text-white">56 x 77</span></div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
