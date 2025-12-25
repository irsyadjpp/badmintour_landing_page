'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Plus, MapPin, Calendar, Clock, Users, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// 1. Definisi Tipe Data (Sesuai kebutuhan Landing Page)
type Session = {
    id: number;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Advance' | 'All Level';
    date: string;       // Format: YYYY-MM-DD
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

// 2. Mock Data Awal
const initialSessions: Session[] = [
    {
        id: 1,
        title: 'Mabar Rutin Senin',
        level: 'Intermediate',
        date: '2025-08-25',
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
        level: 'Beginner',
        date: '2025-08-26',
        startTime: '17:00',
        endTime: '19:00',
        location: 'GOR LPKIA',
        quota: 8,
        registered: 8, // Full
        price: 50000,
        host: { name: 'Coach Budi', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random' },
        isActive: true
    },
];

export default function SessionsPage() {
    const { toast } = useToast();
    const [sessions, setSessions] = useState<Session[]>(initialSessions);
    
    // State untuk Modal Form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // State Form Data
    const defaultFormData: Session = {
        id: 0,
        title: '',
        level: 'Intermediate',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        quota: 10,
        registered: 0,
        price: 0,
        host: { name: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff' },
        isActive: true
    };
    const [formData, setFormData] = useState<Session>(defaultFormData);

    // --- CRUD FUNCTIONS ---

    // 1. CREATE & UPDATE Handler
    const handleSave = () => {
        if (!formData.title || !formData.date || !formData.location) {
            toast({ title: "Error", description: "Mohon lengkapi data wajib!", variant: "destructive" });
            return;
        }

        if (isEditing) {
            // Update Existing
            setSessions(prev => prev.map(item => item.id === formData.id ? formData : item));
            toast({ title: "Success", description: "Jadwal berhasil diperbarui!" });
        } else {
            // Create New
            const newSession = { ...formData, id: Date.now() }; // Generate fake ID
            setSessions(prev => [newSession, ...prev]);
            toast({ title: "Success", description: "Jadwal baru ditambahkan!" });
        }
        setIsModalOpen(false);
        resetForm();
    };

    // 2. DELETE Handler
    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus jadwal ini?")) {
            setSessions(prev => prev.filter(item => item.id !== id));
            toast({ title: "Deleted", description: "Jadwal telah dihapus." });
        }
    };

    // Helper: Reset Form
    const resetForm = () => {
        setFormData(defaultFormData);
        setIsEditing(false);
    };

    // Helper: Prepare Edit
    const handleEditClick = (session: Session) => {
        setFormData(session);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // Helper: Styling Badge Level
    const getLevelClass = (level: string) => {
        switch(level) {
            case 'Intermediate': return 'bg-bad-yellow/10 text-bad-yellow border border-bad-yellow/20';
            case 'Beginner': return 'bg-bad-green/10 text-bad-green border border-bad-green/20';
            case 'Advance': return 'bg-bad-blue/10 text-bad-blue border border-bad-blue/20';
            default: return 'bg-white/10 text-gray-400';
        }
    };

    return (
        <main>
            {/* Header Page */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Sessions</h1>
                    <p className="text-gray-400 mt-2 font-medium">Atur jadwal Mabar & Latihan untuk Landing Page.</p>
                </div>
                
                {/* Tombol Tambah (Trigger Modal) */}
                <Button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] h-auto flex items-center gap-2"
                >
                   <Plus className="w-4 h-4"/> Jadwal Baru
                </Button>
            </div>

            {/* MODAL FORM (Create/Edit) */}
            <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if(!open) resetForm(); }}>
                <DialogContent className="sm:max-w-lg bg-[#1A1A1A] border border-white/10 rounded-[2rem] p-8 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">{isEditing ? 'Edit Jadwal' : 'Buat Jadwal Baru'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Judul Event</label>
                            <Input 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Cth: Mabar Sabtu Pagi" 
                                className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none focus:border-bad-yellow h-auto" 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Tanggal</label>
                                <Input 
                                    type="date" 
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Level</label>
                                <Select value={formData.level} onValueChange={(val: any) => setFormData({...formData, level: val})}>
                                    <SelectTrigger className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white h-auto">
                                        <SelectValue placeholder="Pilih Level" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                        <SelectItem value="All Level">All Level</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Jam Mulai</label>
                                <Input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="mt-2 bg-[#121212] border-white/10 rounded-xl h-auto py-3 text-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Jam Selesai</label>
                                <Input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="mt-2 bg-[#121212] border-white/10 rounded-xl h-auto py-3 text-white" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Lokasi</label>
                            <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Nama GOR / Lapangan" className="mt-2 bg-[#121212] border-white/10 rounded-xl h-auto py-3 text-white" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Kuota Pemain</label>
                                <Input type="number" value={formData.quota} onChange={(e) => setFormData({...formData, quota: parseInt(e.target.value)})} className="mt-2 bg-[#121212] border-white/10 rounded-xl h-auto py-3 text-white" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">HTM (Rp)</label>
                                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="mt-2 bg-[#121212] border-white/10 rounded-xl h-auto py-3 text-white" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl border border-white/10">
                            <span className="text-sm font-bold">Status Aktif</span>
                            <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({...formData, isActive: c})} className="data-[state=checked]:bg-bad-green"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave} className="w-full py-6 h-auto rounded-xl bg-white text-black font-black hover:bg-gray-200 mt-4 flex gap-2">
                            <Save className="w-4 h-4"/> {isEditing ? 'Simpan Perubahan' : 'Terbitkan Jadwal'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* LIST JADWAL (READ) */}
            <div className="space-y-4">
                {sessions.length === 0 && (
                    <div className="text-center py-20 text-gray-500">Belum ada jadwal. Silakan buat baru.</div>
                )}

                {sessions.map(session => (
                    <div key={session.id} className={`bg-[#1A1A1A] border border-white/5 p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center gap-6 group hover:border-white/20 transition ${!session.isActive ? 'opacity-50 grayscale' : ''}`}>
                        
                        {/* Waktu & Tanggal */}
                        <div className="min-w-[140px] text-center lg:text-left">
                            <span className={`${getLevelClass(session.level)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}>
                                {session.level}
                            </span>
                            <h4 className="text-4xl font-jersey text-white mt-3">{session.startTime}</h4>
                            <div className="flex items-center gap-2 justify-center lg:justify-start text-xs font-bold text-gray-500 mt-1">
                                <Calendar className="w-3 h-3" />
                                {session.date}
                            </div>
                        </div>

                        {/* Detail Info */}
                        <div className="flex-1 lg:border-l lg:border-white/10 lg:pl-8 w-full">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-xl text-white">{session.title}</h3>
                                {session.registered >= session.quota && (
                                    <span className="bg-bad-red text-white text-[10px] font-black px-2 py-1 rounded uppercase">Full Booked</span>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-2">
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600"/> {session.location}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-1">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> Slot: {session.registered}/{session.quota}</span>
                                    <span className="text-bad-green">Rp {session.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Host & Actions */}
                        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                            <div className="flex items-center gap-3 bg-[#121212] p-2 pr-4 rounded-full border border-white/5">
                                <Image src={session.host.avatar} alt={session.host.name} width={40} height={40} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Host</p>
                                    <p className="text-xs font-bold text-white">{session.host.name}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleEditClick(session)} className="h-10 w-10 rounded-full bg-white/5 hover:bg-bad-yellow hover:text-black transition text-white">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(session.id)} className="h-10 w-10 rounded-full bg-white/5 hover:bg-bad-red hover:text-white transition text-white">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
