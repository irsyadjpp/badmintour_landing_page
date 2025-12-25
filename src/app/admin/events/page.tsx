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
            avatar: 'https://ui-avatars.com/api/?name=Andi&background=0D0D0D&color=fff'
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
]

const days = [
    { day: 'SENIN', sessions: 2, active: true },
    { day: 'SELASA', sessions: 1, active: false },
    { day: 'RABU', sessions: 0, active: false },
    { day: 'KAMIS', sessions: 2, active: false },
    { day: 'JUMAT', sessions: 1, active: false },
    { day: 'SABTU', sessions: 3, active: false },
    { day: 'MINGGU', sessions: 1, active: false },
]

export default function SessionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getLevelClass = (level: string) => {
        switch(level) {
            case 'Intermediate': return 'bg-bad-yellow/20 text-yellow-700 border-bad-yellow/30';
            case 'Drilling Class': return 'bg-bad-green/20 text-green-700 border-bad-green/30';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }

    return (
        <main>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-bad-dark tracking-tighter mb-1">Session Master</h1>
                    <p className="text-gray-500 font-medium">Kelola template jadwal rutin & penugasan Host.</p>
                </div>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="px-8 py-4 h-auto rounded-full font-bold text-sm transition-all bg-bad-dark text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2">
                            <span className="bg-white/20 p-1 rounded-full"><Plus className="w-3 h-3" strokeWidth={3}/></span>
                            Buat Jadwal Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg rounded-[2.5rem] p-8">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-bad-dark mb-4">Jadwal Baru</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Hari</label>
                                    <Select defaultValue="Senin">
                                        <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 h-auto font-bold outline-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map(d => <SelectItem key={d.day} value={d.day}>{d.day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Jam Mulai</label>
                                    <Input type="time" className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-auto font-bold outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Lokasi / GOR</label>
                                <Input placeholder="Cth: GOR Koni Bandung" className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-auto font-bold outline-none focus:border-bad-dark" />
                            </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Level Skill</label>
                                <div className="flex gap-2 mt-1">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-2 rounded-xl border border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-green peer-checked:text-white peer-checked:border-bad-green transition">Beginner</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" defaultChecked />
                                        <div className="py-2 rounded-xl border border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-yellow peer-checked:text-black peer-checked:border-bad-yellow transition">Inter</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="level" className="peer sr-only" />
                                        <div className="py-2 rounded-xl border border-gray-200 text-center text-xs font-bold text-gray-500 peer-checked:bg-bad-blue peer-checked:text-white peer-checked:border-bad-blue transition">Advance</div>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Assign Host</label>
                                <Select>
                                    <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 h-auto font-bold outline-none">
                                        <SelectValue placeholder="Pilih Host" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="andi">Andi</SelectItem>
                                        <SelectItem value="budi">Budi</SelectItem>
                                        <SelectItem value="later">Pilih Nanti</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={() => { setIsModalOpen(false); alert('Jadwal dibuat!') }} className="w-full py-4 h-auto rounded-xl bg-bad-dark text-white font-black hover:bg-gray-800 mt-4 shadow-lg">
                                Simpan Template
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                    {days.map(d => (
                        <div key={d.day} className={`w-32 h-32 rounded-3xl p-4 flex flex-col justify-between border hover:border-bad-dark hover:text-bad-dark transition cursor-pointer ${d.active ? 'bg-bad-dark text-white scale-105 border-2 border-bad-yellow shadow-lg' : 'bg-white text-gray-400 border-gray-200'}`}>
                            <span className="text-xs font-bold uppercase">{d.day}</span>
                            <span className="text-4xl font-black">{d.sessions}</span>
                            <span className="text-[10px] font-bold">{d.sessions > 1 ? 'Sessions' : d.sessions === 1 ? 'Session' : 'Off Day'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-black text-2xl mb-6 flex items-center gap-2">
                    Jadwal Hari Senin
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-lg">2 Sesi Aktif</span>
                </h3>
                <div className="space-y-4">
                    {sessions.map(session => (
                        <div key={session.id} className={`bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:shadow-lg transition ${!session.isActive ? 'opacity-50 grayscale' : ''}`}>
                            <div className="flex flex-col items-center md:items-start min-w-[120px]">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase mb-1 ${getLevelClass(session.level)}`}>{session.level}</span>
                                <h4 className="text-3xl font-black text-bad-dark">{session.startTime}</h4>
                                <p className="text-sm font-bold text-gray-400">{session.endTime}</p>
                            </div>

                            <div className="flex-1 w-full text-center md:text-left border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                                <h3 className="font-bold text-xl text-bad-dark">{session.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
                                    <MapPin className="w-4 h-4" /> {session.details}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex items-center gap-2">
                                    <Image src={session.host.avatar} alt={session.host.name} width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Host</p>
                                        <p className="text-xs font-bold text-bad-dark">{session.host.name}</p>
                                    </div>
                                </div>
                                <Switch id={`toggle-${session.id}`} defaultChecked={session.isActive} />
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-bad-dark hover:text-white transition">
                                    <Pencil className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
