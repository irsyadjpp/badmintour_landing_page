
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Chrome, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

// Komponen Content terpisah agar bisa dibungkus Suspense (wajib untuk useSearchParams di Next 14+)
function LoginContent() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();

    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // 1. AUTO REDIRECT (Updated Logic)
    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            const userStatus = (session.user as any).status;

            if (userStatus === 'inactive') {
                setErrorMsg("Akun Anda dinonaktifkan. Silakan hubungi admin.");
                return;
            }

            // Redirect sesuai role
            const role = session.user.role;
            if (role === 'superadmin') router.push('/superadmin/dashboard');
            else if (role === 'admin') router.push('/admin/dashboard');
            else if (role === 'host') router.push('/host/dashboard');
            else if (role === 'coach') router.push('/coach/dashboard'); // PERBAIKAN DI SINI
            else router.push('/member/dashboard');
        }
    }, [status, session, router]);

    // 2. ERROR HANDLING (Dari Redirect NextAuth)
    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'AccountInactive') {
            setErrorMsg("Akun Anda sedang ditangguhkan atau belum aktif. Hubungi Admin untuk aktivasi.");
        } else if (error === 'AccessDenied') {
            setErrorMsg("Akses ditolak.");
        }
    }, [searchParams]);

    // --- HANDLERS ---
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setErrorMsg('');
        // redirect: false agar kita bisa handle error state manual jika perlu, 
        // tapi untuk google biasanya flow redirect otomatis.
        // callbackUrl diset agar setelah login google sukses, dia balik ke halaman ini dulu 
        // untuk diproses oleh useEffect Auto Redirect di atas.
        await signIn('google', { callbackUrl: '/login' });
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!pin[index] && index > 0) {
                // Pin kosong, pindah ke sebelumnya
                const prev = document.getElementById(`pin-${index - 1}`);
                prev?.focus();
            } else if (pin[index]) {
                // Pin ada isinya, hapus tapi jangan pindah dulu (biar user lihat apa yang dihapus)
                // Default behavior backspace sudah menghapus value di input, 
                // tapi kita perlu sync state.
            }
        }
    };

    const handlePinChange = (index: number, value: string) => {
        // Validasi angka only
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`pin-${index + 1}`)?.focus();
        }

        // Auto submit if last digit filled
        if (index === 5 && value) {
            handlePinSubmit(newPin.join(''));
        }
    };

    const handlePinSubmit = async (fullPin: string) => {
        setIsLoading(true);
        const result = await signIn('credentials', {
            pin: fullPin,
            redirect: false,
        });

        if (result?.error) {
            toast({ title: "Login Gagal", description: "PIN Salah.", variant: "destructive" });
            setPin(['', '', '', '', '', '']);
            document.getElementById(`pin-0`)?.focus();
            setIsLoading(false);
        } else {
            // Berhasil, useEffect akan menangani redirect
        }
    };

    // Jika sedang mengecek session (loading), tampilkan splash screen sederhana
    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#121212]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#ffbe00] rounded-full mb-4"></div>
                    <p className="text-[#ffbe00] font-bold text-sm tracking-widest">MEMUAT...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/10 mb-6 shadow-2xl group relative overflow-hidden">
                    {/* UPDATE: Menggunakan logo-light.png */}
                    <Image src="/images/logo-light.png" alt="Logo" fill className="object-contain p-2" priority />
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">BADMINTOUR<span className="text-[#ffbe00]">.</span></h1>
                <p className="text-gray-400 font-medium">Mabar, Drilling & Tournament Community</p>
            </div>

            {/* ERROR ALERT */}
            {errorMsg && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-red-500 font-bold text-sm">Login Gagal</h4>
                        <p className="text-red-400 text-xs mt-1 leading-relaxed">{errorMsg}</p>

                        {/* Tombol Bantuan Aktivasi (Mockup WA) */}
                        <Button variant="link" className="p-0 h-auto text-[#ffbe00] text-xs mt-2">
                            Hubungi Admin via WhatsApp &rarr;
                        </Button>
                    </div>
                </div>
            )}

            {/* Login Card */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]"></div>

                {/* Google Login */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Metode Cepat</p>
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
                    >
                        <Chrome className="w-5 h-5 text-[#ca1f3d]" />
                        {isLoading ? "Memproses..." : "Masuk dengan Google"}
                    </Button>
                </div>

                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative bg-[#1A1A1A] px-4"><span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Atau gunakan PIN</span></div>
                </div>

                {/* PIN Input */}
                <div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <KeyRound className="w-4 h-4 text-[#ffbe00]" />
                        <span className="text-xs font-bold text-[#ffbe00] uppercase tracking-wider">Superadmin Access</span>
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
                                className="w-12 h-14 text-center text-2xl font-black bg-[#121212] border-white/10 rounded-xl focus:border-[#ffbe00] focus:ring-1 focus:ring-[#ffbe00] text-white"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] font-bold text-gray-600 mt-8 uppercase tracking-widest">&copy; {new Date().getFullYear()} BadminTour</p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#121212] relative overflow-hidden font-sans text-white p-4">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Suspense fallback={<div>Loading...</div>}>
                <LoginContent />
            </Suspense>
        </main>
    );
}
