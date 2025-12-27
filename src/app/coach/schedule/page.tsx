'use client';

import { useState, useEffect } from 'react';
import { Save, Clock, CalendarDays, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CoachSchedulePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({ day, active: false, start: '09:00', end: '17:00' }))
    );

    // Fetch existing schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            const res = await fetch('/api/coach/schedule');
            const data = await res.json();
            if (data.success && data.data?.schedule) {
                // Merge dengan default days (jika ada hari baru)
                const merged = DAYS.map(day => {
                    const existing = data.data.schedule.find((s: any) => s.day === day);
                    return existing || { day, active: false, start: '09:00', end: '17:00' };
                });
                setSchedule(merged);
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
                body: JSON.stringify({ schedule })
            });
            toast({ title: "Tersimpan", description: "Jadwal ketersediaan Anda telah diperbarui." });
        } catch (e) {
            toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <CalendarDays className="w-8 h-8 text-[#00f2ea]" /> Availability
                    </h1>
                    <p className="text-gray-400">Atur jam melatih agar member bisa booking sesuai jadwalmu.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} className="bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-bold">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>}
                </Button>
            </div>

            <div className="grid gap-4">
                {schedule.map((item, index) => (
                    <Card key={item.day} className={`p-4 border transition-all ${item.active ? 'bg-[#151515] border-white/10' : 'bg-[#0a0a0a] border-white/5 opacity-70'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <Switch 
                                    checked={item.active} 
                                    onCheckedChange={(val) => updateDay(index, 'active', val)} 
                                    className="data-[state=checked]:bg-[#00f2ea]"
                                />
                                <span className={`font-bold ${item.active ? 'text-white' : 'text-gray-500'}`}>{item.day}</span>
                            </div>

                            {item.active && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2">
                                    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <Input 
                                            type="time" 
                                            value={item.start} 
                                            onChange={(e) => updateDay(index, 'start', e.target.value)}
                                            className="h-8 w-24 bg-transparent border-0 text-white p-0 focus-visible:ring-0" 
                                        />
                                        <span className="text-gray-500">-</span>
                                        <Input 
                                            type="time" 
                                            value={item.end} 
                                            onChange={(e) => updateDay(index, 'end', e.target.value)}
                                            className="h-8 w-24 bg-transparent border-0 text-white p-0 focus-visible:ring-0" 
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div className="text-xs text-gray-500 font-mono hidden md:block">
                                {item.active ? "Available for booking" : "Day Off"}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
