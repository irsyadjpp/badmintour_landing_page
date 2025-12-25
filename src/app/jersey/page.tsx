'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    Shirt, 
    Ruler, 
    User, 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Phone,
    UserCircle,
    ArrowRightLeft,
    MoveVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// --- DATA SIZE CHART BARU ---
const sizeChartData = [
    { size: 'S', width: 47, length: 67 },
    { size: 'M', width: 50, length: 70 },
    { size: 'L', width: 52, length: 72 },
    { size: 'XL', width: 54, length: 74 },
    { size: 'XXL', width: 56, length: 77 },
];

export default function JerseyPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [existingOrder, setExistingOrder] = useState<any>(null);

    // Form State
    const [size, setSize] = useState("");
    const [customName, setCustomName] = useState("");
    const [clubName, setClubName] = useState("");
    
    // Contact Info (Wajib untuk Guest)
    const [senderName, setSenderName] = useState("");
    const [senderPhone, setSenderPhone] = useState("");

    // 1. Cek Pesanan Saya (Jika Login)
    useEffect(() => {
        if (status === 'authenticated') {
            const fetchOrder = async () => {
                try {
                    const res = await fetch('/api/member/jersey');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.order) {
                            setExistingOrder(data.order);
                            setSize(data.order.size);
                            setCustomName(data.order.customName);
                            setClubName(data.order.clubName);
                            setSenderName(data.order.senderName);
                            setSenderPhone(data.order.senderPhone);
                        } else {
                            // Pre-fill data user
                            // @ts-ignore
                            const nick = session?.user?.nickname || session?.user?.name?.split(" ")[0] || "";
                            setCustomName(nick.toUpperCase());
                            setSenderName(session?.user?.name || "");
                        }
                    }
                } catch (e) {
                    console.error("Gagal load order");
                }
            };
            fetchOrder();
        }
    }, [status, session]);

    // 2. Handle Order
    const handleOrder = async () => {
        // Validation
        if(!size || !customName || !senderName || !senderPhone) {
            toast({ 
                title: "Data Tidak Lengkap", 
                description: "Nama, No WA, Ukuran, dan Nama Punggung wajib diisi.", 
                variant: "destructive" 
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/member/jersey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    size, 
                    customName, 
                    clubName,
                    senderName,
                    senderPhone
                })
            });

            if (res.ok) {
                toast({
                    title: "Pesanan Berhasil! 🎉",
                    description: "Admin akan menghubungi via WhatsApp untuk konfirmasi pembayaran.",
                    className: "bg-green-600 text-white border-none"
                });
                // Jika login, update state existing order
                if (status === 'authenticated') {
                    setExistingOrder({ size, customName, clubName, status: 'pending' });
                } else {
                    // Jika guest, reset form penting
                    setCustomName("");
                    setClubName("");
                    setSize("");
                }
            } else {
                throw new Error("Gagal menyimpan");
            }
        } catch (error) {
            toast({ title: "Error", description: "Terjadi kesalahan sistem.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* PAGE HEADER */}
                <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            OFFICIAL <span className="text-[#ffbe00]">SEASON 1</span> KIT
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg max-w-xl">
                            Edisi Terbatas. Material Dri-Fit Premium dengan sablon polyflex berkualitas.
                        </p>
                    </div>
                    
                    {/* Status Badge */}
                    {status === 'authenticated' && existingOrder ? (
                        <div className="bg-green-500/10 border border-green-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <div className="text-left">
                                <p className="text-green-500 font-bold text-sm">CLAIMED</p>
                                <p className="text-gray-400 text-xs">Pesanan dikonfirmasi</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#ffbe00]/10 border border-[#ffbe00]/20 px-6 py-3 rounded-2xl flex items-center gap-3 animate-pulse">
                            <AlertCircle className="w-6 h-6 text-[#ffbe00]" />
                            <div className="text-left">
                                <p className="text-[#ffbe00] font-bold text-sm">PRE-ORDER OPEN</p>
                                <p className="text-gray-400 text-xs">Siapapun bisa pesan</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* LEFT: JERSEY PREVIEW (CLEAN PRODUCT SHOT) */}
                    <div className="relative group perspective-1000">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ca1f3d]/30 via-[#ffbe00]/10 to-transparent blur-[100px] rounded-full pointer-events-none"></div>
                        
                        {/* Container Gambar */}
                        <div className="relative z-10 bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-[3rem] p-8 flex items-center justify-center min-h-[550px] shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#ffbe00]/30">
                            
                            {/* Gambar Jersey Polos - Efek Hover Subtle Scale */}
                            <div className="relative w-full h-[500px] transition-transform duration-500 group-hover:scale-105">
                                <Image 
                                    src="/images/jersey-season-1.png" 
                                    alt="Official Jersey Season 1 - Clean View" 
                                    fill 
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER FORM & SIZE CHART */}
                    <div className="space-y-6">
                        
                        {/* NEW SIZE CHART (UPDATED DATA) */}
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-white">
                                    <Ruler className="w-5 h-5 text-[#ffbe00]" />
                                    <h3 className="font-bold">Size Chart</h3>
                                </div>
                                <span className="text-xs text-gray-500">Unisex Regular Fit (CM)</span>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-3">
                                {sizeChartData.map((item) => (
                                    <div key={item.size} className="bg-[#0a0a0a] border border-white/10 rounded-xl py-3 flex flex-col items-center justify-center group hover:border-[#ffbe00]/50 transition-colors cursor-default">
                                        {/* Size Label */}
                                        <span className="text-[#ffbe00] font-black text-xl mb-2">{item.size}</span>
                                        
                                        {/* Measurements */}
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <div className="flex items-center gap-1" title="Lebar Dada">
                                                <ArrowRightLeft className="w-3 h-3" />
                                                <span className="font-bold text-white">{item.width}</span>
                                            </div>
                                            <span className="text-gray-600">x</span>
                                            <div className="flex items-center gap-1" title="Panjang Badan">
                                                <MoveVertical className="w-3 h-3" />
                                                <span className="font-bold text-white">{item.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-3 text-center">
                                *Lebar Dada x Panjang Badan. Toleransi 1-2 cm.
                            </p>
                        </Card>

                        {/* Order Input Card */}
                        <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
                            <div className="space-y-8 relative z-10">
                                
                                {/* 1. Data Pemesan (Wajib) */}
                                <div className="space-y-4 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 w-1 bg-[#ffbe00] rounded-full"></div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kontak Pemesan</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-gray-400 text-xs">Nama Lengkap</Label>
                                            <div className="relative">
                                                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <Input 
                                                    value={senderName}
                                                    onChange={(e) => setSenderName(e.target.value)}
                                                    placeholder="Nama Kamu"
                                                    className="bg-[#0a0a0a] border-white/10 pl-10 text-white h-12 rounded-xl focus:border-[#ffbe00]"
                                                    disabled={!!existingOrder}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400 text-xs">WhatsApp (Aktif)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <Input 
                                                    value={senderPhone}
                                                    onChange={(e) => setSenderPhone(e.target.value)}
                                                    placeholder="0812..."
                                                    type="tel"
                                                    className="bg-[#0a0a0a] border-white/10 pl-10 text-white h-12 rounded-xl focus:border-[#ffbe00]"
                                                    disabled={!!existingOrder}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Detail Jersey */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 w-1 bg-[#ca1f3d] rounded-full"></div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Detail Custom</h4>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <Shirt className="w-4 h-4 text-[#ffbe00]" /> Pilih Ukuran
                                        </Label>
                                        <Select value={size} onValueChange={setSize} disabled={!!existingOrder}>
                                            <SelectTrigger className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-bold rounded-xl focus:ring-[#ffbe00]">
                                                <SelectValue placeholder="Pilih Size Sesuai Chart" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                {sizeChartData.map(item => (
                                                    <SelectItem key={item.size} value={item.size}>
                                                        Size {item.size} ({item.width}x{item.length})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <User className="w-4 h-4 text-[#ffbe00]" /> Nama Punggung
                                        </Label>
                                        <Input 
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                                            placeholder="NICKNAME"
                                            className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-black uppercase tracking-widest rounded-xl focus:border-[#ffbe00]"
                                            disabled={!!existingOrder}
                                        />
                                        <p className="text-[10px] text-gray-500">*Maksimal 12 karakter kapital.</p>
                                    </div>

                                     <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" /> Nama Club / PB (Opsional)
                                        </Label>
                                        <Input 
                                            value={clubName}
                                            onChange={(e) => setClubName(e.target.value.toUpperCase().slice(0, 15))}
                                            placeholder="PB INDONESIA"
                                            className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-bold uppercase rounded-xl focus:border-[#ffbe00]"
                                            disabled={!!existingOrder}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                {status === 'authenticated' && existingOrder ? (
                                    <Button className="w-full h-14 bg-gray-800 text-gray-500 font-bold rounded-xl border border-white/5 cursor-not-allowed" disabled>
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> SUDAH DIKLAIM
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleOrder} 
                                        disabled={isLoading}
                                        className="w-full h-14 bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d] hover:from-[#ffbe00]/90 hover:to-[#ca1f3d]/90 text-white font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.3)] hover:scale-105 transition-transform"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Save className="w-5 h-5 mr-2" /> KIRIM PESANAN</>}
                                    </Button>
                                )}
                            </div>
                        </Card>

                        {/* Note */}
                        <div className="flex items-start gap-3 px-2 opacity-70">
                            <div className="w-5 h-5 rounded-full bg-[#ffbe00]/10 flex items-center justify-center mt-0.5">
                                <span className="text-[10px] text-[#ffbe00] font-bold">i</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Setelah mengirim pesanan, mohon tunggu konfirmasi dari Admin melalui WhatsApp untuk detail pembayaran dan produksi.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
