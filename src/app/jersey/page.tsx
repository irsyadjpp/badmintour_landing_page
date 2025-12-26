'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import QRCode from "react-qr-code"; // Pastikan install: npm install react-qr-code

export default function JerseyPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [size, setSize] = useState('L');
  const [customName, setCustomName] = useState('');
  const [qty, setQty] = useState(1);
  const [whatsapp, setWhatsapp] = useState('');
  
  // Success State
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const PRICE = 150000;
  const totalPrice = PRICE * qty;

  const handleOrder = async () => {
    if (!whatsapp) {
        toast({ title: "Mohon lengkapi data", description: "Nomor WhatsApp wajib diisi.", variant: "destructive" });
        return;
    }

    setLoading(true);

    try {
        const payload = {
            items: [{ size, customName, quantity: qty }],
            totalPrice,
            whatsapp,
            fullName: session?.user?.name, // Optional fallback
            email: session?.user?.email
        };

        const res = await fetch('/api/member/jersey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
            setSuccessData(data); // Simpan Order ID
            setShowSuccess(true); // Buka Modal QR
            toast({ title: "Order Berhasil!", description: "Silahkan simpan QR Code Anda." });
        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        toast({ title: "Gagal", description: "Terjadi kesalahan saat order.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image */}
        <div className="relative aspect-square bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10">
             <Image src="/images/jersey-season-1.png" alt="Jersey Season 1" fill className="object-cover" />
             <div className="absolute top-6 left-6 bg-[#ca1f3d] text-white px-4 py-2 rounded-full font-bold text-sm">
                SEASON 1
             </div>
        </div>

        {/* Right: Form */}
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl md:text-6xl font-black font-heading mb-2">OFFICIAL <span className="text-[#ffbe00]">JERSEY</span></h1>
                <p className="text-gray-400 text-lg">Edisi terbatas Season 1. Bahan Dri-Fit premium dengan sablon custom nama.</p>
                <p className="text-3xl font-black text-white mt-4">Rp {PRICE.toLocaleString('id-ID')}</p>
            </div>

            <div className="space-y-6 bg-[#151515] p-6 rounded-3xl border border-white/10">
                {/* Size Selection */}
                <div className="space-y-3">
                    <Label>Pilih Ukuran</Label>
                    <RadioGroup defaultValue="L" onValueChange={setSize} className="flex gap-4">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                            <div key={s}>
                                <RadioGroupItem value={s} id={`size-${s}`} className="peer sr-only" />
                                <Label htmlFor={`size-${s}`} className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-white/10 peer-data-[state=checked]:border-[#ffbe00] peer-data-[state=checked]:text-[#ffbe00] font-bold cursor-pointer hover:bg-white/5 transition-all">
                                    {s}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Custom Name */}
                <div className="space-y-3">
                    <Label>Custom Nama Punggung (Opsional)</Label>
                    <Input 
                        placeholder="Cth: IRSYAD" 
                        className="bg-black/50 border-white/10 h-12 rounded-xl uppercase font-bold tracking-widest"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        maxLength={12}
                    />
                </div>

                 {/* WhatsApp */}
                 <div className="space-y-3">
                    <Label>Nomor WhatsApp (Wajib)</Label>
                    <Input 
                        placeholder="0812..." 
                        className="bg-black/50 border-white/10 h-12 rounded-xl"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        type="tel"
                    />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between">
                    <Label>Jumlah</Label>
                    <div className="flex items-center gap-4 bg-black/50 p-2 rounded-xl border border-white/10">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"><Minus className="w-4 h-4"/></button>
                        <span className="font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg"><Plus className="w-4 h-4"/></button>
                    </div>
                </div>

                {/* Total & Button */}
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400">Total Pembayaran</span>
                        <span className="text-2xl font-black text-[#ffbe00]">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <Button 
                        onClick={handleOrder} 
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-[#ca1f3d] hover:bg-[#a01830] font-bold text-lg shadow-[0_0_20px_rgba(202,31,61,0.4)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><ShoppingBag className="mr-2" /> PESAN SEKARANG</>}
                    </Button>
                </div>
            </div>
        </div>
      </div>

      {/* SUCCESS MODAL WITH QR CODE */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#151515] border-white/10 text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-center text-2xl font-black text-[#ffbe00]">ORDER CONFIRMED!</DialogTitle>
                <DialogDescription className="text-center text-gray-400">
                    Tunjukkan QR Code ini kepada Admin saat pengambilan jersey.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl mx-auto my-4">
                {successData && (
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 200, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={successData.orderId}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                )}
                <p className="mt-4 font-mono font-bold text-black text-lg tracking-widest">{successData?.orderId}</p>
            </div>
            <div className="text-center">
                <Button onClick={() => setShowSuccess(false)} className="w-full bg-white text-black hover:bg-gray-200 font-bold">Tutup</Button>
                {session ? (
                    <p className="text-xs text-gray-500 mt-4">QR Code ini juga tersimpan di menu Dashboard Member.</p>
                ) : (
                    <p className="text-xs text-red-400 mt-4 font-bold">PENTING: Screenshot layar ini karena Anda memesan sebagai Guest.</p>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
