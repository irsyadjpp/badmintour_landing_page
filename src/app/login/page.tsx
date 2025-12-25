'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowRight, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State untuk Input PIN
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC: PIN LOGIN (Generic Interface) ---
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus ke kotak berikutnya
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-submit jika sudah 6 digit
    if (index === 5 && value) {
      handlePinSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePinSubmit = async (fullPin: string) => {
    setIsLoading(true);
    
    // Simulasi delay validasi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cek PIN (Logic Backend Mock)
    // 113125 = Superadmin
    if (fullPin === '113125') {
        toast({
            title: "Access Granted",
            description: "Welcome back, Superadmin.",
            className: "bg-[#ffbe00] text-black font-bold border-none"
        });
        localStorage.setItem('userRole', 'superadmin');
        router.push('/admin/dashboard');
    } else {
        // Untuk saat ini PIN lain dianggap invalid
        // Di masa depan, logic ini bisa diganti untuk cek database User Member
        toast({
            title: "Login Gagal",
            description: "PIN tidak ditemukan atau salah.",
            variant: "destructive"
        });
        setPin(['', '', '', '', '', '']); 
        document.getElementById('pin-0')?.focus();
    }
    
    setIsLoading(false);
  };

  // --- LOGIC: GOOGLE LOGIN (Standard Member) ---
  const handleGoogleLogin = () => {
      setIsLoading(true);
      
      setTimeout(() => {
          toast({
              title: "Login Berhasil",
              description: "Selamat datang, Member!",
              className: "bg-[#ca1f3d] text-white font-bold border-none"
          });
          
          localStorage.setItem('userRole', 'member');
          router.push('/member/dashboard'); // Redirect ke dashboard member
          setIsLoading(false);
      }, 1500);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#121212] relative overflow-hidden font-sans text-white p-4">
        
        {/* Background Decoration dengan Warna Baru */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/10 mb-6 shadow-2xl group">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🏸</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">BADMINTOUR<span className="text-[#ffbe00]">.</span></h1>
                <p className="text-gray-400 font-medium">Community Hub & Court Booking</p>
            </div>

            {/* Card Login */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Aksen Garis Atas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>
                
                {/* 1. Metode Google */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Metode Cepat</p>
                    <Button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <Chrome className="w-5 h-5 text-[#ca1f3d]" />
                        Masuk dengan Google
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

                {/* 2. Metode PIN (Generic UI) */}
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

            <p className="text-center text-[10px] font-bold text-gray-600 mt-8 uppercase tracking-widest">
                &copy; 2025 The Software Practice
            </p>
        </div>
    </main>
  );
}
