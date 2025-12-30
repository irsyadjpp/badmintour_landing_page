'use client';

import { Swords, MapPin, Calendar, Clock, Loader2, CheckCircle, Info, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MabarPage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Dialog State
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Fetch Mabar Events
    const { data: events = [], isLoading } = useQuery({
        queryKey: ['events', 'mabar'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            const data = await res.json();
            return data.data ? data.data.filter((e: any) => e.type === 'mabar') : [];
        }
    });

    // Fetch My Join Status
    const { data: joinedEvents = {} } = useQuery({
        queryKey: ['bookings', 'list', session?.user?.id],
        queryFn: async () => {
            const res = await fetch('/api/member/bookings?mode=list');
            const data = await res.json();
            const map: Record<string, string> = {};
            if (data.success && Array.isArray(data.data)) {
                data.data.forEach((b: any) => {
                    map[b.eventId] = b.status;
                });
            }
            return map;
        },
        enabled: !!session?.user?.id
    });

    const handleJoin = async () => {
        if (!selectedEvent) return;
        setBookingLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: selectedEvent.id })
            });
            const result = await res.json();
            if (result.success) {
                toast({ title: "Berhasil Join!", description: "Tiket mabar sudah diterbitkan." });
                setSelectedEvent(null);
                queryClient.invalidateQueries({ queryKey: ['bookings'] });
                queryClient.invalidateQueries({ queryKey: ['events'] });
            } else {
                throw new Error(result.error || "Gagal booking");
            }
        } catch (error: any) {
            toast({ title: "Gagal", description: error.message, variant: "destructive" });
        } finally {
            setBookingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 text-center text-white flex flex-col items-center">
                <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00] mb-4" />
                <p className="font-mono text-[#ffbe00]">LOADING ARENA...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">

            {/* STANDARD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6 px-6 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#ffbe00]/10 flex items-center justify-center border border-[#ffbe00]/20">
                        <Swords className="w-8 h-8 text-[#ffbe00]" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            MABAR <span className="text-[#ca1f3d]">ARENA</span>
                        </h1>
                        <p className="text-gray-400 mt-1 max-w-xl text-sm">
                            Main bareng komunitas, tambah teman & skill.
                        </p>
                    </div>
                </div>
            </div>

            {/* EVENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {events.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-[#1A1A1A] rounded-[2rem] border border-white/5">
                        <Swords className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">Belum Ada Jadwal Mabar</h3>
                        <p className="text-gray-500">Nantikan jadwal mabar seru berikutnya!</p>
                    </div>
                ) : (
                    events.map((event: any, index: number) => {
                        const isJoined = !!joinedEvents[event.id];
                        const seatLeft = event.quota - (event.bookedSlot || 0);

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-[#151515] border-white/5 overflow-hidden group hover:border-[#ffbe00]/30 transition-all duration-300 relative rounded-[2rem]">
                                    {/* Action Banner if Joined */}
                                    {isJoined && (
                                        <div className="absolute top-0 right-0 left-0 bg-green-500/10 border-b border-green-500/20 text-green-500 text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 z-20">
                                            <CheckCircle className="w-3 h-3" /> SUDAH TERDAFTAR
                                        </div>
                                    )}

                                    <div className="p-6 space-y-4 pt-10">
                                        {/* Date Badge */}
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white font-mono uppercase tracking-wider">
                                                {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </Badge>
                                            <span className="text-[#ffbe00] font-black tracking-tight">{event.time}</span>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-white leading-none group-hover:text-[#ffbe00] transition-colors">{event.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4 text-[#ca1f3d]" /> {event.location}
                                            </div>
                                        </div>

                                        {/* Avatars */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex -space-x-3">
                                                {event.avatars?.slice(0, 3).map((img: string, i: number) => (
                                                    <Avatar key={i} className="w-8 h-8 border-2 border-[#151515]">
                                                        <AvatarImage src={img} />
                                                        <AvatarFallback className="bg-gray-800 text-[8px]">U</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {event.bookedSlot > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-[#222] border-2 border-[#151515] flex items-center justify-center text-[10px] text-gray-400 font-bold">
                                                        +{event.bookedSlot - 3}
                                                    </div>
                                                )}
                                                {event.bookedSlot === 0 && <span className="text-gray-600 text-xs italic ml-2">Jadilah yang pertama!</span>}
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Slot Tersisa</p>
                                                <p className={`text-lg font-black ${seatLeft < 5 ? 'text-red-500' : 'text-green-500'}`}>{seatLeft}</p>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => !isJoined && setSelectedEvent(event)}
                                            disabled={isJoined || seatLeft <= 0}
                                            className={`w-full h-12 rounded-xl font-bold text-lg ${isJoined
                                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                                                : 'bg-white text-black hover:bg-gray-200'}`}
                                        >
                                            {isJoined ? "LIHAT TIKET" : (seatLeft <= 0 ? "FULL BOOKED" : "JOIN GAME")}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* CONFIRMATION DIALOG */}
            <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white">Konfirmasi Join</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Pastikan jadwal Anda sesuai. Saldo / Kuota (jika ada) akan terpotong.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEvent && (
                        <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Event</span>
                                <span className="font-bold text-white text-sm">{selectedEvent.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Waktu</span>
                                <span className="font-bold text-white text-sm">{selectedEvent.time}</span>
                            </div>
                            <div className="flex justify-between border-t border-white/5 pt-2">
                                <span className="text-gray-400 text-sm">Biaya</span>
                                <span className="font-bold text-[#ffbe00]">Rp {selectedEvent.price.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="rounded-xl text-gray-400 hover:text-white">Batal</Button>
                        <Button
                            onClick={handleJoin}
                            disabled={bookingLoading}
                            className="bg-[#ca1f3d] text-white hover:bg-[#a01830] rounded-xl font-bold px-8"
                        >
                            {bookingLoading ? "Proses..." : "GAS MABAR!"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
