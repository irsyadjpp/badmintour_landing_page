'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ArrowRight, Ruler, X, Check, Loader2, Lock, RefreshCw, Download, TriangleAlert } from 'lucide-react'; // Tambah Download
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCode from "react-qr-code";

export default function JerseyDropPage() {
    // ... (STATE DAN LOGIC LAIN TETAP SAMA SEPERTI SEBELUMNYA) ...
    const { data: session } = useSession();
    const { toast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('L');
    const [fullName, setFullName] = useState('');
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    const [nameOption, setNameOption] = useState<'A' | 'B'>('A');
    const [generatedOptions, setGeneratedOptions] = useState({ A: '', B: '' });
    const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [isDuplicateError, setIsDuplicateError] = useState(false);

    // ... (EFFECTS DAN HANDLERS LAIN TETAP SAMA) ...
    // Copy paste logic useEffect generateOptions, totalPrice, updateQty, handleClaim dari kode sebelumnya di sini.
    const basePrice = 150000;
    const totalPrice = useMemo(() => {
        const paidQty = Math.max(0, quantity - 1);
        return paidQty * basePrice;
    }, [quantity]);

    const updateQty = (change: number) => {
        setQuantity(prev => {
            const newQty = prev + change;
            if (newQty < 1) return 1;
            if (newQty > 10) return 10;
            return newQty;
        });
    };

    useEffect(() => {
        if (session?.user?.name) {
            setFullName(session.user.name.toUpperCase());
        }
    }, [session]);

    useEffect(() => {
        const generateOptions = (name: string) => {
            if (!name) return { A: '', B: '' };
            const cleanName = name.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
            const parts = cleanName.split(/\s+/).filter(p => p.length > 0);
            if (parts.length === 0) return { A: '', B: '' };
            if (parts.length === 1) {
                return { A: parts[0], B: parts[0] };
            }
            const first = parts[0];
            const initialsTail = parts.slice(1).map(p => p[0]).join(' ');
            let optionA = `${first} ${initialsTail}`.trim();
            const last = parts[parts.length - 1];
            const initialsHead = parts.slice(0, parts.length - 1).map(p => p[0]).join(' ');
            let optionB = `${initialsHead} ${last}`.trim();
            if (optionA.length > 12) optionA = optionA.replace(/\s/g, '').slice(0, 12);
            if (optionB.length > 12) optionB = optionB.replace(/\s/g, '').slice(0, 12);
            return { A: optionA, B: optionB };
        };
        setGeneratedOptions(generateOptions(fullName));
    }, [fullName]);

    const handleClaim = async () => {
        const finalBackName = nameOption === 'A' ? generatedOptions.A : generatedOptions.B;
        if (!fullName || !finalBackName || !whatsAppNumber) {
            toast({ title: "Data Kurang", description: "Mohon lengkapi semua data.", variant: "destructive" });
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
                setOrderId(data.orderId);
                setIsClaimed(true);
            } else { throw new Error(data.error); }
        } catch (error: any) {
            if (error.message && (error.message.includes("sudah digunakan") || error.message.includes("Duplicate"))) {
                setIsDuplicateError(true);
            } else {
                console.error("[JERSEY_ORDER_ERROR]", error);
                toast({ title: "Error", description: "Gagal memproses pesanan.", variant: "destructive" });
            }
        } finally { setIsLoading(false); }
    };

    const toggleSizeChart = () => setIsSizeChartOpen(!isSizeChartOpen);
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const priceNote = useMemo(() => {
        if (totalPrice === 0) return "✨ Selamat! Kamu berhak mendapatkan 1 Jersey Gratis.";
        return `ℹ️ Info Tagihan: 1 Pcs Gratis + ${quantity - 1} Pcs Berbayar (@150k)`;
    }, [totalPrice, quantity]);

    // --- FITUR DOWNLOAD QR CODE DENGAN BRANDING ---
    const handleDownloadQR = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgElement = document.getElementById("qr-code-svg"); // Ambil SVG dari DOM

        if (!ctx || !svgElement) return;

        // Set Resolusi Canvas (HD)
        canvas.width = 1080;
        canvas.height = 1350; // Ratio 4:5

        // 1. Gambar Background
        ctx.fillStyle = "#151515"; // Dark Background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Load Logo
        const logoImg = new window.Image(); // Explicit window.Image for TS
        logoImg.src = "/images/logo.png";
        logoImg.crossOrigin = "anonymous";

        logoImg.onload = () => {
            // Draw Logo (Centered Top)
            const logoWidth = 200;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = (canvas.width - logoWidth) / 2;
            ctx.drawImage(logoImg, logoX, 150, logoWidth, logoHeight);

            // Draw Header Text
            ctx.font = "bold 60px sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("BADMINTOUR", canvas.width / 2, 150 + logoHeight + 80);

            // Draw Subheader
            ctx.font = "40px sans-serif";
            ctx.fillStyle = "#FFBE00";
            ctx.fillText("OFFICIAL JERSEY ORDER", canvas.width / 2, 150 + logoHeight + 140);

            // 3. Draw QR Code (Convert SVG to Image)
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const qrImg = new window.Image();

            qrImg.onload = () => {
                // Background Putih untuk QR
                const qrBoxSize = 600;
                const qrBoxX = (canvas.width - qrBoxSize) / 2;
                const qrBoxY = 600;

                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

                // Draw QR Image
                const padding = 50;
                ctx.drawImage(qrImg, qrBoxX + padding, qrBoxY + padding, qrBoxSize - (padding * 2), qrBoxSize - (padding * 2));

                URL.revokeObjectURL(url);

                // 4. Draw Order ID
                ctx.font = "bold 50px monospace";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(orderId, canvas.width / 2, qrBoxY + qrBoxSize + 100);

                // Footer Text
                ctx.font = "30px sans-serif";
                ctx.fillStyle = "#888888";
                ctx.fillText("Scan this code at pickup location", canvas.width / 2, canvas.height - 100);

                // 5. Trigger Download
                const link = document.createElement("a");
                link.download = `JERSEY-ORDER-${orderId}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            };
            qrImg.src = url;
        };
    };

    // State for Stock
    const [stockStatus, setStockStatus] = useState({ total: 0, limit: 20, isSoldOut: false });

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await fetch('/api/jersey/status');
                const data = await res.json();
                if (data.total !== undefined) {
                    setStockStatus(data);
                }
            } catch (e) {
                console.error("Failed to fetch stock", e);
            }
        };
        fetchStock();
    }, []);

    // ... (rest of logic) ...

    return (
        <>
            {/* SOLD OUT OVERLAY */}
            {stockStatus.isSoldOut && !isClaimed && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#151515] border border-white/10 p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden rounded-[2rem]">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#ca1f3d]"></div>
                        {/* Shirt Icon */}
                        <div className="w-20 h-20 mx-auto text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-[#ca1f3d] uppercase tracking-tighter mb-2">SOLD OUT</h2>
                            <p className="text-gray-400">Kuota 20 Pcs Pre-Order Jersey Season 1 telah terpenuhi. Terima kasih atas antusiasme Anda!</p>
                        </div>
                        <Link href="/">
                            <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl">
                                KEMBALI KE HOME
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* ... (HEADER & PREVIEW IMAGE TETAP SAMA) ... */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
                <Link href="/" className="pointer-events-auto w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition border border-white/10 text-white">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex flex-col items-end gap-2">
                    <div className="pointer-events-auto bg-[#ffbe00] text-black px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,190,0,0.4)] animate-pulse border-2 border-black">
                        Public Access
                    </div>
                    {/* Stock Badge */}
                    <div className={cn("pointer-events-auto px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide border bg-black/80 backdrop-blur-md", stockStatus.isSoldOut ? "border-red-500 text-red-500" : "border-[#ffbe00] text-[#ffbe00]")}>
                        {stockStatus.isSoldOut ? "QUOTA FULL" : `TERSISA ${stockStatus.limit - stockStatus.total} SLOT`}
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row min-h-screen bg-[#0a0a0a]">
                <div className="lg:w-1/2 relative bg-[#121212] flex items-center justify-center p-8 lg:sticky lg:top-0 lg:h-screen overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                    <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#ca1f3d]/20 blur-[120px] rounded-full animate-[pulse_8s_infinite]"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ffbe00]/10 blur-[120px] rounded-full animate-[pulse_10s_infinite]"></div>
                    <div className="relative w-full max-w-md aspect-square z-10 group perspective-1000">
                        <Image src="/images/jersey-season-1.png" alt="Jersey Preview" width={1000} height={1000} className="w-full h-full object-contain transition-all duration-500 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] drop-shadow-[0_20px_50px_rgba(255,190,0,0.4)] group-hover:scale-110 group-hover:drop-shadow-[0_30px_70px_rgba(202,31,61,0.5)]" priority />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl z-20">
                            <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest">Season 1</p>
                            <p className="text-white font-black text-lg">Official Kit</p>
                        </div>
                    </div>
                </div>

                {/* ... (FORM SECTION TETAP SAMA) ... */}
                <div className="lg:w-1/2 bg-[#0a0a0a] relative flex flex-col">
                    <div className="flex-1 p-6 md:p-12 lg:p-16 space-y-10 max-w-2xl mx-auto w-full pt-24 lg:pt-16">
                        {/* Judul, Qty, Inputs... (Copy paste kode sebelumnya) */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 text-white">Claim Your <br /><span className="text-[#ffbe00]">Legacy.</span></h1>
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide border border-green-500/30">Free Claim Available</span>
                            </div>
                        </div>

                        {/* ... INPUTS FORM ... (Sama seperti sebelumnya) */}
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
                                    <div>{totalPrice === 0 ? <span className="text-3xl font-black text-[#ffbe00]">FREE</span> : <span className="text-3xl font-black text-white">Rp {totalPrice.toLocaleString('id-ID')}</span>}</div>
                                </div>
                            </div>
                            <div className={cn("mt-3 pt-3 border-t border-white/5 text-[11px] font-bold italic", totalPrice === 0 ? "text-green-500" : "text-gray-400")}>{priceNote}</div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap (Sesuai KTP)</label>
                                <input type="text" value={fullName} onChange={e => setFullName(e.target.value.toUpperCase())} placeholder="IRSYAD JAMAL PRATAMA PUTRA" className="w-full bg-[#151515] border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-600 focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] focus:outline-none transition uppercase" />
                            </div>
                            <div className="bg-[#151515] p-5 rounded-[1.5rem] border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="flex items-center gap-2 text-xs font-bold text-[#ffbe00] uppercase tracking-widest"><Lock className="w-3 h-3" /> Pilih Nama Punggung</label>
                                    <RefreshCw className="w-3 h-3 text-gray-500 animate-spin-slow" />
                                </div>
                                <div onClick={() => setNameOption('A')} className={cn("p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group", nameOption === 'A' ? "border-[#ffbe00] bg-[#ffbe00]/10" : "border-white/5 bg-black/20 hover:border-white/20")}>
                                    <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 1: Nama Depan + Inisial</p><p className="text-xl font-black text-white tracking-widest">{generatedOptions.A || "..."}</p></div>
                                    {nameOption === 'A' && <div className="w-6 h-6 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><Check className="w-4 h-4" /></div>}
                                </div>
                                <div onClick={() => setNameOption('B')} className={cn("p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group", nameOption === 'B' ? "border-[#ffbe00] bg-[#ffbe00]/10" : "border-white/5 bg-black/20 hover:border-white/20")}>
                                    <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 2: Inisial + Nama Belakang</p><p className="text-xl font-black text-white tracking-widest">{generatedOptions.B || "..."}</p></div>
                                    {nameOption === 'B' && <div className="w-6 h-6 rounded-full bg-[#ffbe00] flex items-center justify-center text-black"><Check className="w-4 h-4" /></div>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Ukuran</label>
                                        <button type="button" onClick={toggleSizeChart} className="text-[10px] font-bold text-[#ffbe00] hover:text-white flex items-center gap-1"><Ruler className="w-3 h-3" /> Chart</button>
                                    </div>
                                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full bg-[#151515] border border-white/20 rounded-xl px-4 py-4 text-lg font-bold text-white focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] focus:outline-none transition appearance-none">
                                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp</label>
                                    <input type="tel" value={whatsAppNumber} onChange={e => setWhatsAppNumber(e.target.value)} placeholder="08xxxxxxxxxx" className="w-full bg-[#151515] border border-white/20 rounded-xl px-5 py-4 text-lg font-bold text-white placeholder-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 pb-12">
                            <Button onClick={handleClaim} disabled={isLoading} className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black text-xl hover:bg-[#ffbe00] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,214,10,0.6)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group h-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><span>KONFIRMASI PESANAN</span><ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL SUCCESS & QR CODE (UPDATED) --- */}
            <div className={cn(
                "fixed inset-0 bg-black/95 backdrop-blur-md z-[70] flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500",
                isClaimed ? "flex opacity-100 visible" : "hidden opacity-0 invisible"
            )}>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                    <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Order Received!</h2>
                <p className="text-gray-400 mb-6 max-w-xs mx-auto text-sm leading-relaxed">Simpan QR Code ini untuk pengambilan Jersey.</p>

                {/* --- QR CODE SECTION --- */}
                <div className="bg-white p-4 rounded-2xl mb-6 shadow-[0_0_50px_rgba(255,255,255,0.2)] relative">
                    {isClaimed && orderId && (
                        /* PERUBAHAN: Tambahkan ID agar bisa diambil oleh fungsi canvas */
                        <div className="p-2">
                            <QRCode
                                id="qr-code-svg"
                                size={180}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={orderId}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    )}
                    <p className="text-black font-mono font-black text-lg mt-2 tracking-widest">{orderId}</p>
                </div>

                <div className="flex gap-3">
                    {/* --- TOMBOL DOWNLOAD BARU --- */}
                    <Button
                        onClick={handleDownloadQR}
                        className="px-8 py-6 rounded-full bg-[#ffbe00] text-black font-bold text-sm hover:bg-yellow-400 transition uppercase tracking-widest shadow-[0_0_20px_rgba(255,190,0,0.5)]"
                    >
                        <Download className="w-4 h-4 mr-2" /> Simpan Gambar
                    </Button>

                    <Link href="/" className="px-8 py-6 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition uppercase tracking-widest flex items-center">
                        Tutup
                    </Link>
                </div>
            </div>

            {/* MODAL ERROR DUPLICATE (RED CARD THEME) */}
            <div className={cn(
                "fixed inset-0 bg-black/95 backdrop-blur-md z-[80] flex items-center justify-center p-6 text-center transition-all duration-500",
                isDuplicateError ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
            )}>
                <div className="relative w-full max-w-md">
                    {/* Background Effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ca1f3d]/20 blur-[100px] rounded-full animate-pulse"></div>

                    <div className="relative bg-[#151515] border-[#ca1f3d]/50 border-2 p-8 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(202,31,61,0.3)]">
                        {/* Red Card Visual */}
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <TriangleAlert className="w-32 h-32 text-[#ca1f3d]" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-[#ca1f3d]/20 rounded-full flex items-center justify-center mb-6 animate-bounce border border-[#ca1f3d]">
                                <TriangleAlert className="w-10 h-10 text-[#ca1f3d]" strokeWidth={2.5} />
                            </div>

                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">Double Fault!</h2>
                            <div className="h-1 w-16 bg-[#ca1f3d] rounded-full mb-6"></div>

                            <p className="text-gray-300 text-sm font-medium leading-relaxed mb-8">
                                Ops! Nomor WhatsApp <span className="text-white font-bold underline decoration-[#ffbe00]">{whatsAppNumber}</span> sudah mengamankan jersey.
                                <br /><br />
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">1 Nomor = 1 Jersey Official</span>
                            </p>

                            <div className="w-full space-y-3">
                                <Button
                                    onClick={() => setIsDuplicateError(false)}
                                    className="w-full bg-[#ca1f3d] hover:bg-[#a01830] text-white py-6 rounded-2xl font-black text-lg shadow-[0_4px_20px_rgba(202,31,61,0.4)] transition-all transform hover:scale-[1.02]"
                                >
                                    COBA NOMOR LAIN
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.reload()}
                                    className="w-full text-gray-500 hover:text-white py-4 font-bold text-sm"
                                >
                                    Batalkan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SIZE CHART MODAL */}
            <div id="sizeChartModal" className={cn("fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300", isSizeChartOpen ? 'opacity-100 visible' : 'opacity-0 invisible')} onClick={toggleSizeChart}>
                {/* Content Size Chart Sama */}
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
