'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'; // Ganti Dialog dengan Sheet
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Plus, MapPin, Calendar, Clock, Users, Edit, Trash2, Save, Repeat, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Pastikan utility cn ada (biasanya bawaan shadcn)

// --- 1. Definisi Tipe Data Baru ---
type LevelType = 'Newbie' | 'Beginner' | 'Intermediate' | 'Advance' | 'Pro';

type Session = {
    id: number;
    title: string;
    levels: LevelType[]; // Multiple levels (Array)
    isRecurring: boolean; // True = Rutin, False = Sekali
    recurrenceDay?: string; // e.g., "Senin" (Hanya jika isRecurring true)
    date?: string;          // e.g., "2025-08-25" (Hanya jika isRecurring false)
    startTime: string;
    endTime: string;
    location: string;
    quota: number;
    registered: number;
    price: number;
    host: {
        name: string;
        avatar: string;
    };
    isActive: boolean;
};

// --- 2. Mock Data ---
const initialSessions: Session[] = [
    {
        id: 1,
        title: 'Mabar Rutin Senin',
        levels: ['Intermediate', 'Advance'], // Multi level
        isRecurring: true,
        recurrenceDay: 'Senin',
        startTime: '19:00',
        endTime: '22:00',
        location: 'GOR Koni Bandung',
        quota: 18,
        registered: 12,
        price: 35000,
        host: { name: 'Andi', avatar: 'https://ui-avatars.com/api/?name=Andi&background=000&color=fff' },
        isActive: true
    },
    {
        id: 2,
        title: 'Drilling Class Pemula',
        levels: ['Newbie', 'Beginner'],
        isRecurring: false,
        date: '2025-08-26',
        startTime: '17:00',
        endTime: '19:00',
        location: 'GOR LPKIA',
        quota: 8,
        registered: 8,
        price: 50000,
        host: { name: 'Coach Budi', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random' },
        isActive: true
    },
];

const AVAILABLE_LEVELS: LevelType[] = ['Newbie', 'Beginner', 'Intermediate', 'Advance', 'Pro'];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function SessionsPage() {
    const { toast } = useToast();
    const [sessions, setSessions] = useState<Session[]>(initialSessions);
    
    // State Sheet
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // State Form
    const defaultFormData: Session = {
        id: 0,
        title: '',
        levels: ['Intermediate'],
        isRecurring: false,
        date: '',
        recurrenceDay: 'Senin',
        startTime: '',
        endTime: '',
        location: '',
        quota: 12,
        registered: 0,
        price: 0,
        host: { name: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff' },
        isActive: true
    };
    const [formData, setFormData] = useState<Session>(defaultFormData);

    // --- CRUD Handlers ---

    const handleSave = () => {
        // Simple validation
        if (!formData.title || !formData.startTime || !formData.location || formData.levels.length === 0) {
            toast({ title: "Gagal", description: "Mohon lengkapi data wajib (Judul, Level, Waktu, Lokasi).", variant: "destructive" });
            return;
        }

        if (isEditing) {
            setSessions(prev => prev.map(item => item.id === formData.id ? formData : item));
            toast({ title: "Updated", description: "Jadwal berhasil diperbarui!" });
        } else {
            const newSession = { ...formData, id: Date.now() };
            setSessions(prev => [newSession, ...prev]);
            toast({ title: "Created", description: "Jadwal baru berhasil dibuat!" });
        }
        setIsSheetOpen(false);
        resetForm();
    };

    const handleDelete = (id: number) => {
        if (confirm("Hapus jadwal ini permanen?")) {
            setSessions(prev => prev.filter(item => item.id !== id));
            toast({ title: "Deleted", description: "Jadwal dihapus." });
        }
    };

    const resetForm = () => {
        setFormData(defaultFormData);
        setIsEditing(false);
    };

    const handleEditClick = (session: Session) => {
        setFormData(session);
        setIsEditing(true);
        setIsSheetOpen(true);
    };

    // Helper: Toggle Level selection
    const toggleLevel = (level: LevelType) => {
        setFormData(prev => {
            const exists = prev.levels.includes(level);
            if (exists) {
                return { ...prev, levels: prev.levels.filter(l => l !== level) };
            } else {
                return { ...prev, levels: [...prev.levels, level] };
            }
        });
    };

    return (
        <main>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Sessions</h1>
                    <p className="text-gray-400 mt-2 font-medium">Atur jadwal Mabar, Latihan, dan Recurring Event.</p>
                </div>
                
                <Button 
                    onClick={() => { resetForm(); setIsSheetOpen(true); }}
                    className="bg-bad-yellow text-black px-6 py-4 rounded-xl font-black hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(250,204,21,0.3)] h-auto flex items-center gap-2 text-sm"
                >
                   <Plus className="w-5 h-5"/> Buat Jadwal
                </Button>
            </div>

            {/* --- SIDE SHEET FORM (Pengganti Modal) --- */}
            <Sheet open={isSheetOpen} onOpenChange={(open) => { setIsSheetOpen(open); if(!open) resetForm(); }}>
                <SheetContent className="bg-[#1A1A1A] border-l border-white/10 text-white sm:max-w-xl w-full p-0 flex flex-col h-full">
                    {/* Header Sheet */}
                    <SheetHeader className="p-6 border-b border-white/5">
                        <SheetTitle className="text-3xl font-black text-white">{isEditing ? 'Edit Jadwal' : 'Jadwal Baru'}</SheetTitle>
                        <SheetDescription className="text-gray-500">
                            Isi detail event di bawah ini. Klik simpan setelah selesai.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Scrollable Form Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* 1. Judul & Status */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nama Event</label>
                                <Input 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Cth: Mabar Sabtu Ceria" 
                                    className="bg-[#121212] border-white/10 rounded-xl px-4 py-6 font-bold text-white text-lg focus:border-bad-yellow placeholder:text-gray-700" 
                                />
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isActive ? 'bg-bad-green/20 text-bad-green' : 'bg-white/5 text-gray-500'}`}>
                                        {formData.isActive ? <Check className="w-5 h-5"/> : <X className="w-5 h-5"/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Status Publikasi</p>
                                        <p className="text-[10px] text-gray-500">Aktifkan agar muncul di Landing Page</p>
                                    </div>
                                </div>
                                <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({...formData, isActive: c})} className="data-[state=checked]:bg-bad-green"/>
                            </div>
                        </div>

                        {/* 2. Jenis Waktu (Recurring vs One-Time) */}
                        <div className="p-5 rounded-2xl border border-white/10 bg-[#151515] space-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-bad-blue/5 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Repeat className="w-3 h-3" /> Tipe Jadwal
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold ${!formData.isRecurring ? 'text-white' : 'text-gray-600'}`}>Sekali</span>
                                    <Switch checked={formData.isRecurring} onCheckedChange={(c) => setFormData({...formData, isRecurring: c})} className="data-[state=checked]:bg-bad-blue"/>
                                    <span className={`text-xs font-bold ${formData.isRecurring ? 'text-white' : 'text-gray-600'}`}>Rutin</span>
                                </div>
                            </div>

                            {formData.isRecurring ? (
                                <div>
                                    <label className="text-[10px] font-bold text-bad-blue uppercase mb-2 block">Pilih Hari Rutin</label>
                                    <Select value={formData.recurrenceDay} onValueChange={(val) => setFormData({...formData, recurrenceDay: val})}>
                                        <SelectTrigger className="w-full bg-[#1A1A1A] border-white/10 rounded-xl py-3 h-auto font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                            {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] font-bold text-white uppercase mb-2 block">Pilih Tanggal</label>
                                    <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="bg-[#1A1A1A] border-white/10 rounded-xl py-3 h-auto font-bold text-white block w-full" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Mulai</label>
                                    <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="bg-[#1A1A1A] border-white/10 rounded-xl text-center font-jersey text-xl tracking-wide h-12" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Selesai</label>
                                    <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="bg-[#1A1A1A] border-white/10 rounded-xl text-center font-jersey text-xl tracking-wide h-12" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Multi Level Selector */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Level Skill (Multiple)</label>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_LEVELS.map(level => {
                                    const isSelected = formData.levels.includes(level);
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => toggleLevel(level)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200",
                                                isSelected 
                                                    ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105" 
                                                    : "bg-[#121212] text-gray-500 border-white/10 hover:border-white/30"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 4. Lokasi & Biaya */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Lokasi GOR</label>
                                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="bg-[#121212] border-white/10 rounded-xl py-3 h-auto" placeholder="Cth: GOR Koni" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Kuota</label>
                                <Input type="number" value={formData.quota} onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value)})} className="bg-[#121212] border-white/10 rounded-xl py-3 h-auto" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Harga (Rp)</label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="bg-[#121212] border-white/10 rounded-xl py-3 h-auto" />
                            </div>
                        </div>

                    </div>

                    {/* Footer Sheet */}
                    <SheetFooter className="p-6 border-t border-white/5 bg-[#1A1A1A]">
                        <div className="flex gap-3 w-full">
                            <SheetClose asChild>
                                <Button variant="outline" className="flex-1 rounded-xl py-6 h-auto border-white/10 bg-transparent text-gray-400 hover:text-white hover:bg-white/5">Batal</Button>
                            </SheetClose>
                            <Button onClick={handleSave} className="flex-1 rounded-xl py-6 h-auto bg-bad-yellow text-black font-black hover:bg-yellow-400 text-sm">
                                {isEditing ? 'Simpan Perubahan' : 'Buat Jadwal'}
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* --- LIST JADWAL (READ) --- */}
            <div className="space-y-4 pb-20">
                {sessions.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-[#1A1A1A] rounded-[2rem] border border-white/5 border-dashed">
                        <p className="font-bold">Belum ada jadwal.</p>
                        <p className="text-xs mt-1">Buat jadwal baru untuk memulai.</p>
                    </div>
                )}

                {sessions.map(session => (
                    <div key={session.id} className={`bg-[#1A1A1A] border border-white/5 p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center gap-6 group hover:border-bad-yellow/30 transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${!session.isActive ? 'opacity-50 grayscale' : ''}`}>
                        
                        {/* Status Recurring Badge */}
                        <div className="absolute top-6 right-6 lg:hidden">
                            {session.isRecurring ? (
                                <span className="bg-bad-blue/10 text-bad-blue text-[9px] font-black px-2 py-1 rounded border border-bad-blue/20 uppercase tracking-widest flex items-center gap-1">
                                    <Repeat className="w-3 h-3"/> Rutin
                                </span>
                            ) : (
                                <span className="bg-white/10 text-white text-[9px] font-black px-2 py-1 rounded border border-white/20 uppercase tracking-widest">
                                    One-Time
                                </span>
                            )}
                        </div>

                        {/* Kolom Waktu */}
                        <div className="min-w-[140px] text-center lg:text-left">
                            <h4 className="text-5xl font-jersey text-white mt-1 group-hover:text-bad-yellow transition-colors">{session.startTime}</h4>
                            <div className="flex flex-col lg:items-start items-center gap-1 mt-1">
                                <span className="text-xs font-bold text-gray-400 bg-[#121212] px-3 py-1 rounded-full border border-white/5">
                                    {session.isRecurring ? `Tiap ${session.recurrenceDay}` : session.date}
                                </span>
                                {session.isRecurring && <span className="text-[9px] font-bold text-bad-blue uppercase tracking-widest flex items-center gap-1 lg:flex hidden"><Repeat className="w-3 h-3"/> Recurring</span>}
                            </div>
                        </div>

                        {/* Detail Info */}
                        <div className="flex-1 lg:border-l lg:border-white/10 lg:pl-8 w-full">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {session.levels.map(lvl => (
                                    <span key={lvl} className="bg-white/5 text-gray-300 border border-white/10 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                        {lvl}
                                    </span>
                                ))}
                            </div>
                            
                            <h3 className="font-bold text-2xl text-white mb-2 leading-none">{session.title}</h3>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600"/> {session.location}
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full"></div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-600"/> {session.registered}/{session.quota} Slot
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-gray-700 rounded-full"></div>
                                <div className="text-bad-green font-bold">
                                    Rp {session.price.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Right) */}
                        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                            {/* Host Info (Mobile friendly placement) */}
                            <div className="flex items-center gap-3 bg-[#121212] p-2 pr-4 rounded-full border border-white/5 lg:hidden xl:flex">
                                <Image src={session.host.avatar} alt={session.host.name} width={32} height={32} className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0" />
                                <span className="text-xs font-bold text-gray-400">{session.host.name}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleEditClick(session)} className="h-12 w-12 rounded-2xl bg-[#121212] border border-white/5 hover:bg-white hover:text-black hover:scale-110 transition text-gray-400">
                                    <Edit className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(session.id)} className="h-12 w-12 rounded-2xl bg-[#121212] border border-white/5 hover:bg-bad-red hover:text-white hover:border-bad-red hover:scale-110 transition text-gray-400">
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
