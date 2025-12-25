'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react'; 

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession(); // Cek status session
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC REDIRECT BERDASARKAN ROLE ---
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
        const role = session.user.role;
        
        // Mapping Role ke Halaman
        if (role === 'superadmin') {
            router.push('/superadmin/dashboard');
        } else if (role === 'admin') {
            router.push('/admin/dashboard');
        } else if (role === 'host') {
            router.push('/host/dashboard'); // Pastikan halaman host sudah ada
        } else {
            router.push('/member/dashboard'); // Default member
        }
    }
  }, [session, status, router]);

  const handleGoogleLogin = async () => {
      setIsLoading(true);
      // Callback URL dikosongkan agar logika useEffect di atas yang menangani redirect
      // atau set callbackUrl ke '/' agar middleware/session handle sisanya
      await signIn('google', { redirect: false }); 
  };
  
  // ... (Sisa kode PIN Login tetap sama, pastikan handlePinSubmit juga redirect sesuai role) ...
  
  // Bagian Handle PIN submit yg diperbaiki redirectnya:
  const handlePinSubmit = async (fullPin: string) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
        pin: fullPin,
        redirect: false, 
    });

    if (result?.error) {
        toast({
            title: "Login Gagal",
            description: "PIN Salah.",
            variant: "destructive"
        });
        setPin(['', '', '', '', '', '']); 
        setIsLoading(false);
    } else {
        // Berhasil, useEffect di atas akan menangani redirect karena session berubah
        toast({ title: "Welcome Superadmin", className: "bg-[#ffbe00] text-black" });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-submit
    if (index === 5 && value) {
        handlePinSubmit(newPin.join(''));
    }
  };


  // ... (Return JSX Tampilan Login tetap sama) ...
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#121212] relative overflow-hidden font-sans text-white p-4">
        
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/10 mb-6 shadow-2xl group relative overflow-hidden">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                        <Image src="/images/logo.png" alt="BadminTour Logo" fill className="object-contain" priority />
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">BADMINTOUR<span className="text-[#ffbe00]">.</span></h1>
                <p className="text-gray-400 font-medium">Community Hub & Court Booking</p>
            </div>

            {/* Card Login */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>
                
                {/* 1. Metode Google */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Metode Cepat</p>
                    <Button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading || status === 'loading'}
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <Chrome className="w-5 h-5 text-[#ca1f3d]" />
                        {isLoading ? "Memproses..." : "Masuk dengan Google"}
                    </Button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative bg-[#1A1A1A] px-4">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Atau gunakan PIN</span>
                    </div>
                </div>

                {/* 2. Metode PIN */}
                 <div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <KeyRound className="w-4 h-4 text-[#ffbe00]" />
                        <span className="text-xs font-bold text-[#ffbe00] uppercase tracking-wider">Masuk dengan PIN</span>
                    </div>

                    <div className="flex gap-2 justify-center mb-6">
                        {pin.map((digit, i) => (
                            <Input
                                key={i}
                                id={`pin-${i}`}
                                type="password"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handlePinChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                disabled={isLoading}
                                className="w-12 h-14 text-center text-2xl font-black bg-[#121212] border-white/10 rounded-xl focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] text-white transition-all selection:bg-[#ffbe00] selection:text-black"
                            />
                        ))}
                    </div>

                    <Button 
                        onClick={() => handlePinSubmit(pin.join(''))}
                        disabled={isLoading || pin.join('').length < 6}
                        className="w-full h-12 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:bg-[#ca1f3d] shadow-[0_0_20px_rgba(202,31,61,0.3)] hover:shadow-[0_0_30px_rgba(202,31,61,0.5)]"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Memproses...</span>
                        ) : (
                            <>
                                Masuk Aplikasi <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>

            </div>
            <p className="text-center text-[10px] font-bold text-gray-600 mt-8 uppercase tracking-widest">&copy; {new Date().getFullYear()} BadminTour</p>
        </div>
    </main>
  );
}
