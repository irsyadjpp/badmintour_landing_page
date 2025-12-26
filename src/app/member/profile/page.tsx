'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Phone, Save, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: ''
    });

    // Load data session ke form saat pertama kali buka
    useEffect(() => {
        if (session?.user) {
            setFormData({
                nickname: session.user.nickname || session.user.name?.split(' ')[0] || '',
                phoneNumber: session.user.phoneNumber || ''
            });
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/member/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Update session di client agar data baru langsung terbaca tanpa logout
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        nickname: formData.nickname,
                        phoneNumber: formData.phoneNumber
                    }
                });

                toast({ title: "Berhasil!", description: "Profil berhasil disimpan & ditautkan." });
                router.refresh();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ 
                title: "Gagal Menyimpan", 
                description: error.message || "Terjadi kesalahan.", 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-20 pt-8 px-6 space-y-8 max-w-xl mx-auto">
            
            <div className="text-center">
                <h1 className="text-3xl font-black text-white">Lengkapi Profil</h1>
                <p className="text-gray-400 text-sm">Tautkan nomor WhatsApp untuk kemudahan notifikasi & login.</p>
            </div>

            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem] shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Avatar Display */}
                    <div className="flex justify-center mb-6">
                        <Avatar className="w-24 h-24 border-4 border-[#1A1A1A] shadow-xl">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-[#ffbe00] text-black font-black text-3xl">
                                {session?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Email (Read Only - Sumber Google) */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Akun Google</Label>
                        <div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/5 opacity-70">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-white font-mono text-sm truncate">{session?.user?.email}</span>
                        </div>
                    </div>

                    {/* Nickname Input */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Panggilan (Nickname)</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input 
                                value={formData.nickname}
                                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                                className="pl-12 bg-[#1A1A1A] border-white/10 h-14 rounded-xl text-white focus:border-[#ffbe00]"
                                placeholder="Cth: Coach Adi"
                            />
                        </div>
                    </div>

                    {/* Phone Number Input (THE PAIRING FIELD) */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest flex items-center gap-2">
                            Nomor WhatsApp {formData.phoneNumber && <ShieldCheck className="w-3 h-3 text-green-500"/>}
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input 
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="pl-12 bg-[#1A1A1A] border-white/10 h-14 rounded-xl text-white focus:border-[#ffbe00] font-mono tracking-wider"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500">
                            *Nomor ini akan terhubung permanen dengan akun Google di atas.
                        </p>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-14 rounded-xl bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-lg shadow-lg mt-4"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 w-5 h-5" /> SIMPAN & PAIRING</>}
                    </Button>

                </form>
            </Card>
        </div>
    );
}
