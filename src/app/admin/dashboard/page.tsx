'use client';

import { Bell, Wallet, Users, Clock, Flame, Ticket, UserPlus, Tv, Search } from 'lucide-react';
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
        
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selasa, 24 Agustus 2025</p>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Business Overview</h1>
            </div>
            
            <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-10">
            
            <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#1A1A1A] to-black rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Income (August)</p>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-yellow-500">
                        <span className="text-lg">💰</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2">Rp 15.420.000</h2>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">+12.5% vs bulan lalu</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-24 px-8 flex items-end justify-between gap-2 opacity-30">
                    <div className="w-full bg-gray-600 rounded-t-lg h-[30%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-gray-600 rounded-t-lg h-[50%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-gray-600 rounded-t-lg h-[40%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-gray-600 rounded-t-lg h-[70%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-gray-600 rounded-t-lg h-[50%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-bad-yellow rounded-t-lg h-[90%] shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all duration-300 hover:opacity-80"></div> 
                    <div className="w-full bg-gray-600 rounded-t-lg h-[60%] transition-all duration-300 hover:opacity-80"></div>
                    <div className="w-full bg-gray-600 rounded-t-lg h-[45%] transition-all duration-300 hover:opacity-80"></div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                
                <div className="bg-white text-black p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Members</p>
                    <h3 className="text-4xl font-black">1,204</h3>
                </div>

                <div className="bg-white text-black p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Today</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Occupancy</p>
                    <h3 className="text-4xl font-black">85%</h3>
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
                    <div className="bg-white text-black p-5 rounded-[2rem] relative overflow-hidden group">
                        <span className="absolute top-4 right-4 bg-red-100 text-red-500 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">• On Match</span>
                        <div className="h-24 flex items-center justify-center mb-2">
                            <span className="text-4xl">🏸</span>
                        </div>
                        <h4 className="text-xl font-black">Court 01</h4>
                        <p className="text-xs font-bold text-gray-400 mb-2">Host: GOR Koni</p>
                        <div className="flex -space-x-2">
                            {courtAvatars.map((avatar, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"><Image src={avatar.src} alt={avatar.name} width={24} height={24} className='rounded-full'/></div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white text-black p-5 rounded-[2rem] relative overflow-hidden group">
                        <span className="absolute top-4 right-4 bg-green-100 text-green-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">Available</span>
                        <div className="h-24 flex items-center justify-center mb-2">
                            <span className="text-4xl opacity-50 grayscale group-hover:grayscale-0 transition">✨</span>
                        </div>
                        <h4 className="text-xl font-black">Court 02</h4>
                        <p className="text-xs font-bold text-gray-400 mb-4">Host: GOR Koni</p>
                        <button className="w-full py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800">Book Manual</button>
                    </div>

                    <div className="bg-gray-800 text-gray-400 p-5 rounded-[2rem] relative overflow-hidden">
                        <div className="h-24 flex items-center justify-center mb-2">
                            <span className="text-4xl opacity-30">🚧</span>
                        </div>
                        <h4 className="text-xl font-black text-gray-300">Court 03</h4>
                        <p className="text-xs font-bold text-gray-500 mb-2">Est. Ready: 18:00</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <h3 className="text-xl font-black text-white mb-6">Recent Activity</h3>
                
                <div className="bg-white text-black p-6 rounded-[2.5rem] h-full">
                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                           <div key={index} className="flex gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                                   <activity.icon className="w-5 h-5"/>
                               </div>
                               <div>
                                   <p className="text-sm font-bold leading-tight">
                                     {activity.isNew ? activity.action : ''} <span className="font-black">{activity.user}</span> {!activity.isNew ? activity.action : ''}
                                   </p>
                                   <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{activity.time}</p>
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
