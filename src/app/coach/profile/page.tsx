'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Phone, Save, Loader2, ShieldCheck, Award, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
                toast({ title: "Profile Updated", description: "Data berhasil disimpan.", className: "bg-green-600 text-white border-none" });
            } else { throw new Error(data.error); }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally { setIsLoading(false); }
    };

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <User className="w-8 h-8 text-[#00f2ea]" /> COACH PROFILE
                </h1>
                <p className="text-gray-400">Atur informasi publik Anda.</p>
            </div>

            <Card className="bg-[#151515] border-white/10 p-8 rounded-[2rem]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar className="w-24 h-24 border-4 border-[#00f2ea]">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Linked Google Account</p>
                            <div className="flex items-center gap-2 text-white font-mono bg-black/30 px-3 py-1 rounded-lg border border-white/5 mt-1">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                {session?.user?.email}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Nama Lengkap</Label>
                            {/* INPUT FIX: Dark BG, White Text */}
                            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-[#0a0a0a] border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#00f2ea] font-bold flex items-center gap-2">WhatsApp (Pairing Key) <Phone className="w-4 h-4"/></Label>
                            <Input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} className="bg-[#0a0a0a] border-[#00f2ea]/50 text-white font-mono" placeholder="08xxxxxxxxxx" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Spesialisasi</Label>
                            <div className="relative">
                                <Award className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <Input value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="pl-10 bg-[#0a0a0a] border-white/10 text-white" placeholder="Ex: Ganda Putra" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-300">Rate Per Jam (Rp)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                <Input type="number" value={formData.rate} onChange={(e) => setFormData({...formData, rate: e.target.value})} className="pl-10 bg-[#0a0a0a] border-white/10 text-white" placeholder="150000" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">Bio / Pengalaman</Label>
                        <Textarea 
                            value={formData.bio} 
                            onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                            className="bg-[#0a0a0a] border-white/10 text-white min-h-[100px]" 
                            placeholder="Ceritakan pengalaman melatih atau prestasi Anda..." 
                        />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full bg-[#00f2ea] text-black font-bold h-12 hover:bg-[#00c2bb] rounded-xl shadow-[0_0_20px_rgba(0,242,234,0.2)]">
                        {isLoading ? <Loader2 className="animate-spin"/> : "SIMPAN PERUBAHAN"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
