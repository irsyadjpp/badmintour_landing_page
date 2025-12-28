
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Save, Loader2, Dumbbell, Users } from 'lucide-react';
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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8 pb-20">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3">
                        <CalendarPlus className="w-8 h-8 text-[#ca1f3d]" /> BUAT KEGIATAN BARU
                    </h1>
                    <p className="text-gray-400">Atur jadwal Mabar, Drilling, atau Turnamen.</p>
                </div>

                <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* PILIH TIPE KEGIATAN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Tipe Kegiatan</Label>
                                <Select 
                                    value={formData.type} 
                                    onValueChange={(val) => setFormData({...formData, type: val})}
                                >
                                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="mabar"><span className="flex items-center gap-2"><Users className="w-4 h-4"/> Mabar (Fun Game)</span></SelectItem>
                                        <SelectItem value="drilling"><span className="flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Drilling / Clinic</span></SelectItem>
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
                                        className="bg-[#0a0a0a] border-[#00f2ea]/50 text-white"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Judul Kegiatan</Label>
                            <Input 
                                placeholder="Cth: Drilling Smash & Netting" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                className="bg-[#0a0a0a] border-white/10 text-white font-bold"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal</Label>
                                <Input 
                                    type="date"
                                    value={formData.date} 
                                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white [color-scheme:dark]"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Waktu</Label>
                                <Input 
                                    placeholder="19:00 - 22:00"
                                    value={formData.time} 
                                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Lokasi (GOR)</Label>
                                <Input 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>HTM (Rupiah)</Label>
                                <Input 
                                    type="number"
                                    value={formData.price} 
                                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Kuota Peserta</Label>
                            <Input 
                                type="number"
                                value={formData.quota} 
                                onChange={(e) => setFormData({...formData, quota: e.target.value})} 
                                className="bg-[#0a0a0a] border-white/10 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Deskripsi / Catatan</Label>
                            <Textarea 
                                placeholder="Info tambahan..."
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                className="bg-[#0a0a0a] border-white/10 text-white min-h-[100px]"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl text-lg shadow-lg mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> TERBITKAN JADWAL</>}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
