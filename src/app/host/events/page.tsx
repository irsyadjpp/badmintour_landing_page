'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    CalendarDays, 
    Plus, 
    Search, 
    MapPin, 
    Users, 
    Clock, 
    MoreHorizontal, 
    Trash2, 
    Dumbbell, 
    Trophy,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

export default function HostEventsPage() {
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // FETCH DATA REAL DARI API
    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Gagal load events", error);
            toast({ title: "Gagal", description: "Tidak bisa memuat data event.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle Delete (Opsional untuk Host)
    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus event ini?")) return;
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast({ title: "Terhapus", description: "Event berhasil dihapus." });
                fetchEvents();
            }
        } catch (e) {
            toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
        }
    }

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <CalendarDays className="w-8 h-8 text-[#ffbe00]" /> KELOLA JADWAL
                    </h1>
                    <p className="text-gray-400">Daftar kegiatan yang Anda kelola.</p>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Cari event..." 
                            className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl focus:border-[#ffbe00]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/host/events/create">
                        <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(202,31,61,0.3)]">
                            <Plus className="w-5 h-5 mr-2" /> JADWAL BARU
                        </Button>
                    </Link>
                </div>
            </div>

            {/* List Events */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p>Memuat data event...</p>
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="bg-[#151515] border border-white/5 p-6 rounded-[2rem] group hover:border-[#ffbe00]/30 transition-all relative overflow-hidden shadow-lg">
                            
                            {/* Badges & Menu */}
                            <div className="flex justify-between items-start mb-4">
                                <Badge className={`
                                    text-[10px] font-bold uppercase tracking-wider border-0 px-3 py-1
                                    ${event.type === 'drilling' 
                                        ? 'bg-[#00f2ea]/10 text-[#00f2ea] border border-[#00f2ea]/20' 
                                        : (event.type === 'tournament' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20')
                                    }
                                `}>
                                    {event.type === 'drilling' ? <Dumbbell className="w-3 h-3 mr-1"/> : <Trophy className="w-3 h-3 mr-1"/>}
                                    {event.type === 'drilling' ? 'Drilling' : (event.type === 'tournament' ? 'Turnamen' : 'Mabar')}
                                </Badge>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white">
                                        <DropdownMenuItem className="text-red-500 cursor-pointer focus:bg-white/5" onClick={() => handleDelete(event.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>
                                    {event.coachName && (
                                        <p className="text-xs text-[#00f2ea] font-bold mt-1">Coach: {event.coachName}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <CalendarDays className="w-4 h-4 text-[#ca1f3d]" />
                                        <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Clock className="w-4 h-4 text-[#ca1f3d]" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <MapPin className="w-4 h-4 text-[#ca1f3d]" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-bold text-white">
                                        {event.bookedSlot || 0}<span className="text-gray-500 font-normal">/{event.quota}</span>
                                    </span>
                                </div>
                                <p className="font-bold text-[#ffbe00] text-lg">
                                    Rp {Number(event.price).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-[3rem] bg-[#151515]/50">
                    <CalendarDays className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-gray-500 font-bold">Belum ada kegiatan yang dibuat.</p>
                </div>
            )}
        </div>
    );
}
