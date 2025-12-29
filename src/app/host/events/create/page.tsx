'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Save, Loader2, Dumbbell, Users, Trophy, Info, MapPin, Clock, DollarSign, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Material3DatePickerDialogFinal } from '@/components/ui/material-3-date-picker-dialog';
import { Material3TimePicker } from '@/components/ui/material-3-time-picker';
import { Material3Input } from '@/components/ui/material-3-input';
import { Material3Textarea } from '@/components/ui/material-3-textarea';
import {
    Material3Select,
    Material3SelectTrigger,
    Material3SelectValue,
    Material3SelectContent,
    Material3SelectItem
} from '@/components/ui/material-3-select';

export default function CreateEventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // State untuk daftar Coach
    const [coaches, setCoaches] = useState<any[]>([]);

    // State terpisah untuk Date & Time Picker
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        type: 'mabar',
        coachName: '',
        location: '',
        price: '',
        quota: '12',
        description: ''
    });

    // Fetch Data Coach saat component mount
    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const res = await fetch('/api/coaches');
                const data = await res.json();
                if (data.success) {
                    setCoaches(data.data);
                }
            } catch (error) {
                console.error("Gagal load coach", error);
            }
        };
        fetchCoaches();
    }, []);

    // AUTO-SET End Time (Start + 2 Jam)
    useEffect(() => {
        if (startTime) {
            const [h, m] = startTime.split(':').map(Number);
            let nextH = h + 2;
            if (nextH >= 24) nextH -= 24;

            const formattedEnd = `${nextH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            setEndTime(formattedEnd);
        }
    }, [startTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validasi input manual
        if (!selectedDate || !startTime || !endTime) {
            toast({ title: "Data Kurang", description: "Mohon lengkapi tanggal dan waktu kegiatan.", variant: "destructive" });
            setLoading(false);
            return;
        }

        // Clean Price (remove Rp, dots, etc)
        const cleanPrice = formData.price.replace(/\D/g, '');

        // Format Payload
        const finalPayload = {
            ...formData,
            price: cleanPrice, // Send raw number
            // Format Date: YYYY-MM-DD (tanpa timezone mess)
            date: format(selectedDate, 'yyyy-MM-dd'),
            // Format Time: HH:mm - HH:mm
            time: `${startTime} - ${endTime}`
        };

        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });

            if (res.ok) {
                toast({ title: "Sukses", description: "Jadwal berhasil dibuat!", className: "bg-green-600 text-white" });
                router.push('/host/events');
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

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Material3Select
                                        value={formData.type}
                                        onValueChange={(val) => setFormData({ ...formData, type: val, coachName: '' })}
                                    >
                                        <Material3SelectTrigger label="Jenis Event" hasValue={!!formData.type}>
                                            <Material3SelectValue />
                                        </Material3SelectTrigger>
                                        <Material3SelectContent>
                                            <Material3SelectItem value="mabar"><span className="flex items-center gap-2"><Users className="w-4 h-4" /> Mabar (Fun Game)</span></Material3SelectItem>
                                            <Material3SelectItem value="drilling"><span className="flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Drilling / Clinic</span></Material3SelectItem>
                                            <Material3SelectItem value="tournament"><span className="flex items-center gap-2"><Trophy className="w-4 h-4" /> Turnamen</span></Material3SelectItem>
                                        </Material3SelectContent>
                                    </Material3Select>
                                </div>

                                {/* LOGIC DROPDOWN COACH */}
                                {formData.type === 'drilling' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Material3Select
                                            value={formData.coachName}
                                            onValueChange={(val) => setFormData({ ...formData, coachName: val })}
                                        >
                                            <Material3SelectTrigger label="Pilih Coach" hasValue={!!formData.coachName}>
                                                <Material3SelectValue placeholder="Siapa pelatihnya?" />
                                            </Material3SelectTrigger>
                                            <Material3SelectContent>
                                                {coaches.length > 0 ? (
                                                    coaches.map((coach) => (
                                                        <Material3SelectItem key={coach.id} value={coach.name}>
                                                            <span className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-[#00f2ea]" />
                                                                {coach.name}
                                                            </span>
                                                        </Material3SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="p-2 text-xs text-gray-500 text-center">Belum ada data Coach</div>
                                                )}
                                            </Material3SelectContent>
                                        </Material3Select>
                                    </div>
                                )}

                                <Material3Input
                                    label="Judul Kegiatan"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />

                                <Material3Textarea
                                    label="Deskripsi / Catatan"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* KOLOM KANAN: Logistik & Harga */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
                                <MapPin className="w-5 h-5 text-[#ffbe00]" /> Waktu & Lokasi
                            </h3>

                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    {/* Material 3 Date Picker */}
                                    <Material3DatePickerDialogFinal date={selectedDate} setDate={setSelectedDate} />
                                </div>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Material3TimePicker
                                            label="Waktu Mulai"
                                            value={startTime}
                                            onChange={setStartTime}
                                        />
                                        <Material3TimePicker
                                            label="Waktu Selesai"
                                            value={endTime}
                                            onChange={setEndTime}
                                        />
                                    </div>
                                    {startTime && endTime && (
                                        <p className="text-[10px] text-right text-[#ca1f3d] font-bold animate-pulse">
                                            *Pastikan waktu sudah benar!
                                        </p>
                                    )}
                                </div>

                                <Material3Input
                                    label="Lokasi / Lapangan"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Material3Input
                                        label="Harga (IDR)"
                                        type="text"
                                        value={formData.price}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            if (!raw) {
                                                setFormData({ ...formData, price: '' });
                                            } else {
                                                const formatted = new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(Number(raw));
                                                setFormData({ ...formData, price: formatted });
                                            }
                                        }}
                                        required
                                    />
                                    <Material3Input
                                        label="Slot / Kuota"
                                        type="number"
                                        value={formData.quota}
                                        onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-8">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] text-black font-black text-lg h-16 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(202,31,61,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2 text-white">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            MEMPROSES...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            PUBLISH EVENT SEKARANG <ArrowRight className="w-6 h-6" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
}
