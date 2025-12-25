'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { Plus } from 'lucide-react';

const sessions = [
    {
        id: 1,
        level: 'Intermediate',
        startTime: '19:00',
        endTime: '22:00 WIB',
        title: 'Mabar Rutin Senin (GOR Koni)',
        details: 'Lapangan 1, 2, 3 • Max 18 Slot',
        host: { name: 'Andi', avatar: 'https://ui-avatars.com/api/?name=Andi&background=000&color=fff' },
        isActive: true
    },
    {
        id: 2,
        level: 'Drilling Class',
        startTime: '17:00',
        endTime: '19:00 WIB',
        title: 'Kelas Pemula (Coach Budi)',
        details: 'Lapangan 4 • Max 6 Slot',
        host: { name: 'Budi', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random' },
        isActive: false
    },
];

const days = [
    { day: 'SENIN', sessions: 2, active: true },
    { day: 'SELASA', sessions: 1, active: false },
    { day: 'RABU', sessions: 0, active: false },
    { day: 'KAMIS', sessions: 2, active: false },
    { day: 'JUMAT', sessions: 1, active: false },
    { day: 'SABTU', sessions: 3, active: false },
    { day: 'MINGGU', sessions: 1, active: false },
];

export default function SessionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getLevelClass = (level: string) => {
        switch(level) {
            case 'Intermediate': return 'bg-bad-yellow/10 text-bad-yellow border border-bad-yellow/20';
            case 'Drilling Class': return 'bg-bad-green/10 text-bad-green border border-bad-green/20';
            default: return 'bg-white/10 text-gray-400';
        }
    };

    return (
        <main>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Sessions</h1>
                    <p className="text-gray-400 mt-2 font-medium">Jadwal latihan & mabar.</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] h-auto flex items-center gap-2">
                           <Plus className="w-4 h-4"/> Jadwal Baru
                        </Button>
                    </DialogTrigger>
                    {/* Dark Modal */}
                    <DialogContent className="sm:max-w-lg bg-[#1A1A1A] border border-white/10 rounded-[2rem] p-8 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Jadwal Baru</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Hari</label>
                                    <Select>
                                        <SelectTrigger className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto">
                                            <SelectValue placeholder="Senin" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                            {days.map(d => <SelectItem key={d.day} value={d.day} className="focus:bg-white/10 focus:text-white cursor-pointer">{d.day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Jam Mulai</label>
                                    <Input type="time" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none h-auto" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Lokasi / GOR</label>
                                <Input placeholder="Cth: GOR Koni Bandung" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 font-bold text-white outline-none focus:border-bad-yellow h-auto placeholder:text-gray-600" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Level Skill</label>
                                <div className="flex gap-2 mt-2">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-3 rounded-xl border border-white/10 bg-[#121212] text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-green/20 peer-checked:text-bad-green peer-checked:border-bad-green transition">Beginner</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" defaultChecked />
                                        <div className="py-3 rounded-xl border border-white/10 bg-[#121212] text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-yellow/20 peer-checked:text-bad-yellow peer-checked:border-bad-yellow transition">Inter</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-3 rounded-xl border border-white/10 bg-[#121212] text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-blue/20 peer-checked:text-bad-blue peer-checked:border-bad-blue transition">Advance</div>
                                    </label>
                                </div>
                            </div>
                            <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-4 h-auto rounded-xl bg-white text-black font-black hover:bg-gray-200 mt-6">
                                Simpan Template
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {days.map(d => (
                     <div key={d.day} className={`min-w-[8rem] h-32 rounded-3xl p-4 flex flex-col justify-between border transition-all duration-300 hover:scale-105 cursor-pointer ${d.active ? 'bg-[#1A1A1A] border-bad-yellow shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-[#121212] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${d.active ? 'text-bad-yellow' : 'text-gray-500'}`}>{d.day}</span>
                        <span className={`text-5xl font-jersey ${d.active ? 'text-white': 'text-gray-600'}`}>{d.sessions}</span>
                        <span className={`text-[10px] font-bold ${d.sessions > 0 ? 'text-gray-400' : 'text-gray-600'}`}>{d.sessions > 1 ? 'Sessions' : d.sessions === 1 ? 'Session' : 'Off Day'}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-black text-white mb-4">Jadwal Hari Ini</h3>
                {sessions.map(session => (
                    <div key={session.id} className={`bg-[#1A1A1A] border border-white/5 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-white/10 transition ${!session.isActive ? 'opacity-50' : ''}`}>
                        <div className="min-w-[120px]">
                            <span className={`${getLevelClass(session.level)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider`}>{session.level}</span>
                            <h4 className="text-4xl font-jersey text-white mt-2">{session.startTime}</h4>
                            <p className="text-xs font-bold text-gray-500">{session.endTime}</p>
                        </div>
                        <div className="flex-1 md:border-l md:border-white/10 md:pl-8">
                            <h3 className="font-bold text-xl text-white">{session.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{session.details}</p>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex items-center gap-3 bg-[#121212] p-2 pr-4 rounded-full border border-white/5">
                                <Image src={session.host.avatar} alt={session.host.name} width={40} height={40} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition" />
                                <div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase">Host</p>
                                    <p className="text-xs font-bold text-white">{session.host.name}</p>
                                </div>
                            </div>
                            <Switch id={`toggle-${session.id}`} checked={session.isActive} className="data-[state=checked]:bg-bad-green" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
