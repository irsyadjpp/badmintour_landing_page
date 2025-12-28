'use client';

import { useState } from 'react';
import { QrCode, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function HostCheckInPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [manualToken, setManualToken] = useState('');
    const [step, setStep] = useState<'scan' | 'success'>('scan');

    const handleCheckIn = async () => {
        setLoading(true);

        // Simulasi Ambil Lokasi (Geolocation)
        let coords = null;
        if ("geolocation" in navigator) {
            try {
                const pos: any = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            } catch (e) {
                console.log("Location denied");
            }
        }

        try {
            // Kirim Token (Manual Input atau Hardcode QR Value jika pakai scanner library)
            // Di sini kita pakai manualToken dari input
            const res = await fetch('/api/host/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    qrToken: manualToken, 
                    eventId: "JADWAL-HARI-INI", // Logic realnya ambil dari jadwal hari ini
                    coordinates: coords 
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStep('success');
                toast({ title: "Check-In Berhasil", description: "Absensi Anda telah tercatat.", className: "bg-green-600 text-white" });
                setTimeout(() => router.push('/host/dashboard'), 2000);
            } else {
                throw new Error(data.error);
            }
        } catch (e: any) {
            toast({ title: "Gagal", description: e.message || "QR Code Salah", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-600 p-6">
                <div className="text-center text-white animate-in zoom-in">
                    <CheckCircle className="w-24 h-24 mx-auto mb-6" />
                    <h1 className="text-4xl font-black mb-2">YOU ARE IN!</h1>
                    <p className="text-lg opacity-90">Selamat bertugas, Host!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ca1f3d]/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-black mb-2">HOST CHECK-IN</h1>
                    <p className="text-gray-400">Scan QR Code yang ada di meja admin GOR untuk konfirmasi kehadiran.</p>
                </div>

                <Card className="bg-[#151515] border-white/10 p-8 rounded-[2.5rem] text-center space-y-6 shadow-2xl">
                    
                    {/* Visual QR Scanner (Mockup) */}
                    <div className="relative w-48 h-48 mx-auto bg-black rounded-3xl border-4 border-[#ca1f3d] flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ca1f3d]/50 to-transparent w-full h-full animate-[scan_2s_ease-in-out_infinite]"></div>
                        <QrCode className="w-20 h-20 text-white opacity-50" />
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                            <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Masukkan Token (Jika Scanner Error)</label>
                            <Input 
                                placeholder="Cth: GOR-WARTAWAN-2025" 
                                className="text-center bg-transparent border-none text-white font-mono font-bold text-lg focus:ring-0"
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                            />
                        </div>

                        <Button 
                            onClick={handleCheckIn}
                            disabled={loading || !manualToken}
                            className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl text-lg shadow-[0_0_20px_rgba(202,31,61,0.4)]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "VERIFIKASI KEHADIRAN"}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                            <MapPin className="w-3 h-3" />
                            <span>Lokasi Anda akan dicatat.</span>
                        </div>
                    </div>
                </Card>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </div>
    );
}
