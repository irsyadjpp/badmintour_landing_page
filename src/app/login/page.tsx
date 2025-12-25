'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, Chrome } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State untuk Input PIN
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIC 1: PIN LOGIN (SUPERADMIN) ---
  const handlePinChange = (index: number, value: string) => {
    // Hanya terima angka
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
    // Handle backspace untuk pindah ke kotak sebelumnya
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePinSubmit = async (fullPin: string) => {
    setIsLoading(true);
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (fullPin === '113125') {
        // SUKSES: Login sebagai Superadmin
        toast({
            title: "Access Granted",
            description: "Welcome back, Superadmin!",
            className: "bg-bad-green text-black font-bold border-none"
        });
        
        // Simpan session (mock) dan redirect
        localStorage.setItem('userRole', 'superadmin');
        router.push('/admin/dashboard');
    } else {
        // GAGAL
        toast({
            title: "Access Denied",
            description: "PIN salah. Akses ditolak.",
            variant: "destructive"
        });
        setPin(['', '', '', '', '', '']); // Reset PIN
        document.getElementById('pin-0')?.focus(); // Fokus balik ke awal
    }
    
    setIsLoading(false);
  };

  // --- LOGIC 2: GOOGLE LOGIN (MEMBER) ---
  const handleGoogleLogin = () => {
      setIsLoading(true);
      
      // Simulasi proses login Google
      setTimeout(() => {
          toast({
              title: "Login Berhasil",
              description: "Masuk sebagai Member.",
          });
          
          // Default role: Member
          localStorage.setItem('userRole', 'member');
          
          // Redirect ke halaman member (atau bisa conditional)
          router.push('/member/dashboard'); // Asumsi ada dashboard member
          setIsLoading(false);
      }, 1500);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#121212] relative overflow-hidden font-sans text-white p-4">
        
        {/* Background Decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-bad-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-bad-yellow/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/10 mb-6 shadow-2xl">
                    <span className="text-4xl">🏸</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">Welcome Back</h1>
                <p className="text-gray-400 font-medium">Masuk untuk kelola jadwal atau akses admin.</p>
            </div>

            {/* Card Login */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm">
                
                {/* 1. Metode Google (Member) */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Member Access</p>
                    <Button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                    >
                        <Chrome className="w-5 h-5" />
                        Masuk dengan Google
                    </Button>
                </div>

                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative bg-[#1A1A1A] px-4">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Admin Area</span>
                    </div>
                </div>

                {/* 2. Metode PIN (Superadmin) */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <ShieldCheck className="w-4 h-4 text-bad-yellow" />
                        <span className="text-xs font-bold text-bad-yellow uppercase tracking-wider">Superadmin PIN</span>
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
                                className="w-12 h-14 text-center text-2xl font-black bg-[#121212] border-white/10 rounded-xl focus:border-bad-yellow focus:ring-1 focus:ring-bad-yellow text-white transition-all"
                            />
                        ))}
                    </div>

                    <Button 
                        onClick={() => handlePinSubmit(pin.join(''))}
                        disabled={isLoading || pin.join('').length < 6}
                        className="w-full h-12 bg-[#121212] border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Verifying...</span>
                        ) : (
                            <>
                                Access Dashboard <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>

            </div>

            <p className="text-center text-xs font-bold text-gray-600 mt-8">
                &copy; 2025 BadminTour System. Secure Access.
            </p>
        </div>
    </main>
  );
}
