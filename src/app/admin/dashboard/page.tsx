'use client';

import { Bell, Wallet, Users, Clock, Flame, Ticket, UserPlus, Tv } from 'lucide-react';
import Image from 'next/image';

const courtAvatars = [
    { name: 'A', src: 'https://ui-avatars.com/api/?name=A&background=random' },
    { name: 'B', src: 'https://ui-avatars.com/api/?name=B&background=random' },
    { name: 'C', src: 'https://ui-avatars.com/api/?name=C&background=random' },
    { name: 'D', src: 'https://ui-avatars.com/api/?name=D&background=random' },
]

const recentActivities = [
    { icon: Flame, color: "text-blue-600 bg-blue-50", user: "Kevin.S", action: "claimed Jersey", time: "2 mins ago" },
    { icon: Wallet, color: "text-green-600 bg-green-50", user: "Budi", action: "paid Rp 35k", time: "15 mins ago" },
    { icon: UserPlus, color: "text-gray-500 bg-gray-100", user: "Siti.A", action: "New User:", time: "1 hour ago", isNew: true },
]


export default function AdminDashboard() {
  return (
    <main className="transition-all duration-500">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selasa, 24 Agustus 2025</p>
                <h1 className="text-4xl font-black text-bad-dark tracking-tight">Business Overview</h1>
            </div>
            <div className="flex gap-3">
                <button className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition relative">
                    <Bell className="w-6 h-6 text-gray-500" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-bad-red rounded-full"></span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            
            <div className="md:col-span-8 bg-bad-dark text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-bad-red/20 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:scale-125 transition duration-1000"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Income (August)</p>
                            <h2 className="text-5xl md:text-6xl font-black mt-2 tracking-tight">Rp 15.420.000</h2>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg">+12.5% vs bulan lalu</span>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">💰</div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-end h-24 gap-2 opacity-50">
                            <div className="w-full bg-white/20 rounded-t-lg h-[40%]"></div>
                            <div className="w-full bg-white/20 rounded-t-lg h-[60%]"></div>
                            <div className="w-full bg-white/20 rounded-t-lg h-[30%]"></div>
                            <div className="w-full bg-white/20 rounded-t-lg h-[80%]"></div>
                            <div className="w-full bg-accent rounded-t-lg h-[95%] relative group/bar">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition">Peak</div>
                            </div>
                            <div className="w-full bg-white/20 rounded-t-lg h-[50%]"></div>
                            <div className="w-full bg-white/20 rounded-t-lg h-[70%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm flex-1 hover:-translate-y-1 transition duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6"/>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">Total</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase">Registered Members</p>
                    <p className="text-4xl font-black text-bad-dark">1,204</p>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm flex-1 hover:-translate-y-1 transition duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-10 h-10 bg-bad-red/10 text-bad-red rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6"/>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">Today</span>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase">Avg. Occupancy</p>
                    <p className="text-4xl font-black text-bad-dark">85%</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <div className="md:col-span-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-bad-dark">Live Court Status</h2>
                    <a href="#" className="text-sm font-bold text-gray-400 hover:text-bad-dark flex items-center gap-2">
                        <Tv className="w-4 h-4"/> Lihat CCTV
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-3xl border border-gray-200 relative overflow-hidden group">
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-50 text-bad-red px-2 py-1 rounded-lg text-[10px] font-bold uppercase border border-red-100">
                            <span className="w-2 h-2 bg-bad-red rounded-full animate-pulse"></span> On Match
                        </div>
                        <div className="h-24 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center text-4xl">🏸</div>
                        <h3 className="font-black text-lg">Court 01</h3>
                        <p className="text-xs text-gray-500 font-bold mb-3">Host: GOR Koni</p>
                        <div className="flex -space-x-2">
                            {courtAvatars.map(avatar => (
                                <Image key={avatar.name} src={avatar.src} alt={avatar.name} width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white"/>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-3xl border border-gray-200 relative overflow-hidden group hover:border-green-500 transition">
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase border border-green-100">
                            Available
                        </div>
                        <div className="h-24 bg-green-500/10 rounded-2xl mb-4 flex items-center justify-center border border-dashed border-green-200 text-4xl opacity-30">✨</div>
                        <h3 className="font-black text-lg">Court 02</h3>
                        <p className="text-xs text-gray-500 font-bold mb-3">Host: GOR Koni</p>
                        <button className="w-full py-2 bg-bad-dark text-white rounded-xl text-xs font-bold hover:bg-green-600 transition">Book Manual</button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200 relative overflow-hidden opacity-75">
                         <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                            Maintenance
                        </div>
                        <div className="h-24 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-4xl grayscale">🚧</div>
                        <h3 className="font-black text-lg text-gray-500">Court 03</h3>
                        <p className="text-xs text-gray-400 font-bold mb-3">Est. Ready: 18:00</p>
                    </div>
                </div>
            </div>

            <div className="md:col-span-4">
                <h2 className="text-2xl font-black text-bad-dark mb-6">Recent Activity</h2>
                
                <div className="bg-white p-2 rounded-[2rem] border border-gray-200 shadow-sm">
                    <div className="space-y-1">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${activity.color}`}>
                                    <activity.icon className="w-5 h-5"/>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {activity.isNew ? activity.action : ''} <span className="font-black">{activity.user}</span> {!activity.isNew ? activity.action : ''}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full py-3 mt-2 text-xs font-bold text-gray-400 hover:text-bad-dark transition border-t border-gray-100">View All Logs</button>
                </div>
            </div>
        </div>
    </main>
  );
}
