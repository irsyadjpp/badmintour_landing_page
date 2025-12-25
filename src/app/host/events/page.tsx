'use client';

import { useState } from 'react';
import { 
    CalendarPlus, 
    Search, 
    Filter, 
    MoreVertical, 
    Copy, 
    Users, 
    Edit, 
    Trash2,
    MapPin,
    Clock,
    Lock,
    Zap,
    PlusCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

export default function HostEventsPage() {
    // Mock Data Events
    const [events, setEvents] = useState([
        { 
            id: 1, 
            title: "Mabar Senin Ceria", 
            date: "Senin, 05 Jan 2026", 
            time: "19:00 - 22:00", 
            location: "Court 1-3", 
            price: "Rp 35.000",
            participants: 8,
            maxParticipants: 12,
            level: "All Level",
            status: "Open",
            features: ["Dynamic Pricing", "Waitlist"]
        },
        { 
            id: 2, 
            title: "Sparring Night: Squad Only", 
            date: "Rabu, 07 Jan 2026", 
            time: "20:00 - 23:00", 
            location: "Court 5", 
            price: "Rp 150.000/Team",
            participants: 2,
            maxParticipants: 2,
            level: "Intermediate",
            status: "Full",
            features: ["Skill Lock"]
        },
    ]);

    // Guest Input State
    const [guestName, setGuestName] = useState("");

    const handleCloneEvent = (eventName: string) => {
        toast({
            title: "Event Cloned! 🚀",
            description: `Draft ${eventName} (Copy) berhasil dibuat untuk minggu depan.`,
            className: "bg-blue-600 text-white border-none"
        });
    };

    const handleAddGuest = () => {
        toast({
            title: "Guest Added",
            description: `${guestName} berhasil ditambahkan manual. Kuota terupdate.`,
            className: "bg-green-600 text-white border-none"
        });
        setGuestName("");
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Event <span className="text-[#ca1f3d]">Manager</span></h1>
                    <p className="text-gray-400 mt-2">Atur jadwal, harga, dan peserta dalam satu tempat.</p>
                </div>
                <Link href="/host/events/create">
                    <Button className="h-12 px-6 rounded-xl bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black shadow-[0_0_20px_rgba(202,31,61,0.4)] hover:scale-105 transition-transform">
                        <CalendarPlus className="w-5 h-5 mr-2" /> BUAT EVENT BARU
                    </Button>
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-[#151515] p-2 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input placeholder="Cari event..." className="bg-transparent border-none pl-10 text-white h-10" />
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <Button variant="ghost" className="text-[#ffbe00] hover:text-black hover:bg-[#ffbe00] rounded-xl font-bold">
                        Active (2)
                    </Button>
                </div>
            </div>

            {/* Event List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="group bg-[#151515] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#ca1f3d]/30 rounded-[2rem] p-6 transition-all duration-300 relative overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <Badge className={`${event.status === 'Full' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'} border-0 font-black uppercase tracking-wider`}>
                                {event.status}
                            </Badge>
                        </div>

                        {/* Title & Info */}
                        <div className="mb-6">
                            <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#ca1f3d] transition-colors">{event.title}</h3>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#ca1f3d]" /> {event.date} • {event.time}
                                </p>
                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#ca1f3d]" /> {event.location}
                                </p>
                            </div>
                        </div>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Badge variant="outline" className="border-white/10 text-gray-400 text-[10px]">{event.level}</Badge>
                            {event.features.includes("Dynamic Pricing") && (
                                <Badge variant="outline" className="border-yellow-500/20 text-yellow-500 text-[10px] flex gap-1 items-center"><Zap className="w-3 h-3"/> Dynamic Price</Badge>
                            )}
                            {event.features.includes("Skill Lock") && (
                                <Badge variant="outline" className="border-red-500/20 text-red-500 text-[10px] flex gap-1 items-center"><Lock className="w-3 h-3"/> Locked</Badge>
                            )}
                        </div>

                        {/* Progress Bar Participants */}
                        <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Kuota Terisi</span>
                                <span className="text-xs font-bold text-white">{event.participants}/{event.maxParticipants}</span>
                            </div>
                            <div className="w-full bg-[#222] rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-[#ca1f3d] h-full rounded-full" 
                                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            {/* Manual Input Dialog */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 hover:text-white text-gray-400 rounded-xl h-10 text-xs font-bold">
                                        <PlusCircle className="w-3 h-3 mr-2" /> Guest Input
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Input Peserta Manual</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Masukkan peserta offline/manual. Kuota aplikasi akan berkurang otomatis.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Nama Peserta / Keterangan</Label>
                                            <Input 
                                                placeholder="Contoh: Teman Budi (Cash)" 
                                                className="bg-[#0a0a0a] border-white/10 text-white"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                            <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                                            <span className="text-xs text-yellow-500">Status pembayaran otomatis diset "LUNAS (Manual)".</span>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddGuest} className="w-full bg-[#ca1f3d] hover:bg-[#a01830] text-white font-bold">
                                            Tambahkan Peserta
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-white/10 text-gray-400">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white w-48">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleCloneEvent(event.title)} className="focus:bg-blue-600 focus:text-white cursor-pointer">
                                        <Copy className="w-4 h-4 mr-2" /> Clone Last Week
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                        <Edit className="w-4 h-4 mr-2" /> Edit Detail
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                        <Users className="w-4 h-4 mr-2" /> Manage Players
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                        <Trash2 className="w-4 h-4 mr-2" /> Cancel Event
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}

                {/* Clone Placeholder Card */}
                <div onClick={() => handleCloneEvent("Template")} className="border-2 border-dashed border-white/10 hover:border-[#ca1f3d]/50 rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer transition-all group h-full min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#ca1f3d]/10 flex items-center justify-center mb-4 transition-colors">
                        <Copy className="w-8 h-8 text-gray-500 group-hover:text-[#ca1f3d]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-500 group-hover:text-[#ca1f3d]">Clone From Template</h3>
                    <p className="text-xs text-gray-600 text-center mt-2 max-w-[200px]">Buat event cepat menggunakan settingan minggu lalu.</p>
                </div>
            </div>
        </div>
    );
}
