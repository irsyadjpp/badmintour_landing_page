'use client';

import { useState, useEffect } from 'react';
import { Save, Clock, CalendarDays, Loader2, Plus, Trash2, Settings, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CoachSchedulePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    // State Jadwal Mingguan
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({ day, active: false, start: '09:00', end: '17:00' }))
    );

    // State Pengaturan Sesi (Konten Baru)
    const [sessionConfig, setSessionConfig] = useState({
        duration: "60",
        buffer: "15",
        notice: "24"
    });

    // Fetch existing schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch('/api/coach/schedule');
                const data = await res.json();
                if (data.success && data.data?.schedule) {
                    const merged = DAYS.map(day => {
                        const existing = data.data.schedule.find((s: any) => s.day === day);
                        return existing || { day, active: false, start: '09:00', end: '17:00' };
                    });
                    setSchedule(merged);
                }
                // Jika nanti ada API untuk sessionConfig, load di sini juga
            } catch (e) {
                console.error("Failed load schedule");
            }
        };
        fetchSchedule();
    }, []);

    const updateDay = (index: number, field: string, value: any) => {
        const newSchedule = [...schedule];
        (newSchedule[index] as any)[field] = value;
        setSchedule(newSchedule);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch('/api/coach/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schedule, sessionConfig }) 
            });
            toast({ title: "Tersimpan", description: "Pengaturan jadwal berhasil diperbarui." });
        } catch (e) {
            toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Aligned Left */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <CalendarDays className="w-8 h-8 text-[#00f2ea]" /> 
                        ATUR JADWAL
                    </h1>
                    <p className="text-gray-400 max-w-xl mt-1">
                        Tentukan kapan Anda bisa melatih. Jadwal yang rapi membantu member memilih slot waktu dengan mudah.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="h-12 px-8 rounded-xl bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black shadow-[0_0_20px_rgba(0,242,234,0.3)] hover:scale-105 transition-transform">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> SIMPAN PERUBAHAN</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: WEEKLY SCHEDULE (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#ff0099]" /> Ketersediaan Mingguan
                        </h3>
                        
                        <div className="space-y-3">
                            {schedule.map((item, index) => (
                                <div key={item.day} className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${item.active ? 'bg-black/40 border-[#00f2ea]/30' : 'bg-[#0a0a0a] border-white/5 opacity-50'}`}>
                                    
                                    {/* Toggle & Day Name */}
                                    <div className="flex items-center gap-4 w-full md:w-40">
                                        <Switch 
                                            checked={item.active} 
                                            onCheckedChange={(val) => updateDay(index, 'active', val)} 
                                            className="data-[state=checked]:bg-[#00f2ea]"
                                        />
                                        <span className={`font-bold uppercase tracking-wider text-sm ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.day}</span>
                                    </div>

                                    {/* Time Inputs */}
                                    {item.active ? (
                                        <div className="flex items-center gap-3 flex-1 w-full animate-in fade-in slide-in-from-left-2">
                                            <div className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-lg border border-white/10 flex-1">
                                                <span className="text-[10px] text-gray-500 px-2 font-bold">MULAI</span>
                                                <input 
                                                    type="time" 
                                                    value={item.start} 
                                                    onChange={(e) => updateDay(index, 'start', e.target.value)}
                                                    className="bg-transparent border-none text-white font-mono font-bold focus:ring-0 w-full" 
                                                />
                                            </div>
                                            <span className="text-gray-500 font-bold">:</span>
                                            <div className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-lg border border-white/10 flex-1">
                                                <span className="text-[10px] text-gray-500 px-2 font-bold">SELESAI</span>
                                                <input 
                                                    type="time" 
                                                    value={item.end} 
                                                    onChange={(e) => updateDay(index, 'end', e.target.value)}
                                                    className="bg-transparent border-none text-white font-mono font-bold focus:ring-0 w-full" 
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-center md:text-left">
                                            <span className="text-xs font-mono text-gray-600 italic">Tidak menerima latihan (Libur)</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* KOLOM KANAN: SETTINGS & BLOCKED DATES (1/3 width) */}
                <div className="space-y-6">
                    
                    {/* Session Config */}
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#ffbe00]" /> Pengaturan Sesi
                        </h3>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400 uppercase font-bold">Durasi Per Sesi</Label>
                                <Select value={sessionConfig.duration} onValueChange={(val) => setSessionConfig({...sessionConfig, duration: val})}>
                                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white rounded-xl h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="60">60 Menit (Standard)</SelectItem>
                                        <SelectItem value="90">90 Menit</SelectItem>
                                        <SelectItem value="120">120 Menit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400 uppercase font-bold">Jeda Antar Sesi (Istirahat)</Label>
                                <Select value={sessionConfig.buffer} onValueChange={(val) => setSessionConfig({...sessionConfig, buffer: val})}>
                                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white rounded-xl h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="0">Tanpa Jeda</SelectItem>
                                        <SelectItem value="15">15 Menit</SelectItem>
                                        <SelectItem value="30">30 Menit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-gray-400 uppercase font-bold">Minimum Notice (Booking H-?)</Label>
                                <Select value={sessionConfig.notice} onValueChange={(val) => setSessionConfig({...sessionConfig, notice: val})}>
                                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white rounded-xl h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="1">Min 1 Jam Sebelum</SelectItem>
                                        <SelectItem value="6">Min 6 Jam Sebelum</SelectItem>
                                        <SelectItem value="12">Min 12 Jam Sebelum</SelectItem>
                                        <SelectItem value="24">H-1 (24 Jam)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Block Specific Dates (Visual Only for now) */}
                    <Card className="bg-[#151515] border-white/10 p-6 rounded-[2rem] group hover:border-red-500/30 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <CalendarX className="w-4 h-4 text-red-500" /> Cuti / Tanggal Merah
                            </h3>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00f2ea] hover:bg-[#00f2ea]/10 rounded-full">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <span className="text-xs font-bold text-red-400">25 Des 2025</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-500/20 rounded-full">
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center mt-4">
                                Tambahkan tanggal di mana Anda tidak bisa melatih meskipun hari itu aktif di jadwal mingguan.
                            </p>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}
