'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, Save, Loader2, ShieldCheck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

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
                await update({ ...session, user: { ...session?.user, ...formData } });
                toast({ title: "Akun Tertaut!", description: data.message, className: "bg-green-600 text-white border-none" });
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white">Host Profile</h1>
                <p className="text-gray-400">Lengkapi data untuk verifikasi penyelenggara event.</p>
            </div>

            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar className="w-20 h-20 border-2 border-[#ffbe00]">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback>H</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Google Account</p>
                            <div className="flex items-center gap-2 text-white font-mono bg-black/30 px-3 py-1 rounded-lg border border-white/5 mt-1">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                {session?.user?.email}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label>Panggilan (Nickname)</Label>
                            <Input value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#ffbe00] font-bold flex items-center gap-2">Nomor WhatsApp (Pairing Key) <Phone className="w-4 h-4"/></Label>
                        <Input 
                            value={formData.phoneNumber} 
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                            className="bg-[#1A1A1A] border-[#ffbe00]/50 text-white h-12 font-mono" 
                            placeholder="08xxxxxxxxxx"
                        />
                        <p className="text-[10px] text-gray-500">*Nomor ini akan menjadi kunci akses login alternatif & notifikasi host.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Domisili / Basecamp</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <Input value={formData.domicile} onChange={(e) => setFormData({...formData, domicile: e.target.value})} className="bg-[#1A1A1A] border-white/10 text-white pl-10" placeholder="Kota Bandung" />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-[#ffbe00] text-black font-bold h-12 hover:bg-yellow-400">
                        {isLoading ? <Loader2 className="animate-spin"/> : "SIMPAN & TAUTKAN AKUN"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
