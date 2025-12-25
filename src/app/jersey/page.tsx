'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
    Shirt, 
    Ruler, 
    User, 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Phone,
    UserCircle
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

export default function JerseyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
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
                    description: "Admin akan menghubungi via WhatsApp untuk konfirmasi.",
                    className: "bg-green-600 text-white border-none"
                });
                // Jika login, update state existing order
                if (status === 'authenticated') {
                    setExistingOrder({ size, customName, clubName, status: 'pending' });
                } else {
                    // Jika guest, reset form atau redirect ke success page
                    setCustomName("");
                    setClubName("");
                    // Optional: router.push('/success');
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
                            Terbuka untuk Umum. Pre-Order Batch 1 ditutup tanggal 30.
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
                    
                    {/* LEFT: JERSEY PREVIEW */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ca1f3d]/20 to-[#ffbe00]/20 blur-[80px] rounded-full pointer-events-none"></div>
                        <div className="relative z-10 bg-[#151515] border border-white/5 rounded-[3rem] p-8 flex items-center justify-center min-h-[500px] shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#ffbe00]/30">
                            <div className="relative w-full h-[450px] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                                <Image 
                                    src="/images/jersey-season-1.png" 
                                    alt="Official Jersey" 
                                    fill 
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER FORM */}
                    <div className="space-y-6">
                        
                        {/* Size Guide */}
                        <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-white">
                                    <Ruler className="w-5 h-5 text-[#ffbe00]" />
                                    <h3 className="font-bold">Size Chart (Regular Fit)</h3>
                                </div>
                                <span className="text-xs text-gray-500">Lebar Dada (cm)</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2 text-center text-sm">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                                    <div key={s} className="bg-[#0a0a0a] border border-white/10 rounded-xl py-3 cursor-default">
                                        <span className="text-gray-400 block text-[10px] mb-1">{s}</span>
                                        <span className="text-white font-black text-lg">
                                            {s==='S'?'48':s==='M'?'50':s==='L'?'52':s==='XL'?'54':'56'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Order Input Card */}
                        <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem]">
                            <div className="space-y-6">
                                
                                {/* 1. Data Pemesan (Wajib) */}
                                <div className="space-y-4 pb-4 border-b border-white/5">
                                    <h4 className="text-sm font-bold text-[#ffbe00] uppercase tracking-wider">Data Pemesan</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-400 text-xs">Nama Lengkap</Label>
                                            <div className="relative">
                                                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <Input 
                                                    value={senderName}
                                                    onChange={(e) => setSenderName(e.target.value)}
                                                    placeholder="Nama Kamu"
                                                    className="bg-[#0a0a0a] border-white/10 pl-10 text-white rounded-xl"
                                                    disabled={!!existingOrder}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400 text-xs">WhatsApp</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <Input 
                                                    value={senderPhone}
                                                    onChange={(e) => setSenderPhone(e.target.value)}
                                                    placeholder="0812..."
                                                    type="tel"
                                                    className="bg-[#0a0a0a] border-white/10 pl-10 text-white rounded-xl"
                                                    disabled={!!existingOrder}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Detail Jersey */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-[#ffbe00] uppercase tracking-wider">Detail Jersey</h4>
                                    
                                    <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <Shirt className="w-4 h-4 text-gray-400" /> Pilih Ukuran
                                        </Label>
                                        <Select value={size} onValueChange={setSize} disabled={!!existingOrder}>
                                            <SelectTrigger className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-bold rounded-xl focus:ring-[#ffbe00]">
                                                <SelectValue placeholder="Pilih Size" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                {['S', 'M', 'L', 'XL', 'XXL', '3XL'].map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" /> Nama Punggung
                                        </Label>
                                        <Input 
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                                            placeholder="NICKNAME"
                                            className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-black uppercase tracking-widest rounded-xl focus:border-[#ffbe00]"
                                            disabled={!!existingOrder}
                                        />
                                    </div>

                                     <div className="space-y-3">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400" /> Nama Club (Opsional)
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
                                        className="w-full h-14 bg-[#ffbe00] hover:bg-yellow-400 text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Save className="w-5 h-5 mr-2" /> KIRIM PESANAN</>}
                                    </Button>
                                )}
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
