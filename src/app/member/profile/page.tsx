'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Phone, Save, Loader2, ShieldCheck, Copy, MapPin, UserCog, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, isValidIndonesianPhoneNumber, formatIndonesianPhoneNumber } from '@/lib/utils';
import { Material3Input } from '@/components/ui/material-3-input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { UserPinCard } from '@/components/profile/user-pin-card';
import { StatusModal } from '@/components/ui/status-modal';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true); // Default loading true while fetching DB
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        phoneNumber: '',
        domicile: ''
    });
    const [pin, setPin] = useState<string>('');
    const [memberSince, setMemberSince] = useState<string>('2024');
    const [isPhoneLocked, setIsPhoneLocked] = useState(false);

    // Status Modal State
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        description: string;
        actionLabel?: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        description: ''
    });

    // 1. Fetch Data directly from DB (latest source of truth)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                const json = await res.json();

                if (json.success && json.data) {
                    setFormData({
                        name: json.data.name || session?.user?.name || '',
                        nickname: json.data.nickname || '',
                        phoneNumber: json.data.phoneNumber || '',
                        domicile: json.data.domicile || ''
                    });
                    setPin(json.data.pin || '');
                    if (json.data.phoneNumber) {
                        setIsPhoneLocked(true);
                    }

                    // Parse createdAt for Member Since
                    if (json.data.createdAt) {
                        const date = new Date(json.data.createdAt);
                        if (!isNaN(date.getTime())) {
                            setMemberSince(date.getFullYear().toString());
                        }
                    }
                } else {
                    // Fallback to session if new user
                    setFormData({
                        name: session?.user?.name || '',
                        nickname: (session?.user as any)?.nickname || '',
                        phoneNumber: (session?.user as any)?.phoneNumber || '',
                        domicile: ''
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

    // SYNC GOOGLE LOGIC
    const handleSyncGoogle = async () => {
        if (!session?.user) return;
        setIsLoading(true);

        try {
            // Update local state first
            setFormData(prev => ({
                ...prev,
                name: session.user?.name || prev.name,
                // Email is read-only from session usually, but we sync name/image
            }));

            // Force update to backend
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    name: session.user?.name,
                    image: session.user?.image,
                    // keep other fields as is
                })
            });

            if (res.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: session.user?.name,
                        image: session.user?.image
                    }
                });
                toast({ title: "Synced!", description: "Data profile disinkronisasi dengan Google.", className: "bg-blue-600 text-white" });
                router.refresh();

                // Show Success Modal
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'SYNCHRONIZED!',
                    description: 'Data profil disamakan dengan sesi login. Jika baru saja mengubah data di Google, silakan Logout & Login kembali.',
                    actionLabel: "OK, MENGERTI"
                });
            }
        } catch (e) {
            // Show Error Modal
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'SYNC FAILED!',
                description: 'Gagal menghubungkan ke Google. Silakan coba lagi nanti.',
                actionLabel: "COBA LAGI"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDATION: Phone Number
        if (formData.phoneNumber && !isValidIndonesianPhoneNumber(formData.phoneNumber)) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'INVALID PHONE NUMBER',
                description: 'Mohon masukkan nomor WhatsApp yang valid (Format: 08xx atau 628xx, 10-14 digit).',
                actionLabel: "PERBAIKI"
            });
            return;
        }

        setIsLoading(true);

        try {
            // Use the robust /api/profile endpoint (handles pairing & syncing)
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Update session client-side
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                        nickname: formData.nickname,
                        phoneNumber: formData.phoneNumber
                    }
                });

                // toast({ title: "Berhasil!", description: data.message || "Profil berhasil disimpan." });
                router.refresh();

                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'PROFILE SAVED!',
                    description: data.message || "Data profil Anda berhasil diperbarui.",
                    actionLabel: "KEMBALI KE PROFILE"
                });

            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'DOUBLE FAULT!',
                description: error.message || "Terjadi kesalahan saat menyimpan data.",
                actionLabel: "COBA LAGI"
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ca1f3d]/10 flex items-center justify-center border border-[#ca1f3d]/20">
                        <UserCog className="w-8 h-8 text-[#ca1f3d]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            MY <span className="text-[#ffbe00]">PROFILE</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Kelola data diri untuk sertifikat dan booking.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
                {/* LEFT COLUMN: IDENTITY & PIN */}
                <div className="space-y-8 lg:col-span-1">
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center h-fit relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative mb-6 mt-4">
                            <div className="absolute -inset-4 bg-[#ffbe00]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Avatar className="w-32 h-32 border-4 border-[#1A1A1A] shadow-2xl relative z-10">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-[#ffbe00] text-black font-black text-4xl">
                                    {session?.user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 z-20 bg-green-500 border-4 border-[#151515] p-1.5 rounded-full">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-white">{session?.user?.name}</h2>
                        <p className="text-gray-500 text-sm font-mono mb-4">{session?.user?.email}</p>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSyncGoogle}
                            className="mb-6 h-8 text-[10px] font-bold border-white/10 hover:bg-white/10 text-gray-400 hover:text-white rounded-full bg-white/5"
                        >
                            <RefreshCw className="w-3 h-3 mr-2" />
                            SYNC GOOGLE DATA
                        </Button>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs text-gray-500 uppercase font-bold">Member Since</span>
                                <span className="text-xs text-white font-mono">{memberSince}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs text-gray-500 uppercase font-bold">Status</span>
                                <span className="text-xs text-[#ffbe00] font-bold uppercase tracking-wider">Active Athlete</span>
                            </div>
                        </div>
                    </Card>

                    {/* PIN CARD is now stacked below Identity Card */}
                    <UserPinCard pin={pin} />
                </div>

                {/* RIGHT COLUMN: FORM (Takes 2/3 width) */}
                <Card className="lg:col-span-2 bg-[#151515] border-white/10 p-8 rounded-[2rem] relative shadow-2xl h-fit">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-8 bg-[#ffbe00] rounded-full"></div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">Personal Data</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Material3Input
                                label="Nama Lengkap"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-[#0a0a0a]"
                            />
                            <Material3Input
                                label="Nickname (Panggilan)"
                                value={formData.nickname}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                className="bg-[#0a0a0a]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Material3Input
                                label="Domisili (Kota)"
                                value={formData.domicile}
                                onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                                className="bg-[#0a0a0a]"
                            />
                            <div className="relative">
                                <Material3Input
                                    label="WhatsApp (Aktif)"
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, phoneNumber: val });
                                    }}
                                    onBlur={() => {
                                        if (formData.phoneNumber) {
                                            setFormData(prev => ({ ...prev, phoneNumber: formatIndonesianPhoneNumber(prev.phoneNumber) }));
                                        }
                                    }}
                                    className="bg-[#0a0a0a] font-mono"
                                    disabled={isPhoneLocked}
                                />
                                <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                                    <ShieldCheck className={`w-3 h-3 ${isPhoneLocked ? "text-gray-500" : "text-green-500"}`} />
                                    {isPhoneLocked ? "Nomor terverifikasi. Hubungi admin untuk mengubah." : "Terhubung aman dengan akun Google."}
                                </p>
                            </div>
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

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                description={statusModal.description}
                actionLabel={statusModal.actionLabel}
            />
        </div>
    );
}
