'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Save, Loader2, Dumbbell, Users, Trophy, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function CreateEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'mabar', // Default Mabar
        coachName: '', // Khusus Drilling
        date: '',
        time: '',
        location: '',
        price: '',
        quota: '12',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast({ title: "Sukses", description: "Jadwal berhasil dibuat!", className: "bg-green-600 text-white" });
                router.push('/host/dashboard');
            } else {
                throw new Error("Gagal membuat event");
            }
        } catch (error) {
            toast({ title: "Error", description: "Terjadi kesalahan sistem.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <CalendarPlus className="w-8 h-8 text-[#ca1f3d]" /> BUAT KEGIATAN BARU
                </h1>
                <p className="text-gray-400">Atur jadwal Mabar, Drilling, atau Turnamen.</p>
            </div>

            {/* Form Section */}
            <div className="max-w-3xl">
                <Card className="bg-[#151515] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* PILIH TIPE KEGIATAN */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <Info className="w-4 h-4" /> Informasi Dasar
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Tipe Kegiatan</Label>
                                    <Select 
                                        value={formData.type} 
                                        onValueChange={(val) => setFormData({...formData, type: val})}
                                    >
                                        <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:ring-[#ca1f3d]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-xl">
                                            <SelectItem value="mabar"><span className="flex items-center gap-2"><Users className="w-4 h-4"/> Mabar (Fun Game)</span></SelectItem>
                                            <SelectItem value="drilling"><span className="flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Drilling / Clinic</span></SelectItem>
                                            <SelectItem value="tournament"><span className="flex items-center gap-2"><Trophy className="w-4 h-4"/> Turnamen</span></SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Input Coach muncul HANYA jika tipe Drilling */}
                                {formData.type === 'drilling' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                                        <Label className="text-[#00f2ea] font-bold">Nama Coach / Pelatih</Label>
                                        <Input 
                                            placeholder="Cth: Coach Budi" 
                                            value={formData.coachName} 
                                            onChange={(e) => setFormData({...formData, coachName: e.target.value})} 
                                            className="bg-[#0a0a0a] border-[#00f2ea]/50 text-white h-12 rounded-xl focus:border-[#00f2ea]"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Judul Kegiatan</Label>
                                <Input 
                                    placeholder="Cth: Drilling Smash & Netting" 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl font-bold focus:border-[#ca1f3d]"
                                    required
                                />
                            </div>
                        </div>

                        {/* JADWAL & LOKASI */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <CalendarPlus className="w-4 h-4" /> Waktu & Tempat
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white">Tanggal</Label>
                                    <Input 
                                        type="date"
                                        value={formData.date} 
                                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl [color-scheme:dark] focus:border-[#ca1f3d]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Waktu</Label>
                                    <Input 
                                        placeholder="19:00 - 22:00"
                                        value={formData.time} 
                                        onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Lokasi (GOR)</Label>
                                <Input 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                    placeholder="Nama GOR & Lapangan"
                                    required
                                />
                            </div>
                        </div>

                        {/* HARGA & KUOTA */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                                <Trophy className="w-4 h-4" /> Detail Tiket
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white">HTM (Rupiah)</Label>
                                    <Input 
                                        type="number"
                                        value={formData.price} 
                                        onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white">Kuota Peserta</Label>
                                    <Input 
                                        type="number"
                                        value={formData.quota} 
                                        onChange={(e) => setFormData({...formData, quota: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                        placeholder="12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-white">Deskripsi / Catatan</Label>
                                <Textarea 
                                    placeholder="Info tambahan untuk peserta..."
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white min-h-[100px] rounded-xl focus:border-[#ca1f3d]"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl text-lg shadow-[0_0_20px_rgba(202,31,61,0.3)] transition-all hover:scale-[1.01]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> TERBITKAN JADWAL</>}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
