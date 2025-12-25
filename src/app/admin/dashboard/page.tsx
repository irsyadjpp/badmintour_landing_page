'use client';

import { Bell, Wallet, Users, Clock, Flame, Ticket, UserPlus, Tv, Search, Dumbbell, CheckCircle2, Construction } from 'lucide-react';
import Image from 'next/image';

const courtAvatars = [
    { name: 'A', src: 'https://ui-avatars.com/api/?name=A&background=random' },
    { name: 'B', src: 'https://ui-avatars.com/api/?name=B&background=random' },
    { name: 'C', src: 'https://ui-avatars.com/api/?name=C&background=random' },
]

const recentActivities = [
    { icon: Flame, color: "text-blue-500 bg-blue-50", user: "Kevin.S", action: "claimed Jersey", time: "2 mins ago" },
    { icon: Wallet, color: "text-green-500 bg-green-50", user: "Budi", action: "paid Rp 35k", time: "15 mins ago" },
    { icon: UserPlus, color: "text-gray-500 bg-gray-100", user: "Siti.A", action: "New User:", time: "1 hour ago", isNew: true },
]

export default function AdminDashboard() {
  return (
    <main>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-xs font-bold text-bad-blue uppercase tracking-widest mb-1">
                    Selasa, 24 Agustus 2025
                </p>
                {/* Gunakan tracking-tighter untuk kesan modern padat */}
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Overview</span>
                </h1>
            </div>
            {/* Tombol notifikasi glassmorphism */}
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-bad-red rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)]"></span>
            </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 mb-10">
            
            {/* Income Card - Dark with Neon Accent */}
            <div className="col-span-12 lg:col-span-8 bg-[#151515] rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl">
                {/* Background Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-bad-yellow/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <Wallet className="w-6 h-6 text-bad-yellow"/>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-bad-green/10 text-bad-green text-xs font-bold border border-bad-green/20">
                            +12.5% vs Last Month
                        </span>
                   </div>
                   
                   <p className="text-gray-400 text-sm font-medium mb-1">Total Income (August)</p>
                   {/* FONT JERSEY UNTUK ANGKA */}
                   <h2 className="text-6xl font-jersey text-white tracking-wide mb-8">
                       Rp 15.420.000
                   </h2>
                </div>

                {/* Grafik Batang yang diperbaiki visualnya */}
                <div className="absolute bottom-0 left-0 right-0 h-32 px-8 flex items-end justify-between gap-3">
                    {/* Loop bar dummy dengan styling neon */}
                    {[30, 50, 40, 70, 50, 90, 60, 45].map((h, i) => (
                        <div key={i} className="w-full bg-white/5 rounded-t-lg relative group h-full flex items-end overflow-hidden">
                             <div 
                                style={{ height: `${h}%` }}
                                className={`w-full rounded-t-sm transition-all duration-500 ease-out 
                                    ${i === 5 
                                        ? 'bg-bad-yellow shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                                        : 'bg-white/20 group-hover:bg-bad-yellow/50'
                                    }`}
                             ></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stat Cards - Vertical Stack */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                
                {/* Members Card - Dark theme */}
                <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative group hover:border-bad-blue/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-bad-blue/10 text-bad-blue rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6"/>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-jersey text-white mb-1 group-hover:text-bad-blue transition-colors">1,204</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Registered Members</p>
                    </div>
                </div>

                {/* Occupancy Card */}
                <div className="bg-[#1A1A1A] p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative group hover:border-bad-red/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-bad-red/10 text-bad-red rounded-2xl flex items-center justify-center">
                            <Clock className="w-6 h-6"/>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-4xl font-jersey text-white mb-1 group-hover:text-bad-red transition-colors">85%</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg. Occupancy Today</p>
                    </div>
                </div>

            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white">Live Court Status</h3>
                    <button className="text-xs font-bold text-gray-400 flex items-center gap-2 hover:text-white">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Lihat CCTV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#1A1A1A] text-white p-5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <span className="absolute top-4 right-4 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-red-500/30">• On Match</span>
                        <div className="h-24 flex items-center justify-center mb-2">
                            <Dumbbell className="w-12 h-12 text-white/10 group-hover:text-red-400 transition-colors" />
                        </div>
                        <h4 className="text-xl font-jersey text-white">Court 01</h4>
                        <p className="text-xs font-bold text-gray-500 mb-2">Host: GOR Koni</p>
                        <div className="flex -space-x-2">
                            {courtAvatars.map((avatar, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-black"><Image src={avatar.src} alt={avatar.name} width={24} height={24} className='rounded-full'/></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1A1A1A] text-white p-5 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <CheckCircle2 className="w-20 h-20 text-bad-green/10 absolute -bottom-4 -right-4 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                        <span className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-green-500/30">Available</span>
                        <div className="h-24 flex items-center justify-center mb-2 relative z-10">
                            {/* Can be empty or have another subtle icon */}
                        </div>
                        <h4 className="text-xl font-jersey text-white relative z-10">Court 02</h4>
                        <p className="text-xs font-bold text-gray-500 mb-4 relative z-10">Host: GOR Koni</p>
                        <button className="w-full py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 relative z-10 border border-white/10">Book Manual</button>
                    </div>

                    <div className="bg-black/40 text-gray-400 p-5 rounded-[2rem] relative overflow-hidden border border-dashed border-white/10">
                        <Construction className="w-16 h-16 text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
                        <div className="h-24 flex items-center justify-center mb-2">
                           {/* Empty */}
                        </div>
                        <h4 className="text-xl font-jersey text-gray-500">Court 03</h4>
                        <p className="text-xs font-bold text-gray-600 mb-2">Est. Ready: 18:00</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <h3 className="text-xl font-black text-white mb-6">Recent Activity</h3>
                
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] h-full border border-white/5">
                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                           <div key={index} className="flex gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/5 border border-white/10`}>
                                   <activity.icon className="w-5 h-5 text-gray-400"/>
                               </div>
                               <div>
                                   <p className="text-sm font-bold leading-tight text-gray-300">
                                     {activity.isNew ? activity.action : ''} <span className="font-medium text-white">{activity.user}</span> {!activity.isNew ? activity.action : ''}
                                   </p>
                                   <p className="text-[10px] font-bold text-gray-500 uppercase mt-1">{activity.time}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}
