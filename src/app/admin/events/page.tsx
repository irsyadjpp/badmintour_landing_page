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
    AlertTriangle,
    CalendarDays,
    ClipboardCheck,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminEventsPage() {
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Close Session State
    const [closeEventId, setCloseEventId] = useState<string | null>(null);
    const [shuttlecockQty, setShuttlecockQty] = useState('');
    const [courtFee, setCourtFee] = useState('');
    const [coachFee, setCoachFee] = useState('');
    const [isCloseLoading, setIsCloseLoading] = useState(false);

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

    // Handle Close Session
    const handleCloseSession = async () => {
        if (!closeEventId) return;
        setIsCloseLoading(true);
        try {
            const res = await fetch('/api/admin/finance/close-session', {
                method: 'POST',
                body: JSON.stringify({
                    eventId: closeEventId,
                    shuttlecockUsedQty: parseInt(shuttlecockQty),
                    courtFee: parseInt(courtFee),
                    coachFee: parseInt(coachFee),
                    shuttlecockItemId: 'sc-001' // HARDCODED FOR DEMO (Should be select)
                })
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Sesi Ditutup", description: "Laporan keuangan sesi telah dibuat." });
                setCloseEventId(null);
                fetchEvents();
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setIsCloseLoading(false);
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
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <CalendarDays className="w-8 h-8 text-[#ffbe00]" /> KELOLA EVENT
                    </h1>
                    <p className="text-gray-400">Pantau semua jadwal Mabar, Drilling, dan Turnamen.</p>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Cari event..."
                            className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl focus:border-[#ffbe00] focus:ring-[#ffbe00]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Link href="/admin/events/create">
                        {/* Menggunakan Form Create milik Host agar efisien */}
                        <Button className="bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold rounded-xl h-10 shadow-[0_0_15px_rgba(202,31,61,0.3)]">
                            <Plus className="w-5 h-5 mr-2" /> BUAT BARU
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Event Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Memuat data event...</div>
            ) : filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="bg-[#151515] border border-white/5 p-6 rounded-[2rem] group hover:border-[#ffbe00]/50 transition-all relative overflow-hidden shadow-xl">

                            {/* Status Badge & Actions */}
                            <div className="flex justify-between items-start mb-4">
                                <Badge className={`
                                    text-[10px] font-bold uppercase tracking-wider border-0 px-3 py-1
                                    ${event.type === 'drilling'
                                        ? 'bg-[#00f2ea]/10 text-[#00f2ea] border border-[#00f2ea]/20'  // Cyan untuk Drilling (Khas Coach)
                                        : 'bg-[#ffbe00]/10 text-[#ffbe00] border border-[#ffbe00]/20'} // Kuning untuk Mabar
                                `}>
                                    {event.type === 'drilling' ? <Dumbbell className="w-3 h-3 mr-1" /> : <Trophy className="w-3 h-3 mr-1" />}
                                    {event.type === 'drilling' ? 'Drilling' : 'Mabar'}
                                </Badge>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white rounded-xl">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/events/${event.id}`} className="w-full cursor-pointer flex items-center focus:bg-white/5 focus:text-[#ffbe00]">
                                                <Users className="w-4 h-4 mr-2" /> Lihat Peserta
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer" onClick={() => setDeleteId(event.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus Event
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-blue-500 focus:text-blue-500 focus:bg-blue-500/10 cursor-pointer" onClick={() => setCloseEventId(event.id)}>
                                            <ClipboardCheck className="w-4 h-4 mr-2" /> Tutup Buku (Close)
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Content */}
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#ffbe00] transition-colors line-clamp-2">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4 text-[#ca1f3d]" />
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

                            {/* Footer Stats */}
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-bold text-white">
                                        {event.bookedSlot || 0}<span className="text-gray-500 font-normal">/{event.quota} Slot</span>
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
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 font-bold">Tidak ada event yang ditemukan.</p>
                </div>
            )}

            {/* ALERT DELETE */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="w-5 h-5" /> Hapus Event?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Tindakan ini permanen. Data booking terkait event ini akan kehilangan referensinya (Orphan Data).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/5">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* CLOSE SESSION MODAL */}
            <Dialog open={!!closeEventId} onOpenChange={(open) => !open && setCloseEventId(null)}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Tutup Buku Sesi (Close Session)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Shuttlecock Terpakai (Slop)</Label>
                            <Input
                                type="number"
                                value={shuttlecockQty}
                                onChange={(e) => setShuttlecockQty(e.target.value)}
                                className="bg-[#121212] border-white/10"
                                placeholder="Jml Slop"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Biaya Sewa Lapangan (Rp)</Label>
                            <Input
                                type="number"
                                value={courtFee}
                                onChange={(e) => setCourtFee(e.target.value)}
                                className="bg-[#121212] border-white/10"
                                placeholder="Total Bayar GOR"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fee Pelatih (Opsional)</Label>
                            <Input
                                type="number"
                                value={coachFee}
                                onChange={(e) => setCoachFee(e.target.value)}
                                className="bg-[#121212] border-white/10"
                                placeholder="Fee Coach"
                            />
                        </div>
                        <Button
                            className="w-full bg-blue-600 text-white font-bold h-12 rounded-xl mt-4 hover:bg-blue-500"
                            onClick={handleCloseSession}
                            disabled={isCloseLoading}
                        >
                            {isCloseLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                            Hitung Profit & Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
