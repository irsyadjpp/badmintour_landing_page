'use client';

import { useState } from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    MapPin, 
    DollarSign, 
    Lock, 
    Zap, 
    ListChecks,
    Save,
    LayoutGrid, // Icon untuk Court
    Hash, // Icon untuk Nomor
    Repeat, // Icon baru untuk Recurring
    CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CreateEventPage() {
    // Feature Toggles
    const [isDynamicPrice, setIsDynamicPrice] = useState(false);
    const [isSkillLocked, setIsSkillLocked] = useState(false);
    const [isWaitlist, setIsWaitlist] = useState(true);
    
    // Recurring State
    const [isRecurring, setIsRecurring] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState("4"); // Default 1 Bulan (4 Minggu)

    const handleSave = () => {
        const message = isRecurring 
            ? `Berhasil membuat ${repeatWeeks} jadwal event rutin!`
            : "Jadwal event berhasil diterbitkan.";

        toast({
            title: "Event Published! 🎉",
            description: message,
            className: "bg-[#ca1f3d] text-white border-none"
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/host/events">
                    <Button variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">New Event</h1>
                    <p className="text-gray-400">Atur detail acara, lokasi, harga, dan jadwal rutin.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: MAIN FORM */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. Basic Info (Judul & Waktu) */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#ca1f3d]" /> Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Judul Event</Label>
                                <Input placeholder="Contoh: Mabar Rutin Senin" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tanggal Awal</Label>
                                    <Input type="date" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Jam Mulai</Label>
                                    <Input type="time" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                            </div>

                            {/* FITUR RECURRING / JADWAL BERULANG */}
                            <div className="pt-4 mt-4 border-t border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-1">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <Repeat className="w-4 h-4 text-[#ffbe00]" /> Jadwal Berulang (Recurring)
                                        </Label>
                                        <p className="text-[10px] text-gray-500">Buat jadwal otomatis untuk beberapa minggu ke depan.</p>
                                    </div>
                                    <Switch checked={isRecurring} onCheckedChange={setIsRecurring} className="data-[state=checked]:bg-[#ffbe00]" />
                                </div>

                                {isRecurring && (
                                    <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#ffbe00]/20 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-[#ffbe00] text-xs uppercase font-bold">Ulangi Selama (Minggu)</Label>
                                                <Select value={repeatWeeks} onValueChange={setRepeatWeeks}>
                                                    <SelectTrigger className="bg-[#151515] border-white/10 text-white h-10 rounded-lg">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                        <SelectItem value="4">1 Bulan (4 Minggu)</SelectItem>
                                                        <SelectItem value="8">2 Bulan (8 Minggu)</SelectItem>
                                                        <SelectItem value="12">3 Bulan (12 Minggu)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            {/* Preview Dates */}
                                            <div className="bg-[#151515] p-3 rounded-lg flex items-start gap-3">
                                                <CalendarDays className="w-4 h-4 text-gray-500 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Event akan dibuat pada:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge variant="secondary" className="bg-[#ffbe00]/10 text-[#ffbe00] text-[10px]">Minggu 1</Badge>
                                                        <Badge variant="secondary" className="bg-[#ffbe00]/10 text-[#ffbe00] text-[10px]">Minggu 2</Badge>
                                                        <Badge variant="secondary" className="bg-[#ffbe00]/10 text-[#ffbe00] text-[10px]">...</Badge>
                                                        <Badge variant="secondary" className="bg-[#ffbe00]/10 text-[#ffbe00] text-[10px]">Minggu {repeatWeeks}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* 2. VENUE & COURTS */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#ca1f3d]" /> Venue & Courts
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Nama GOR / Lokasi</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input placeholder="Contoh: GOR Wartawan" className="bg-[#0a0a0a] border-white/10 pl-10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 flex items-center gap-2">
                                        <LayoutGrid className="w-3 h-3 text-[#ffbe00]" /> Jumlah Court
                                    </Label>
                                    <Input type="number" placeholder="2" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-[#ffbe00]" /> Nomor Court
                                    </Label>
                                    <Input placeholder="1, 2" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 3. Pricing & Capacity */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#ffbe00]" /> Pricing & Capacity
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Harga Normal (Rp)</Label>
                                    <Input type="number" placeholder="40000" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Total Slot Pemain</Label>
                                    <Input type="number" placeholder="12" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl focus:border-[#ca1f3d]" />
                                </div>
                            </div>

                            {/* Dynamic Pricing */}
                            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-1">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#ffbe00]" /> Dynamic Pricing
                                        </Label>
                                        <p className="text-[10px] text-gray-500">Aktifkan harga Early Bird atau Last Minute.</p>
                                    </div>
                                    <Switch checked={isDynamicPrice} onCheckedChange={setIsDynamicPrice} className="data-[state=checked]:bg-[#ffbe00]" />
                                </div>

                                {isDynamicPrice && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label className="text-[#ffbe00] text-xs uppercase font-bold">Early Bird Price</Label>
                                            <Input type="number" placeholder="30000" className="bg-[#151515] border-[#ffbe00]/20 text-white h-10 rounded-lg focus:border-[#ffbe00]" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[#ffbe00] text-xs uppercase font-bold">Limit (First X User)</Label>
                                            <Input type="number" placeholder="5" className="bg-[#151515] border-[#ffbe00]/20 text-white h-10 rounded-lg focus:border-[#ffbe00]" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                </div>

                {/* RIGHT COLUMN: ADVANCED SETTINGS */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* 4. Skill Level Lock */}
                    <Card className={`p-6 rounded-[2rem] border transition-all ${isSkillLocked ? 'bg-[#ca1f3d]/10 border-[#ca1f3d]/30' : 'bg-[#151515] border-white/5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-bold flex items-center gap-2 ${isSkillLocked ? 'text-[#ca1f3d]' : 'text-gray-400'}`}>
                                <Lock className="w-4 h-4" /> Skill Lock
                            </h3>
                            <Switch checked={isSkillLocked} onCheckedChange={setIsSkillLocked} className="data-[state=checked]:bg-[#ca1f3d]"/>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                            Jika aktif, member di bawah level ini <span className="text-[#ca1f3d] font-bold">DILARANG</span> join.
                        </p>
                        {isSkillLocked && (
                            <Select defaultValue="Intermediate">
                                <SelectTrigger className="bg-[#0a0a0a] border-[#ca1f3d]/30 text-white h-10 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                    <SelectItem value="Intermediate">Intermediate Only</SelectItem>
                                    <SelectItem value="Advanced">Advanced Only</SelectItem>
                                    <SelectItem value="Pro">Pro Athlete Only</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </Card>

                    {/* 5. Waitlist System */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-[#ffbe00]" /> Waitlist System
                            </h3>
                            <Switch checked={isWaitlist} onCheckedChange={setIsWaitlist} className="data-[state=checked]:bg-[#ffbe00]"/>
                        </div>
                        <p className="text-xs text-gray-500">
                            {isWaitlist 
                                ? "Otomatis buka antrian saat slot penuh. Prioritas 'Siapa Cepat Dia Dapat'." 
                                : "Saat penuh, pendaftaran ditutup total."}
                        </p>
                    </Card>

                    {/* Summary Sticky */}
                    <div className="space-y-3 sticky top-6">
                        {isRecurring && (
                             <div className="bg-[#ffbe00]/10 border border-[#ffbe00]/20 p-4 rounded-xl mb-2">
                                <p className="text-[#ffbe00] font-bold text-sm text-center">
                                    Total: {repeatWeeks} Event
                                </p>
                             </div>
                        )}
                        <Button onClick={handleSave} className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl shadow-lg hover:shadow-[#ca1f3d]/20 transition-all">
                            <Save className="w-5 h-5 mr-2" /> PUBLISH {isRecurring ? 'SERIES' : 'EVENT'}
                        </Button>
                        <Button variant="outline" className="w-full h-12 border-white/10 text-gray-400 hover:text-white rounded-xl">
                            Save as Draft
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
