'use client';

import { useState } from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    MapPin, 
    DollarSign, 
    Users, 
    Lock, 
    Zap, 
    ListChecks,
    Save
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

export default function CreateEventPage() {
    // Feature Toggles
    const [isDynamicPrice, setIsDynamicPrice] = useState(false);
    const [isSkillLocked, setIsSkillLocked] = useState(false);
    const [isWaitlist, setIsWaitlist] = useState(true);

    const handleSave = () => {
        toast({
            title: "Event Created! 🎉",
            description: "Jadwal mabar berhasil diterbitkan.",
            className: "bg-green-600 text-white border-none"
        });
    };

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/host/events">
                    <Button variant="ghost" size="icon" className="rounded-xl text-gray-400 hover:text-white">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">New Event</h1>
                    <p className="text-gray-400">Atur detail acara, harga, dan aturan main.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: MAIN FORM */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. Basic Info */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#ca1f3d]" /> Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400">Judul Event</Label>
                                <Input placeholder="Contoh: Mabar Rebo Kelabu" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Tanggal</Label>
                                    <Input type="date" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Jam Mulai</Label>
                                    <Input type="time" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Lokasi / Court</Label>
                                <Select>
                                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl">
                                        <SelectValue placeholder="Pilih Lapangan" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="court1">Court 1 (Carpet)</SelectItem>
                                        <SelectItem value="court2">Court 2 (Parquet)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Pricing & Capacity */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#ffbe00]" /> Pricing & Capacity
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Harga Normal (Rp)</Label>
                                    <Input type="number" placeholder="40000" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Total Slot</Label>
                                    <Input type="number" placeholder="12" className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl" />
                                </div>
                            </div>

                            {/* FEATURE: DYNAMIC PRICING */}
                            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="space-y-1">
                                        <Label className="text-white font-bold flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#ffbe00]" /> Dynamic Pricing
                                        </Label>
                                        <p className="text-[10px] text-gray-500">Aktifkan harga Early Bird atau Last Minute.</p>
                                    </div>
                                    <Switch checked={isDynamicPrice} onCheckedChange={setIsDynamicPrice} />
                                </div>

                                {isDynamicPrice && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label className="text-[#ffbe00] text-xs uppercase font-bold">Early Bird Price</Label>
                                            <Input type="number" placeholder="30000" className="bg-[#151515] border-yellow-500/20 text-white h-10 rounded-lg" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[#ffbe00] text-xs uppercase font-bold">Limit (First X User)</Label>
                                            <Input type="number" placeholder="5" className="bg-[#151515] border-yellow-500/20 text-white h-10 rounded-lg" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                </div>

                {/* RIGHT: ADVANCED SETTINGS */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* 3. Skill Level Lock */}
                    <Card className={`p-6 rounded-[2rem] border transition-all ${isSkillLocked ? 'bg-[#ca1f3d]/10 border-[#ca1f3d]/30' : 'bg-[#151515] border-white/5'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-sm font-bold flex items-center gap-2 ${isSkillLocked ? 'text-[#ca1f3d]' : 'text-gray-400'}`}>
                                <Lock className="w-4 h-4" /> Skill Lock
                            </h3>
                            <Switch checked={isSkillLocked} onCheckedChange={setIsSkillLocked} className="data-[state=checked]:bg-red-500"/>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                            Jika aktif, member di bawah level ini <span className="text-red-400 font-bold">DILARANG</span> join.
                        </p>
                        {isSkillLocked && (
                            <Select defaultValue="Intermediate">
                                <SelectTrigger className="bg-[#0a0a0a] border-red-500/30 text-white h-10 rounded-lg">
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

                    {/* 4. Waitlist System */}
                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-purple-500" /> Waitlist System
                            </h3>
                            <Switch checked={isWaitlist} onCheckedChange={setIsWaitlist} className="data-[state=checked]:bg-purple-500"/>
                        </div>
                        <p className="text-xs text-gray-500">
                            {isWaitlist 
                                ? "Otomatis buka antrian saat slot penuh. Notifikasi 'Siapa Cepat Dia Dapat' akan dikirim jika ada slot kosong." 
                                : "Saat penuh, pendaftaran ditutup total."}
                        </p>
                    </Card>

                    {/* Save Button */}
                    <Button onClick={handleSave} className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl shadow-lg hover:shadow-[#ca1f3d]/20 transition-all">
                        <Save className="w-5 h-5 mr-2" /> PUBLISH EVENT
                    </Button>
                    <Button variant="outline" className="w-full h-12 border-white/10 text-gray-400 hover:text-white rounded-xl">
                        Save as Draft
                    </Button>

                </div>
            </div>
        </div>
    );
}
