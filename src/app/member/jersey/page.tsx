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
    AlertCircle 
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

export default function MemberJerseyPage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [existingOrder, setExistingOrder] = useState<any>(null);

    // Form State
    const [size, setSize] = useState("");
    const [customName, setCustomName] = useState("");
    const [clubName, setClubName] = useState("");

    // 1. Fetch Existing Order
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch('/api/member/jersey');
                if (res.ok) {
                    const data = await res.json();
                    if (data.order) {
                        setExistingOrder(data.order);
                        // Pre-fill form
                        setSize(data.order.size);
                        setCustomName(data.order.customName);
                        setClubName(data.order.clubName);
                    } else {
                        // Default Values
                        setCustomName(session?.user?.name?.split(" ")[0].toUpperCase() || "");
                    }
                }
            } catch (e) {
                console.error("Gagal load order");
            } finally {
                setIsFetching(false);
            }
        };
        if(session) fetchOrder();
    }, [session]);

    // 2. Handle Submit
    const handleSubmit = async () => {
        if(!size || !customName) {
            toast({ title: "Error", description: "Mohon lengkapi ukuran dan nama punggung.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/member/jersey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ size, customName, clubName })
            });

            if (res.ok) {
                toast({
                    title: "Berhasil Disimpan! 🎉",
                    description: "Data jersey kamu sudah masuk antrian produksi.",
                    className: "bg-green-600 text-white border-none"
                });
                setExistingOrder({ size, customName, clubName, status: 'pending' });
            } else {
                throw new Error("Gagal save");
            }
        } catch (error) {
            toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if(isFetching) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-[#ffbe00]"/></div>;

    return (
        <div className="space-y-8 pb-24 max-w-5xl mx-auto">
            
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Official <span className="text-[#ffbe00]">Kit</span></h1>
                <p className="text-gray-400 mt-2">Klaim jersey member season ini. Pastikan ukuran sesuai.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                {/* LEFT: PREVIEW IMAGE (CLEAN - NO TEXT) */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-[#ffbe00]/20 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 bg-[#151515] border border-white/5 rounded-[3rem] p-8 flex items-center justify-center min-h-[500px] shadow-2xl">
                        {/* UPDATE: Hapus Overlay Text, Sisakan Gambar Saja */}
                        <div className="relative w-full h-[400px] transition-transform duration-500 group-hover:scale-105">
                            <Image 
                                src="/images/jersey-season-1.png" 
                                alt="Official Jersey" 
                                fill 
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                            {existingOrder ? (
                                <div className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> CLAIMED
                                </div>
                            ) : (
                                <div className="bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                                    <AlertCircle className="w-4 h-4" /> NOT CLAIMED
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CUSTOMIZATION FORM */}
                <div className="space-y-8">
                    
                    {/* Size Guide Card */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <Ruler className="w-5 h-5 text-[#ffbe00]" />
                            <h3 className="font-bold">Size Chart (Regular Fit)</h3>
                        </div>
                        <div className="grid grid-cols-5 gap-2 text-center text-sm">
                            {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                                <div key={s} className="bg-[#0a0a0a] border border-white/10 rounded-lg py-2">
                                    <span className="text-gray-400 block text-xs mb-1">{s}</span>
                                    <span className="text-white font-bold">
                                        {s==='S'?'48':s==='M'?'50':s==='L'?'52':s==='XL'?'54':'56'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-3 text-center">*Lebar dada dalam cm. Toleransi 1-2cm.</p>
                    </Card>

                    {/* Input Form */}
                    <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem]">
                        <div className="space-y-6">
                            
                            {/* Size Selection */}
                            <div className="space-y-3">
                                <Label className="text-white font-bold flex items-center gap-2">
                                    <Shirt className="w-4 h-4 text-[#ffbe00]" /> Pilih Ukuran
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

                            {/* Custom Name */}
                            <div className="space-y-3">
                                <Label className="text-white font-bold flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#ffbe00]" /> Nama Punggung (Max 12 Char)
                                </Label>
                                <Input 
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                                    placeholder="IRSAD JPP"
                                    className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-black uppercase tracking-widest rounded-xl focus:border-[#ffbe00]"
                                    disabled={!!existingOrder}
                                />
                                <p className="text-xs text-gray-500">Akan dicetak kapital di bagian belakang.</p>
                            </div>

                             {/* Club Name (Optional) */}
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

                            {/* Action Button */}
                            {existingOrder ? (
                                <Button className="w-full h-14 bg-gray-800 text-gray-400 font-bold rounded-xl cursor-not-allowed" disabled>
                                    <CheckCircle2 className="w-5 h-5 mr-2" /> SUDAH DIKLAIM
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#ffbe00] hover:bg-yellow-400 text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform"
                                >
                                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Save className="w-5 h-5 mr-2" /> SIMPAN PESANAN</>}
                                </Button>
                            )}
                        </div>
                    </Card>

                    {existingOrder && (
                        <div className="bg-[#151515] border border-[#ffbe00]/20 p-4 rounded-2xl text-center">
                            <p className="text-[#ffbe00] text-sm">
                                *Jika ingin mengubah ukuran atau nama, silakan hubungi Admin sebelum tanggal 30.
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
