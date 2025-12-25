
'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const events = [
    {
        id: 'BOS1',
        titleLine1: 'BANDUNG OPEN',
        titleLine2: 'SERIES I',
        status: 'Registration Open',
        statusColor: 'bg-bad-green',
        imageUrl: PlaceHolderImages.find((img) => img.id === 'tournament-banner-1')?.imageUrl || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1080",
        participants: 32,
        maxParticipants: 64,
        prizePool: '5 Jt',
        category: 'MD/XD',
        isDraft: false,
    },
    {
        id: 'MRS2',
        titleLine1: 'MABAR RAME',
        titleLine2: 'SPECIAL ED.',
        status: 'Draft Mode',
        statusColor: 'bg-gray-400',
        imageUrl: '',
        date: '12 Sep',
        location: 'GOR Koni',
        fee: '75k',
        description: 'Turnamen fun match khusus member intermediate ke bawah. Sistem gugur dengan...',
        isDraft: true,
    }
]

export default function EventsPage() {
  return (
    <main>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-bad-dark tracking-tight">Turnamen & Event</h1>
          <p className="text-gray-500 mt-1">Buat jadwal, atur bracket, dan kelola hadiah.</p>
        </div>
        
        <Button className="bg-accent text-black px-6 py-3 rounded-xl font-black hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/30 flex items-center gap-2 group h-auto">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Buat Turnamen Baru
        </Button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-1">
        <button className="pb-2 border-b-2 border-bad-dark font-bold text-bad-dark px-2">Active (2)</button>
        <button className="pb-2 border-b-2 border-transparent font-medium text-gray-400 hover:text-gray-600 px-2 transition">Upcoming</button>
        <button className="pb-2 border-b-2 border-transparent font-medium text-gray-400 hover:text-gray-600 px-2 transition">History</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {events.map((event) => (
            <div key={event.id} className="bg-white rounded-[2rem] p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 rounded-3xl bg-gray-800 relative overflow-hidden mb-6">
                    {event.imageUrl ? (
                        <Image src={event.imageUrl} alt={event.titleLine1} fill className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                    ) : (
                        <div className="h-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-3xl">
                             <div className="text-center">
                                <span className="text-4xl">🏆</span>
                                <p className="text-xs font-bold text-gray-400 uppercase mt-2">No Banner Image</p>
                            </div>
                        </div>
                    )}
                    
                    <div className={`absolute top-4 right-4 ${event.statusColor} text-white text-[10px] font-black uppercase px-3 py-1 rounded-full ${event.status === 'Registration Open' ? 'animate-pulse' : ''}`}>
                       {event.status !== 'Draft Mode' && "●"} {event.status}
                    </div>

                    <div className="absolute bottom-4 left-4">
                        <h2 className="text-2xl font-black text-white leading-none mb-1">
                            {event.titleLine1} <br/>
                            {!event.isDraft ? 
                                <span className="text-accent">{event.titleLine2}</span> :
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bad-red to-orange-500">{event.titleLine2}</span>
                            }
                        </h2>
                    </div>
                </div>

                {!event.isDraft ? (
                    <>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Peserta</p>
                                <p className="text-xl font-black text-bad-dark">{event.participants}<span className="text-xs text-gray-400 font-medium">/{event.maxParticipants}</span></p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Prize Pool</p>
                                <p className="text-xl font-black text-bad-blue">{event.prizePool}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Kategori</p>
                                <p className="text-xl font-black text-bad-dark">{event.category}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-500">Slot Terisi</span>
                                <span className="text-bad-dark">{event.participants && event.maxParticipants ? Math.round((event.participants / event.maxParticipants) * 100) : 0}%</span>
                            </div>
                            <Progress value={event.participants && event.maxParticipants ? (event.participants / event.maxParticipants) * 100 : 0} className="h-3 bg-gray-100" indicatorClassName="bg-bad-dark"/>
                        </div>

                        <div className="flex gap-3 border-t border-gray-100 pt-4">
                            <Button className="flex-1 py-3 h-auto rounded-xl bg-bad-dark text-white font-bold text-sm hover:bg-gray-800 transition">Kelola Bracket</Button>
                            <Button variant="outline" className="flex-1 py-3 h-auto rounded-xl border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition">Edit Info</Button>
                        </div>
                    </>
                ) : (
                     <>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Tanggal</p>
                                <p className="text-lg font-black text-bad-dark">{event.date}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Lokasi</p>
                                <p className="text-lg font-black text-bad-dark">{event.location}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Biaya</p>
                                <p className="text-lg font-black text-bad-dark">{event.fee}</p>
                            </div>
                        </div>
                        <div className="mb-6 h-10">
                            <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                        </div>
                         <div className="flex gap-3 border-t border-gray-100 pt-4">
                            <Button className="flex-1 py-3 h-auto rounded-xl bg-bad-green text-white font-bold text-sm hover:bg-green-600 transition shadow-lg shadow-green-200">Publish Event</Button>
                             <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-gray-200 text-gray-400 hover:text-bad-red hover:border-bad-red transition">
                                <Trash2 className="w-5 h-5"/>
                            </Button>
                        </div>
                    </>
                )}
            </div>
        ))}

      </div>
    </main>
  );
}
