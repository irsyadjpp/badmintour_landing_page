
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { cn, isValidIndonesianPhoneNumber, formatIndonesianPhoneNumber } from '@/lib/utils';
import { Ruler, X, Check, Loader2, Lock, RefreshCw, Download, Shirt, ShoppingBag, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QRCode from "react-qr-code";
import Link from 'next/link';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { track } from '@vercel/analytics/react';

export default function MemberJerseyPage() {
    const { data: session } = useSession();
    const { toast } = useToast();

    // STATE
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

    // Pre-fill Data
    useEffect(() => {
        if (session?.user) {
            setFullName(session.user.name?.toUpperCase() || '');
            // Jika user sudah pairing WA, otomatis terisi
            // @ts-ignore
            if (session.user.phoneNumber) {
                // @ts-ignore
                setWhatsAppNumber(session.user.phoneNumber);
            }
        }
    }, [session]);

    // Logic Generate Nama Punggung
    useEffect(() => {
        const generateOptions = (name: string) => {
            if (!name) return { A: '', B: '' };
            const cleanName = name.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
            const parts = cleanName.split(/\s+/).filter(p => p.length > 0);

            if (parts.length === 0) return { A: '', B: '' };
            if (parts.length === 1) return { A: parts[0], B: parts[0] };

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

    // Submit Handler
    const handleClaim = async () => {
        const finalBackName = nameOption === 'A' ? generatedOptions.A : generatedOptions.B;

        if (!fullName || !finalBackName || !whatsAppNumber) {
            toast({ title: "Data Kurang", description: "Mohon lengkapi semua data.", variant: "destructive" });
            return;
        }

        // VALIDATION: Phone Number
        if (!isValidIndonesianPhoneNumber(whatsAppNumber)) {
            toast({ title: "Nomor Tidak Valid", description: "Format nomor WhatsApp harus Indonesia (08xx... / 628xx...).", variant: "destructive" });
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
            } else {
                throw new Error(data.error || "Gagal memproses pesanan");
            }
        } catch (error: any) {
            if (error.message && (error.message.includes("sudah digunakan") || error.message.includes("Duplicate"))) {
                setIsDuplicateError(true);
            } else {
                console.error("[MEMBER_JERSEY_ERROR]", error);
                toast({ title: "Error", description: "Terjadi kesalahan saat menyimpan pesanan.", variant: "destructive" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Download QR Function
    const handleDownloadQR = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const svgElement = document.getElementById("member-qr-svg");

        if (!ctx || !svgElement) return;

        canvas.width = 1080;
        canvas.height = 1350;

        ctx.fillStyle = "#151515";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const logoImg = new window.Image();
        logoImg.src = "/images/logo.png";
        logoImg.crossOrigin = "anonymous";

        logoImg.onload = () => {
            const logoWidth = 200;
            const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
            const logoX = (canvas.width - logoWidth) / 2;
            ctx.drawImage(logoImg, logoX, 150, logoWidth, logoHeight);

            ctx.font = "bold 60px sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("BADMINTOUR", canvas.width / 2, 150 + logoHeight + 80);

            ctx.font = "40px sans-serif";
            ctx.fillStyle = "#FFBE00";
            ctx.fillText("OFFICIAL JERSEY ORDER", canvas.width / 2, 150 + logoHeight + 140);

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const qrImg = new window.Image();

            qrImg.onload = () => {
                const qrBoxSize = 600;
                const qrBoxX = (canvas.width - qrBoxSize) / 2;
                const qrBoxY = 600;

                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);

                const padding = 50;
                ctx.drawImage(qrImg, qrBoxX + padding, qrBoxY + padding, qrBoxSize - (padding * 2), qrBoxSize - (padding * 2));
                URL.revokeObjectURL(url);

                ctx.font = "bold 50px monospace";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(orderId, canvas.width / 2, qrBoxY + qrBoxSize + 100);

                ctx.font = "30px sans-serif";
                ctx.fillStyle = "#888888";
                ctx.fillText("Scan this code at pickup location", canvas.width / 2, canvas.height - 100);

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

    // Sizes Constant
    const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

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
        <div className="space-y-6 pb-20 relative">

            {/* SOLD OUT OVERLAY */}
            {stockStatus.isSoldOut && !isClaimed && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <Card className="bg-[#151515] border-white/10 p-8 max-w-md w-full text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#ca1f3d]"></div>
                        <Shirt className="w-20 h-20 text-gray-700 mx-auto" />
                        <div>
                            <h2 className="text-4xl font-black text-[#ca1f3d] uppercase tracking-tighter mb-2">SOLD OUT</h2>
                            <p className="text-gray-400">Kuota 20 Pcs Pre-Order Jersey Season 1 telah terpenuhi. Terima kasih atas antusiasme Anda!</p>
                        </div>
                        <Link href="/member/dashboard">
                            <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl">
                                KEMBALI KE DASHBOARD
                            </Button>
                        </Link>
                    </Card>
                </div>
            )}

            {/* Header Member Style */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-3">
                        <Shirt className="w-8 h-8 text-[#ca1f3d]" /> PRE-ORDER JERSEY
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className={`border text-xs ${stockStatus.isSoldOut ? 'border-red-500 text-red-500' : 'border-[#ffbe00] text-[#ffbe00]'} font-bold`}>
                            {stockStatus.isSoldOut ? "QUOTA FULL" : `TERSISA ${stockStatus.limit - stockStatus.total} SLOT`}
                        </Badge>
                        <p className="text-gray-400 text-sm">Official Season 1</p>
                    </div>
                </div>
                <Link href="/member/dashboard">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black">
                        Kembali ke Dashboard
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* LEFT: Product Image (Takes 5 columns) */}
                <div className="xl:col-span-5">
                    <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group sticky top-24">
                        {/* Background Effects */}
                        <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#ca1f3d]/10 blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-[#ffbe00]/5 blur-[100px] rounded-full"></div>

                        <div className="relative aspect-square z-10 flex items-center justify-center">
                            <Image
                                src="/images/jersey-season-1.png"
                                alt="Jersey Preview"
                                width={600}
                                height={600}
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute top-0 left-0">
                                <Badge className="bg-[#ffbe00] text-black font-black hover:bg-[#ffbe00] text-xs px-3 py-1">SEASON 1</Badge>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <h3 className="text-2xl font-black text-white">OFFICIAL KIT 2026</h3>
                            <p className="text-gray-500 text-sm mt-2">Bahan Dri-Fit Premium dengan teknologi penyerapan keringat. Desain eksklusif komunitas Badmintour.</p>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: Form (Takes 7 columns) */}
                <div className="xl:col-span-7 space-y-6">

                    {/* Price Card */}
                    <Card className="bg-[#1A1A1A] border-white/5 p-6 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Tagihan</p>
                            <div className="flex items-baseline gap-2">
                                <span className={cn("text-3xl font-black", totalPrice === 0 ? "text-[#ffbe00]" : "text-white")}>
                                    {totalPrice === 0 ? "FREE" : `Rp ${totalPrice.toLocaleString('id-ID')}`}
                                </span>
                                {quantity > 1 && <span className="text-xs text-gray-400">(Buy 1 Free 1 Member Promo)</span>}
                            </div>
                        </div>
                        <div className="flex items-center bg-black/50 rounded-xl p-1 border border-white/10">
                            <button onClick={() => updateQty(-1)} className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold hover:bg-white/10">-</button>
                            <input type="number" value={quantity} readOnly className="w-16 bg-transparent text-center font-black text-xl outline-none text-white" />
                            <button onClick={() => updateQty(1)} className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                        </div>
                    </Card>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        {/* Nama */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value.toUpperCase())}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-5 py-4 text-white font-bold focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] outline-none transition uppercase"
                                placeholder="SESUAI KTP"
                            />
                        </div>

                        {/* Nama Punggung Generator */}
                        <Card className="bg-[#1A1A1A] border-white/5 p-5 rounded-[1.5rem] space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-xs font-bold text-[#ffbe00] uppercase tracking-widest"><Lock className="w-3 h-3" /> Pilih Nama Punggung</label>
                                <RefreshCw className="w-3 h-3 text-gray-500 animate-spin-slow" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div onClick={() => setNameOption('A')} className={cn("p-4 rounded-xl border-2 transition-all cursor-pointer relative", nameOption === 'A' ? "border-[#ffbe00] bg-[#ffbe00]/5" : "border-white/5 bg-black/20 hover:border-white/20")}>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 1</p>
                                    <p className="text-lg font-black text-white tracking-widest truncate">{generatedOptions.A || "..."}</p>
                                    {nameOption === 'A' && <div className="absolute top-3 right-3 text-[#ffbe00]"><Check className="w-4 h-4" /></div>}
                                </div>
                                <div onClick={() => setNameOption('B')} className={cn("p-4 rounded-xl border-2 transition-all cursor-pointer relative", nameOption === 'B' ? "border-[#ffbe00] bg-[#ffbe00]/5" : "border-white/5 bg-black/20 hover:border-white/20")}>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Opsi 2</p>
                                    <p className="text-lg font-black text-white tracking-widest truncate">{generatedOptions.B || "..."}</p>
                                    {nameOption === 'B' && <div className="absolute top-3 right-3 text-[#ffbe00]"><Check className="w-4 h-4" /></div>}
                                </div>
                            </div>
                        </Card>

                        {/* Size & WA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ukuran</label>
                                    <button onClick={() => setIsSizeChartOpen(true)} className="text-[10px] font-bold text-[#ffbe00] hover:underline flex items-center gap-1"><Ruler className="w-3 h-3" /> Size Chart</button>
                                </div>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:border-[#ffbe00] outline-none appearance-none"
                                >
                                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</label>
                                <input
                                    type="tel"
                                    value={whatsAppNumber}
                                    onChange={e => setWhatsAppNumber(e.target.value.replace(/\D/g, ''))}
                                    onBlur={() => {
                                        if (whatsAppNumber) setWhatsAppNumber(formatIndonesianPhoneNumber(whatsAppNumber));
                                    }}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-5 py-4 text-white font-bold focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                    placeholder="08..."
                                />
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={handleClaim}
                            disabled={isLoading}
                            className="w-full h-16 rounded-[1.2rem] bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-xl shadow-lg mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><ShoppingBag className="mr-2" /> PESAN SEKARANG</>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* MODAL SUCCESS & QR */}
            <Dialog open={isClaimed} onOpenChange={setIsClaimed}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-center font-black text-[#ffbe00] text-2xl uppercase tracking-widest">Order Success!</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-white p-4 rounded-2xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            {orderId && (
                                <QRCode
                                    id="member-qr-svg"
                                    size={200}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={orderId}
                                    viewBox={`0 0 256 256`}
                                />
                            )}
                        </div>
                        <p className="font-mono font-bold text-xl tracking-widest mb-6">{orderId}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <Button
                                onClick={handleDownloadQR}
                                className="w-full rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-bold h-12"
                            >
                                <Download className="w-4 h-4 mr-2" /> Simpan Tiket (Gambar)
                            </Button>
                            <Link href="/member/dashboard" className="w-full">
                                <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10 h-12">
                                    Selesai & Kembali
                                </Button>
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* MODAL ERROR DUPLICATE (RED CARD THEME) */}
            {/* MODAL FEEDBACK STANDARDIZED */}
            <FeedbackModal
                isOpen={isDuplicateError}
                onClose={() => setIsDuplicateError(false)}
                type="error"
                title="Double Fault!"
                description={
                    <span>
                        Ops! Nomor WhatsApp <span className="text-white font-bold underline decoration-[#ffbe00]">{whatsAppNumber}</span> sudah mengamankan jersey.
                        <br /><br />
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">1 Nomor = 1 Jersey Official</span>
                    </span>
                }
                primaryAction={{
                    label: "COBA NOMOR LAIN",
                    onClick: () => setIsDuplicateError(false)
                }}
                secondaryAction={{
                    label: "Batalkan",
                    onClick: () => window.location.reload()
                }}
            />

            {/* MODAL SIZE CHART */}
            <Dialog open={isSizeChartOpen} onOpenChange={setIsSizeChartOpen}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-[#ffbe00] font-black uppercase">Size Chart (Regular Fit)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">S</span> <span className="text-white">47 x 67 cm</span></div>
                        <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">M</span> <span className="text-white">50 x 70 cm</span></div>
                        <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">L</span> <span className="text-white">52 x 72 cm</span></div>
                        <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XL</span> <span className="text-white">54 x 74 cm</span></div>
                        <div className="flex justify-between p-3 bg-white/5 rounded-lg border border-white/10"><span className="font-bold text-[#ffbe00] w-8">XXL</span> <span className="text-white">56 x 77 cm</span></div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

