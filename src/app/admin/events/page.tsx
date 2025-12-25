'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { MapPin, Pencil, Plus } from 'lucide-react';

const sessions = [
    {
        id: 1,
        level: 'Intermediate',
        startTime: '19:00',
        endTime: '22:00 WIB',
        title: 'Mabar Rutin Senin (GOR Koni)',
        details: 'Lapangan 1, 2, 3 • Max 18 Slot',
        host: {
            name: 'Andi',
            avatar: 'https://ui-avatars.com/api/?name=Andi&background=000&color=fff'
        },
        isActive: true
    },
    {
        id: 2,
        level: 'Drilling Class',
        startTime: '17:00',
        endTime: '19:00 WIB',
        title: 'Kelas Pemula (Coach Budi)',
        details: 'Lapangan 4 • Max 6 Slot',
        host: {
            name: 'Budi',
            avatar: 'https://ui-avatars.com/api/?name=Budi&background=random'
        },
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
            case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
            case 'Drilling Class': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <main className="ml-28 mr-6 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tight">Sessions</h1>
                    <p className="text-gray-400 mt-2 font-medium">Jadwal latihan & mabar.</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-lg h-auto flex items-center gap-2">
                           <Plus className="w-4 h-4"/> Jadwal Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg bg-white rounded-[2rem] p-8 text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Jadwal Baru</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Hari</label>
                                    <Select>
                                        <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto">
                                            <SelectValue placeholder="Senin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map(d => <SelectItem key={d.day} value={d.day}>{d.day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Jam Mulai</label>
                                    <Input type="time" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Lokasi / GOR</label>
                                <Input placeholder="Cth: GOR Koni Bandung" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none focus:border-black h-auto" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Level Skill</label>
                                <div className="flex gap-2 mt-1">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-2 rounded-xl border-2 border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-green peer-checked:text-white peer-checked:border-bad-green transition">Beginner</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" defaultChecked />
                                        <div className="py-2 rounded-xl border-2 border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-yellow peer-checked:text-black peer-checked:border-bad-yellow transition">Inter</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-2 rounded-xl border-2 border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-blue peer-checked:text-white peer-checked:border-bad-blue transition">Advance</div>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Assign Host</label>
                                <Select>
                                    <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold outline-none h-auto">
                                        <SelectValue placeholder="Pilih Host" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="andi">Andi</SelectItem>
                                        <SelectItem value="budi">Budi</SelectItem>
                                        <SelectItem value="later">Pilih Nanti</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-4 h-auto rounded-xl bg-black text-white font-black hover:bg-gray-800 mt-4 shadow-lg">
                                Simpan Template
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
                {days.map(d => (
                     <div key={d.day} className={`min-w-[8rem] h-32 rounded-3xl p-4 flex flex-col justify-between border-2 transition hover:scale-105 cursor-pointer ${d.active ? 'bg-gray-800 text-white border-bad-yellow shadow-lg' : 'bg-white text-black border-gray-200 opacity-80 hover:opacity-100'}`}>
                        <span className={`text-xs font-bold uppercase ${d.active ? 'text-gray-400' : 'text-gray-400'}`}>{d.day}</span>
                        <span className={`text-4xl font-black ${d.active ? 'text-bad-yellow': ''}`}>{d.sessions}</span>
                        <span className={`text-[10px] font-bold ${d.sessions > 0 ? '' : 'text-gray-400'}`}>{d.sessions > 1 ? 'Sessions' : d.sessions === 1 ? 'Session' : 'Off Day'}</span>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-black text-white mb-2">Jadwal Hari Ini</h3>
                {sessions.map(session => (
                    <div key={session.id} className={`bg-white text-black p-6 rounded-[2.5rem] flex items-center gap-6 ${!session.isActive ? 'opacity-50' : ''}`}>
                        <div className="min-w-[100px]">
                            <span className={`${getLevelClass(session.level)} px-3 py-1 rounded-lg text-[10px] font-black uppercase`}>{session.level}</span>
                            <h4 className="text-3xl font-black mt-1">{session.startTime}</h4>
                            <p className="text-xs font-bold text-gray-400">{session.endTime}</p>
                        </div>
                        <div className="flex-1 border-l border-gray-100 pl-6">
                            <h3 className="font-bold text-xl">{session.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{session.details}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Image src={session.host.avatar} alt={session.host.name} width={40} height={40} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Host</p>
                                    <p className="text-xs font-bold">{session.host.name}</p>
                                </div>
                            </div>
                            <Switch id={`toggle-${session.id}`} defaultChecked={session.isActive} />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
