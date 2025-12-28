'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Calendar, 
    MapPin, 
    Users, 
    Plus, 
    Search, 
    Trash2, 
    MoreHorizontal,
    Clock,
    Dumbbell,
    Trophy,
    AlertTriangle
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export default function AdminEventsPage() {
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Fetch Events
    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch(`/api/events/${deleteId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast({ title: "Terhapus", description: "Event berhasil dihapus." });
                fetchEvents(); // Refresh list
            } else {
                throw new Error("Gagal menghapus");
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal menghapus event.", variant: "destructive" });
        } finally {
            setDeleteId(null);
        }
    };

    // Filter Logic
    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-black dark:text-white flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-blue-500" /> KELOLA EVENT
                    </h1>
                    <p className="text-gray-500">Pantau semua jadwal Mabar, Drilling, dan Turnamen.</p>
                </div>
                
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Cari event..." 
                            className="pl-10 bg-white dark:bg-[#151515] border-gray-200 dark:border-white/10 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/host/events/create"> 
                        {/* Admin bisa pakai form create milik Host */}
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 shadow-lg shadow-blue-900/20">
                            <Plus className="w-5 h-5 mr-2" /> BUAT BARU
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Event Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500">Memuat data event...</div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 p-6 rounded-[2rem] group hover:border-blue-500/30 transition-all relative overflow-hidden shadow-sm">
                            
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <Badge className={`
                                    text-[10px] font-bold uppercase tracking-wider border-0
                                    ${event.type === 'drilling' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-red-500/10 text-red-500'}
                                `}>
                                    {event.type === 'drilling' ? <Dumbbell className="w-3 h-3 mr-1"/> : <Trophy className="w-3 h-3 mr-1"/>}
                                    {event.type === 'drilling' ? 'Drilling' : 'Mabar'}
                                </Badge>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 hover:text-black dark:hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10">
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer" onClick={() => setDeleteId(event.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus Event
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 relative z-10">
                                <h3 className="text-xl font-black text-black dark:text-white leading-tight group-hover:text-blue-500 transition-colors">
                                    {event.title}
                                </h3>
                                
                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-black dark:text-white">
                                        {event.bookedSlot || 0}<span className="text-gray-500 font-normal">/{event.quota} Slot</span>
                                    </span>
                                </div>
                                <p className="font-bold text-blue-600 dark:text-blue-400">
                                    Rp {Number(event.price).toLocaleString('id-ID')}
                                </p>
                            </div>

                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem]">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-bold">Tidak ada event yang ditemukan.</p>
                </div>
            )}

            {/* ALERT DELETE */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10 text-black dark:text-white rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" /> Hapus Event?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500">
                            Tindakan ini permanen. Data booking terkait event ini mungkin akan menjadi orphan data jika tidak ditangani.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 border-0">Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
