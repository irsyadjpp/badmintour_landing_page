'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserCog, Save, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Material3Input } from '@/components/ui/material-3-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function AdminProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
    });

    // 1. Fetch Data directly from DB
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                const json = await res.json();

                if (json.success && json.data) {
                    setFormData({
                        name: json.data.name || session?.user?.name || '',
                        phoneNumber: json.data.phoneNumber || '',
                    });
                } else {
                    setFormData({
                        name: session?.user?.name || '',
                        phoneNumber: '',
                    });
                }
            } catch (err) {
                console.error("Failed to fetch profile");
            } finally {
                setIsLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                    }
                });

                toast({ title: "Berhasil!", description: data.message || "Profil Admin berhasil disimpan." });
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

    if (!session) return null;

    return (
        <div className="space-y-8 pb-20">

            {/* STANDARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20">
                        <UserCog className="w-8 h-8 text-[#ffbe00]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            ADMIN <span className="text-[#ffbe00]">PROFILE</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Kelola data operasional dan kontak darurat admin.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                {/* LEFT COLUMN: IDENTITY CARD */}
                <Card className="md:col-span-1 bg-[#151515] border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center h-fit relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative mb-6 mt-4">
                        <div className="absolute -inset-4 bg-[#ffbe00]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Avatar className="w-32 h-32 border-4 border-[#1A1A1A] shadow-2xl relative z-10">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-[#ffbe00] text-black font-black text-4xl">
                                {session?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 z-20 bg-[#ca1f3d] border-4 border-[#151515] p-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-white">{session?.user?.name}</h2>
                    <p className="text-gray-500 text-sm font-mono mb-6">{session?.user?.email}</p>

                    <div className="w-full space-y-3">
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                            <span className="text-xs text-gray-500 uppercase font-bold">Role</span>
                            <span className="text-xs text-[#ffbe00] font-bold uppercase tracking-wider">Administrator</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                            <span className="text-xs text-gray-500 uppercase font-bold">Access Level</span>
                            <span className="text-xs text-white font-mono">Full Access</span>
                        </div>
                    </div>
                </Card>

                {/* RIGHT COLUMN: FORM */}
                <Card className="md:col-span-2 bg-[#151515] border-white/10 p-8 rounded-[2rem] relative shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-8 bg-[#ffbe00] rounded-full"></div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">Operational Data</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Material3Input
                                label="Admin Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-[#0a0a0a]"
                            />

                            <div className="relative">
                                <Material3Input
                                    label="Emergency WhatsApp (Pairing)"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="bg-[#0a0a0a] font-mono"
                                />
                                <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-[#ffbe00]" /> Nomor ini digunakan untuk verifikasi login darurat & pairing system.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto h-12 px-8 rounded-xl bg-[#ffbe00] hover:bg-[#e6ac00] text-black font-black text-base shadow-[0_0_20px_rgba(255,190,0,0.3)] transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 w-4 h-4" /> UPDATE PROFILE</>}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
