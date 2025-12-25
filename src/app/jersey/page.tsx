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
    Lock
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

export default function PublicJerseyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [existingOrder, setExistingOrder] = useState<any>(null);

    // Form State
    const [size, setSize] = useState("");
    const [customName, setCustomName] = useState("");
    const [clubName, setClubName] = useState("");

    // 1. Fetch Existing Order (Jika Login)
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
                        } else {
                            // Pre-fill nama jika belum order
                            setCustomName(session?.user?.name?.split(" ")[0].toUpperCase() || "");
                        }
                    }
                } catch (e) {
                    console.error("Gagal load order");
                }
            };
            fetchOrder();
        }
    }, [status, session]);

    // 2. Handle Action
    const handleAction = async () => {
        // A. Jika Belum Login -> Redirect ke Login
        if (status === 'unauthenticated') {
            toast({
                title: "Login Required",
                description: "Silakan login terlebih dahulu untuk klaim jersey.",
                className: "bg-[#ca1f3d] text-white border-none"
            });
            router.push('/login');
            return;
        }

        // B. Jika Login -> Submit Data
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

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        OFFICIAL <span className="text-[#ffbe00]">SEASON 1</span> KIT
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Jersey eksklusif member BadminTour. Material Dri-Fit Premium.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
                    
                    {/* LEFT: PREVIEW IMAGE (CLEAN) */}
                    <div className="relative group">
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ca1f3d]/20 to-[#ffbe00]/20 blur-[80px] rounded-full pointer-events-none"></div>
                        
                        <div className="relative z-10 bg-[#151515] border border-white/5 rounded-[3rem] p-8 flex items-center justify-center min-h-[500px] shadow-2xl overflow-hidden">
                            <div className="relative w-full h-[400px] transition-transform duration-500 group-hover:scale-105">
                                <Image 
                                    src="/images/jersey-season-1.png" 
                                    alt="Official Jersey" 
                                    fill 
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>

                            {/* Status Badge (Only if logged in) */}
                            {status === 'authenticated' && (
                                <div className="absolute top-6 right-6">
                                    {existingOrder ? (
                                        <div className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> CLAIMED
                                        </div>
                                    ) : (
                                        <div className="bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                                            <AlertCircle className="w-4 h-4" /> AVAILABLE
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: FORM */}
                    <div className="space-y-8">
                        
                        {/* Size Guide */}
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
                            <p className="text-[10px] text-gray-500 mt-3 text-center">*Lebar dada dalam cm.</p>
                        </Card>

                        {/* Input Form */}
                        <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
                            {/* Blur overlay jika belum login */}
                            {status === 'unauthenticated' && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                                    <Lock className="w-12 h-12 text-[#ffbe00] mb-4" />
                                    <h3 className="text-2xl font-black text-white mb-2">Member Only</h3>
                                    <p className="text-gray-400 mb-6 max-w-xs">
                                        Login sekarang untuk klaim jersey eksklusif ini secara gratis.
                                    </p>
                                    <Button 
                                        onClick={() => router.push('/login')}
                                        className="bg-[#ffbe00] text-black font-black px-8 h-12 rounded-xl hover:bg-yellow-400"
                                    >
                                        LOGIN TO CLAIM
                                    </Button>
                                </div>
                            )}

                            <div className="space-y-6 relative z-10">
                                {/* Size */}
                                <div className="space-y-3">
                                    <Label className="text-white font-bold flex items-center gap-2">
                                        <Shirt className="w-4 h-4 text-[#ffbe00]" /> Pilih Ukuran
                                    </Label>
                                    <Select value={size} onValueChange={setSize} disabled={!!existingOrder || status === 'unauthenticated'}>
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
                                        <User className="w-4 h-4 text-[#ffbe00]" /> Nama Punggung
                                    </Label>
                                    <Input 
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value.toUpperCase().slice(0, 12))}
                                        placeholder="IRSAD JPP"
                                        className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-black uppercase tracking-widest rounded-xl focus:border-[#ffbe00]"
                                        disabled={!!existingOrder || status === 'unauthenticated'}
                                    />
                                </div>

                                 {/* Club Name */}
                                 <div className="space-y-3">
                                    <Label className="text-white font-bold flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" /> Nama Club (Opsional)
                                    </Label>
                                    <Input 
                                        value={clubName}
                                        onChange={(e) => setClubName(e.target.value.toUpperCase().slice(0, 15))}
                                        placeholder="PB INDONESIA"
                                        className="bg-[#0a0a0a] border-white/10 h-14 text-white text-lg font-bold uppercase rounded-xl focus:border-[#ffbe00]"
                                        disabled={!!existingOrder || status === 'unauthenticated'}
                                    />
                                </div>

                                {/* Button */}
                                {status === 'authenticated' && existingOrder ? (
                                    <Button className="w-full h-14 bg-gray-800 text-gray-400 font-bold rounded-xl cursor-not-allowed" disabled>
                                        <CheckCircle2 className="w-5 h-5 mr-2" /> SUDAH DIKLAIM
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleAction} 
                                        disabled={isLoading || status === 'unauthenticated'}
                                        className="w-full h-14 bg-[#ffbe00] hover:bg-yellow-400 text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,190,0,0.4)] hover:scale-105 transition-transform"
                                    >
                                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <><Save className="w-5 h-5 mr-2" /> KLAIM SEKARANG</>}
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
