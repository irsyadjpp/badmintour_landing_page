'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, Save, Loader2, ShieldCheck, Award, DollarSign, UserCog, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Material3Input } from '@/components/ui/material-3-input';
import { Material3Textarea } from '@/components/ui/material-3-textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export default function CoachProfilePage() {
    const { data: session, update } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        specialty: '',
        rate: '',
        bio: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.data) {
                setFormData({
                    name: data.data.name || session?.user?.name || '',
                    phoneNumber: data.data.phoneNumber || '',
                    specialty: data.data.coachProfile?.specialty || '',
                    rate: data.data.coachProfile?.rate || '',
                    bio: data.data.coachProfile?.bio || '',
                });
            }
        };
        if (session) fetchProfile();
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
                await update();
                toast({ title: "Profile Updated", description: "Data berhasil disimpan.", className: "bg-[#00f2ea] text-black border-none font-bold" });
            } else { throw new Error(data.error); }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ca1f3d]/10 flex items-center justify-center border border-[#ca1f3d]/20">
                        <UserCog className="w-8 h-8 text-[#ca1f3d]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            COACH <span className="text-[#ffbe00]">PROFILE</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Atur informasi publik, spesialisasi, dan tarif Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                {/* LEFT COLUMN: IDENTITY CARD */}
                <Card className="md:col-span-1 bg-[#151515] border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center h-fit relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative mb-6 mt-4">
                        <div className="absolute -inset-4 bg-[#ca1f3d]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Avatar className="w-32 h-32 border-4 border-[#1A1A1A] shadow-2xl relative z-10">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-[#ca1f3d] text-white font-black text-4xl">
                                {session?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 z-20 bg-[#ffbe00] border-4 border-[#151515] p-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4 text-black" />
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-white">{session?.user?.name}</h2>
                    <p className="text-gray-500 text-sm font-mono mb-6">{session?.user?.email}</p>

                    <div className="w-full space-y-3">
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                            <span className="text-xs text-gray-500 uppercase font-bold">Role</span>
                            <span className="text-xs text-[#ffbe00] font-bold uppercase tracking-wider">OFFICIAL COACH</span>
                        </div>
                        {formData.specialty && (
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs text-gray-500 uppercase font-bold">Specialty</span>
                                <span className="text-xs text-white font-mono text-right max-w-[150px] truncate">{formData.specialty}</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* RIGHT COLUMN: FORM */}
                <Card className="md:col-span-2 bg-[#151515] border-white/10 p-8 rounded-[2rem] relative shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-8 bg-[#ffbe00] rounded-full"></div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">Coach Data</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Material3Input
                                label="Nama Lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-[#0a0a0a]"
                            />
                            <Material3Input
                                label="WhatsApp (Pairing Key)"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="bg-[#0a0a0a]"
                                type="tel"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Material3Input
                                label="Spesialisasi"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                className="bg-[#0a0a0a]"
                                placeholder="Ex: Ganda Putra / Teknik Dasar"
                            />
                            <Material3Input
                                label="Rate Per Jam (Rp)"
                                value={formData.rate}
                                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                className="bg-[#0a0a0a]"
                                type="number"
                                placeholder="150000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Material3Textarea
                                label="Bio / Pengalaman Melatih"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="bg-[#0a0a0a] min-h-[120px]"
                                placeholder="Ceritakan pengalaman melatih atau prestasi Anda..."
                            />
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto h-12 px-8 rounded-xl bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black text-base shadow-[0_0_20px_rgba(202,31,61,0.3)] transition-all hover:scale-[1.02]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 w-4 h-4" /> SIMPAN PERUBAHAN</>}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
