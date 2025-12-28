'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Save, Loader2, Dumbbell, Users, Trophy, Info, MapPin, Clock, DollarSign } from 'lucide-react';
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
        type: 'mabar',
        coachName: '',
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
                router.push('/host/events'); // Redirect ke list event
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
        <div className="space-y-6 pb-20 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <CalendarPlus className="w-8 h-8 text-[#ca1f3d]" /> BUAT KEGIATAN BARU
                    </h1>
                    <p className="text-gray-400">Isi detail lengkap untuk mempublikasikan jadwal Mabar, Drilling, atau Turnamen.</p>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    Batal
                </Button>
            </div>

            {/* Form Full Width */}
            <form onSubmit={handleSubmit} className="w-full">
                <Card className="bg-[#151515] border border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl w-full">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* KOLOM KIRI: Informasi Dasar */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                                <Info className="w-5 h-5 text-[#ffbe00]" /> Informasi Utama
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Tipe Kegiatan</Label>
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

                                {formData.type === 'drilling' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
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

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Judul Kegiatan</Label>
                                    <Input 
                                        placeholder="Cth: Mabar Senin Ceria / Drilling Smash" 
                                        value={formData.title} 
                                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl font-bold focus:border-[#ca1f3d] text-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-300">Deskripsi / Catatan</Label>
                                    <Textarea 
                                        placeholder="Info tambahan (level permainan, rules, dll)..."
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white min-h-[150px] rounded-xl focus:border-[#ca1f3d] leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KOLOM KANAN: Logistik & Harga */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                                <MapPin className="w-5 h-5 text-[#ffbe00]" /> Waktu & Lokasi
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Tanggal</Label>
                                    <Input 
                                        type="date"
                                        value={formData.date} 
                                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                        className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl [color-scheme:dark] focus:border-[#ca1f3d]"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-300">Jam Main</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input 
                                            placeholder="19:00 - 22:00"
                                            value={formData.time} 
                                            onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                            className="pl-10 bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Lokasi GOR</Label>
                                <Input 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                    className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                    placeholder="Nama GOR & Nomor Lapangan"
                                    required
                                />
                            </div>

                            <div className="pt-4 border-t border-white/5 mt-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-[#ffbe00]" /> Detail Tiket
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">HTM (Rupiah)</Label>
                                        <Input 
                                            type="number"
                                            value={formData.price} 
                                            onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                            className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d] font-mono font-bold text-lg"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Kuota Slot</Label>
                                        <Input 
                                            type="number"
                                            value={formData.quota} 
                                            onChange={(e) => setFormData({...formData, quota: e.target.value})} 
                                            className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]"
                                            placeholder="12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full md:w-auto px-10 h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl text-lg shadow-[0_0_20px_rgba(202,31,61,0.3)] transition-all hover:scale-[1.02]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> TERBITKAN JADWAL</>}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}
