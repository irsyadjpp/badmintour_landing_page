'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ArrowRight, Shirt, X, Check, Loader2, User, Ruler, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function JerseyDropPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    // STATE
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('L');
    
    // DATA INPUTS
    const [fullName, setFullName] = useState(''); 
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    
    // LOGIC NAMA PUNGGUNG
    const [nameOption, setNameOption] = useState<'A' | 'B'>('A'); // A = Depan Full, B = Belakang Full
    const [generatedOptions, setGeneratedOptions] = useState({ A: '', B: '' });

    // UI State
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderId, setOrderId] = useState('');

    const basePrice = 150000;

    // Hitung Harga
    const totalPrice = useMemo(() => {
        const paidQty = Math.max(0, quantity - 1);
        return paidQty * basePrice;
    }, [quantity]);

    // Update Qty
    const updateQty = (change: number) => {
        setQuantity(prev => {
            const newQty = prev + change;
            if (newQty < 1) return 1;
            if (newQty > 10) return 10;
            return newQty;
        });
    };

    // Pre-fill Data jika Login
    useEffect(() => {
        if (session?.user?.name) {
            setFullName(session.user.name.toUpperCase());
        }
    }, [session]);

    // --- ALGORITMA SMART NAME GENERATOR ---
    useEffect(() => {
        const generateOptions = (name: string) => {
            if (!name) return { A: '', B: '' };

            // 1. Bersihkan Input (Hapus simbol, ambil huruf & spasi saja)
            const cleanName = name.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
            const parts = cleanName.split(/\s+/).filter(p => p.length > 0);
            
            if (parts.length === 0) return { A: '', B: '' };

            // Jika cuma 1 kata
            if (parts.length === 1) {
                return { A: parts[0], B: parts[0] };
            }

            // OPSI A: Nama Depan Full + Inisial Sisa
            // "IRSYAD JAMAL PRATAMA PUTRA" -> "IRSYAD J P P"
            const first = parts[0];
            const initialsTail = parts.slice(1).map(p => p[0]).join(' ');
            let optionA = `${first} ${initialsTail}`.trim();

            // OPSI B: Inisial Depan + Nama Belakang Full
            // "IRSYAD JAMAL PRATAMA PUTRA" -> "I J P PUTRA"
            const last = parts[parts.length - 1];
            const initialsHead = parts.slice(0, parts.length - 1).map(p => p[0]).join(' ');
            let optionB = `${initialsHead} ${last}`.trim();

            // Potong jika lebih dari 12 karakter (Aturan Jersey)
            // Prioritaskan membuang spasi jika kepanjangan, lalu potong huruf
            if (optionA.length > 12) optionA = optionA.replace(/\s/g, '').slice(0, 12);
            if (optionB.length > 12) optionB = optionB.replace(/\s/g, '').slice(0, 12);

            return { A: optionA, B: optionB };
        };

        setGeneratedOptions(generateOptions(fullName));
    }, [fullName]);

    // Submit Order
    const handleClaim = async () => {
        const finalBackName = nameOption === 'A' ? generatedOptions.A : generatedOptions.B;

        if (!fullName) {
            toast({ title: "Data Kurang", description: "Nama Lengkap wajib diisi.", variant: "destructive" });
            return;
        }
        if (!finalBackName) {
            toast({ title: "Data Kurang", description: "Nama Punggung kosong.", variant: "destructive" });
            return;
        }
        if (!whatsAppNumber) {
            toast({ title: "Data Kurang", description: "Nomor WhatsApp wajib diisi.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/member/jersey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    size: selectedSize,
                    backName: finalBackName, 
                    fullName: fullName, 
                    senderPhone: whatsAppNumber,
                    quantity: quantity
                })
            });

            const data = await res.json();

            if (res.ok) {
                setOrderId(data.orderId || 'ORD-NEW');
                setIsClaimed(true);
            } else {
                throw new Error(data.error || "Gagal memproses pesanan");
            }
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "Terjadi kesalahan saat menyimpan pesanan.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSizeChart = () => setIsSizeChartOpen(!isSizeChartOpen);
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const priceNote = useMemo(() => {
        if (totalPrice === 0) return "✨ Selamat! Kamu berhak mendapatkan 1 Jersey Gratis.";
        return `ℹ️ Info Tagihan: 1 Pcs Gratis + ${quantity - 1} Pcs Berbayar (@150k)`;
    }, [totalPrice, quantity]);

    return (
        <>
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
                <Link href="/" className="pointer-events-auto w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition border border-white/10 text-white">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="pointer-events-auto bg-[#ffbe00] text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,190,0,0.4)] animate-pulse border-2 border-black">
                    Public Access
                </div>
            </header>

            <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0a0a]">
                
                {/* LEFT: IMAGE PREVIEW */}
                <div className="lg:w-1/2 relative bg-[#121212] flex items-center justify-center p-8 lg:sticky lg:top-0 lg:h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                    <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#ca1f3d]/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ffbe00]/5 blur-[120px] rounded-full"></div>

                    <div className="relative w-full max-w-md aspect-square z-10 group">
                        <Image 
                            src="/images/jersey-season-1.png" 
                            alt="Jersey Preview" 
                            width={1000} 
                            height={1000} 
                            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                            priority
                        />
                         {/* Live Preview Nama Punggung di Gambar */}
                         <div className="absolute top-1/3 left-0 right-0 text-center pointer-events-none opacity-80 mix-blend-overlay">
                             <h2 className="text-white/50 font-black text-4xl tracking-[0.2em]">{nameOption === 'A' ? generatedOptions.A : generatedOptions.B || 'NAME'}</h2>
                        </div>
                        
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl">
                            <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest">Season 1</p>
                            <p className="text-white font-black text-lg">Official Kit</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="lg:w-1/2 bg-[#0a0a0a] relative flex flex-col">
                    <div className="flex-1 p-6 md:p-12 lg:p-16 space-y-10 max-w-2xl mx-auto w-full pt-24 lg:pt-16">

                        {/* Title */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 text-white">
                                Claim Your <br /><span className="text-[#ffbe00]">Legacy.</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-green-500/30">
                                    Free Claim Available
                                </span>
                            </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="bg-[#151515] p-5 rounded-[1.5rem] border border-white/10">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Jumlah Pesanan</label>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center bg-black/30 rounded-xl p-1 border border-white/10">
                                    <button onClick={() => updateQty(-1)} className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold hover:bg-white/10">-</button>
                                    <input type="number" value={quantity} readOnly className="w-16 bg-transparent text-center font-black text-2xl outline-none text-white" />
                                    <button onClick={() => updateQty(1)} className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Estimasi Harga</p>
                                    <div>
                                        {totalPrice === 0 ? (
                                            <span className="text-3xl font-black text-[#ffbe00]">FREE</span>
                                        ) : (
                                            <span className="text-3xl font-black text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={cn("mt-3 pt-3 border-t border-white/5 text-[11px] font-bold italic", totalPrice === 0 ? "text-green-500" : "text-gray-400")}>
                                {priceNote}
                            </div>
                        </div>

                        {/* FORM INPUTS */}
                        <div className="space-y-6">
                            
                            {/* 1. Nama Lengkap (Editable) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap (Sesuai KTP)</label>
                                <input 
                                    type="text" 
                                    value={fullName} 
                                    onChange={e => setFullName(e.target.value.toUpperCase())} 
                                    placeholder="IRSYAD JAMAL PRATAMA PUTRA" 
                                    className="w-full bg-[#151515] border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-600 focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] focus:outline-none transition uppercase" 
                                />
                            </div>

                            {/* 2. OPSI NAMA PUNGGUNG (Smart Selector) */}
                            <div className="bg-[#151515] p-5 rounded-[1.5rem] border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-xs font-bold text-[#ffbe00] uppercase tracking-widest">
                                        <Lock className="w-3 h-3" /> Pilih Nama Punggung
                                    </label>
                                    <RefreshCw className="w-3 h-3 text-gray-500 animate-spin-slow" />
                                </div>

                                {/* OPSI A: DEPAN + INISIAL */}
                                <div 
                                    onClick={() => setNameOption('A')}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                                        nameOption === 'A' 
                                            ? "border-[#ffbe00] bg-[#ffbe00]/10" 
                                            : "border-white/5 bg-black/20 hover:border-white/20"
                                    )}
                                >
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 1: Nama Depan + Inisial</p>
                                        <p className="text-xl font-black text-white tracking-widest">
                                            {generatedOptions.A || "..."}
                                        </p>
                                    </div>
                                    {nameOption === 'A' && <div className="w-6 h-6 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><Check className="w-4 h-4" /></div>}
                                </div>

                                {/* OPSI B: INISIAL + BELAKANG */}
                                <div 
                                    onClick={() => setNameOption('B')}
                                    className={cn(
                                        "p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group",
                                        nameOption === 'B' 
                                            ? "border-[#ffbe00] bg-[#ffbe00]/10" 
                                            : "border-white/5 bg-black/20 hover:border-white/20"
                                    )}
                                >
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 2: Inisial + Nama Belakang</p>
                                        <p className="text-xl font-black text-white tracking-widest">
                                            {generatedOptions.B || "..."}
                                        </p>
                                    </div>
                                    {nameOption === 'B' && <div className="w-6 h-6 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><Check className="w-4 h-4" /></div>}
                                </div>

                                <div className="text-[10px] text-gray-500 leading-tight pt-2 border-t border-white/5">
                                    *Sistem otomatis menyingkat nama sesuai standar BWF (Maks 12 Karakter). Pilih salah satu yang Anda sukai.
                                </div>
                            </div>

                            {/* 3. Size & WA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Ukuran</label>
                                        <button type="button" onClick={toggleSizeChart} className="text-[10px] font-bold text-[#ffbe00] hover:text-white flex items-center gap-1">
                                            <Ruler className="w-3 h-3" /> Chart
                                        </button>
                                    </div>
                                    <select 
                                        value={selectedSize} 
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                        className="w-full bg-[#151515] border border-white/20 rounded-xl px-4 py-4 text-lg font-bold text-white focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] focus:outline-none transition appearance-none"
                                    >
                                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp</label>
                                    <input 
                                        type="tel" 
                                        value={whatsAppNumber} 
                                        onChange={e => setWhatsAppNumber(e.target.value)} 
                                        placeholder="08xxxxxxxxxx" 
                                        className="w-full bg-[#151515] border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-white/10 pb-12">
                            <Button 
                                onClick={handleClaim} 
                                disabled={isLoading}
                                className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-xl hover:bg-[#ffbe00] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,214,10,0.6)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><span>KONFIRMASI PESANAN</span><ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
                            </Button>
                            <p className="text-center text-[10px] text-gray-500 mt-4">Dengan memesan, Anda setuju dengan Syarat & Ketentuan BadminTour.</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL (Tetap sama) */}
            <div className={cn(
                "fixed inset-0 bg-black/95 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
                isClaimed ? "flex opacity-100 visible" : "hidden opacity-0 invisible"
            )}>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Order Received!</h2>
                <p className="text-gray-400 mb-8 max-w-xs mx-auto text-sm leading-relaxed">Terima kasih! Admin kami akan menghubungi WhatsApp kamu ({whatsAppNumber}) untuk konfirmasi.</p>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-8 w-full max-w-xs relative overflow-hidden group cursor-pointer hover:bg-white/10 transition">
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#ffbe00]"></div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Kode Pesanan</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-widest group-hover:tracking-[0.2em] transition-all">{orderId}</p>
                </div>

                <Link href="/" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition uppercase tracking-widest">
                    Kembali ke Home
                </Link>
            </div>

            {/* SIZE CHART MODAL (Tetap sama) */}
            <div id="sizeChartModal" className={cn("fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300", isSizeChartOpen ? 'opacity-100 visible' : 'opacity-0 invisible')} onClick={toggleSizeChart}>
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
                <div className={cn("bg-[#1A1A1A] w-full max-w-sm rounded-[2rem] border border-white/10 shadow-2xl relative z-10 overflow-hidden transform transition-all duration-300", isSizeChartOpen ? 'scale-100' : 'scale-95')} onClick={(e) => e.stopPropagation()}>
                    <div className="bg-[#ffbe00] p-6 flex justify-between items-center">
                        <h3 className="text-black font-black text-2xl uppercase tracking-tighter">📏 Size Chart</h3>
                        <button onClick={toggleSizeChart} className="text-black bg-black/10 p-2 rounded-full hover:bg-black/20"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6">
                        <p className="text-xs text-gray-400 mb-6 text-center uppercase tracking-widest font-bold">Unisex Regular Fit (CM)</p>
                        <div className="space-y-2">
                            <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">S</span> <span className="text-white">47 x 67</span></div>
                            <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">M</span> <span className="text-white">50 x 70</span></div>
                            <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">L</span> <span className="text-white">52 x 72</span></div>
                            <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XL</span> <span className="text-white">54 x 74</span></div>
                            <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XXL</span> <span className="text-white">56 x 77</span></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-4 text-center">*Lebar Dada x Panjang Badan</p>
                    </div>
                </div>
            </div>
        </>
    );
}
```