'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, Save, Loader2, ShieldCheck, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { cn, isValidIndonesianPhoneNumber, formatIndonesianPhoneNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { UserPinCard } from '@/components/profile/user-pin-card';
import { StatusModal } from '@/components/ui/status-modal';

export default function HostProfilePage() {
    const { data: session, update } = useSession();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        phoneNumber: '',
        domicile: ''
    });
    const [pin, setPin] = useState<string>('');
    const [isPhoneLocked, setIsPhoneLocked] = useState(false);
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

    // Fetch Data Saat Load
    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (data.success && data.data) {
                setFormData({
                    name: data.data.name || session?.user?.name || '',
                    nickname: data.data.nickname || '',
                    phoneNumber: data.data.phoneNumber || '',
                    domicile: data.data.domicile || ''
                });
                setPin(data.data.pin || '');
                if (data.data.phoneNumber) setIsPhoneLocked(true);
            }
        };
        if (session) fetchProfile();
    }, [session]);

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
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                await update({ ...session, user: { ...session?.user, ...formData } });
                // toast({ title: "Akun Tertaut!", description: data.message, className: "bg-green-600 text-white border-none" });
                setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'HOST ACCOUNT SAVED!',
                    description: "Data host dan akun Google berhasil ditautkan dan disimpan.",
                    actionLabel: "DASHBOARD HOST"
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'DOUBLE FAULT!',
                description: error.message || "Gagal menyimpan data host.",
                actionLabel: "ULANGI"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#7c3aed]/10 flex items-center justify-center border border-[#7c3aed]/20">
                        <MapPin className="w-8 h-8 text-[#7c3aed]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            HOST <span className="text-[#7c3aed]">PROFILE</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Kelola identitas penyelenggara turnamen Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">

                {/* LEFT COLUMN: IDENTITY & PIN */}
                <div className="space-y-8 lg:col-span-1">
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center h-fit relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7c3aed] via-[#ca1f3d] to-[#7c3aed] opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative mb-6 mt-4">
                            <Avatar className="w-32 h-32 border-4 border-[#1A1A1A] shadow-2xl relative z-10">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-[#7c3aed] text-white font-black text-4xl">
                                    {session?.user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 z-20 bg-green-500 border-4 border-[#151515] p-1.5 rounded-full">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-white">{session?.user?.name}</h2>
                        <p className="text-gray-500 text-sm font-mono mb-4">{session?.user?.email}</p>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs text-gray-500 uppercase font-bold">Role</span>
                                <span className="text-xs text-[#7c3aed] font-bold uppercase tracking-wider">EVENT HOST</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs text-gray-500 uppercase font-bold">Domisili</span>
                                <span className="text-xs text-white font-mono">{formData.domicile || "Madiun"}</span>
                            </div>
                        </div>
                    </Card>

                    <UserPinCard pin={pin} />
                </div>

                {/* RIGHT COLUMN: FORM */}
                <Card className="lg:col-span-2 bg-[#151515] border-white/10 p-8 rounded-[2rem]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-8 bg-[#7c3aed] rounded-full"></div>
                            <h3 className="text-xl font-black text-white uppercase tracking-wide">Host Data</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-[#0a0a0a] border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Panggilan (Nickname)</Label>
                                <Input value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="bg-[#0a0a0a] border-white/10 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#7c3aed] font-bold flex items-center gap-2">Nomor WhatsApp (Pairing Key) <Phone className="w-4 h-4" /></Label>
                            <Input
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                                onBlur={() => {
                                    if (formData.phoneNumber) {
                                        setFormData(prev => ({ ...prev, phoneNumber: formatIndonesianPhoneNumber(prev.phoneNumber) }));
                                    }
                                }}
                                className="bg-[#0a0a0a] border-[#7c3aed]/50 text-white h-12 font-mono"
                                placeholder="08xxxxxxxxxx"
                                disabled={isPhoneLocked}
                            />
                            <p className="text-[10px] text-gray-500">*
                                {isPhoneLocked ? "Nomor telah tertaut. Hubungi admin untuk mengganti." : "Nomor ini akan menjadi kunci akses login alternatif & notifikasi host."}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Domisili / Basecamp</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <Input value={formData.domicile} onChange={(e) => setFormData({ ...formData, domicile: e.target.value })} className="bg-[#0a0a0a] border-white/10 text-white pl-10" placeholder="Kota Bandung" />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full bg-[#7c3aed] text-white font-bold h-12 hover:bg-[#6d28d9]">
                            {isLoading ? <Loader2 className="animate-spin" /> : "SIMPAN & TAUTKAN AKUN"}
                        </Button>
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
