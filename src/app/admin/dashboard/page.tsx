'use client';

import { 
    Bell, 
    Wallet, 
    Users, 
    Clock, 
    Flame, 
    UserPlus, 
    Dumbbell,
    CheckCircle2,
    Construction
} from 'lucide-react';
import Image from 'next/image';

const courtAvatars = [
    { name: 'A', src: 'https://ui-avatars.com/api/?name=A&background=random' },
    { name: 'B', src: 'https://ui-avatars.com/api/?name=B&background=random' },
    { name: 'C', src: 'https://ui-avatars.com/api/?name=C&background=random' },
]

const recentActivities = [
    { icon: Flame, color: "text-bad-blue bg-bad-blue/10 border border-bad-blue/20", user: "Kevin.S", action: "claimed Jersey", time: "2 mins ago" },
    { icon: Wallet, color: "text-bad-green bg-bad-green/10 border border-bad-green/20", user: "Budi", action: "paid Rp 35k", time: "15 mins ago" },
    { icon: UserPlus, color: "text-gray-400 bg-white/5 border border-white/10", user: "Siti.A", action: "New User:", time: "1 hour ago", isNew: true },
]

export default function AdminDashboard() {
  return (
    <main>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
            <div>
                <p className="text-xs font-bold text-bad-blue uppercase tracking-widest mb-1">Selasa, 24 Agustus 2025</p>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Overview</span>
                </h1>
            </div>
            
            {/* Notification Button: Glass style */}
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition relative group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-bad-red rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)] animate-pulse"></span>
            </button>
        </div>

        {/* Bento Grid: Stats & Income */}
        <div className="grid grid-cols-12 gap-6 mb-10">
            
            {/* Income Card: Dark Theme with Neon Accents */}
            <div className="col-span-12 lg:col-span-8 bg-[#151515] rounded-[2.5rem] p-8 relative overflow-hidden border border-white/5 shadow-2xl group">
                {/* Background ambient glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-bad-yellow/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-bad-yellow/20 transition duration-700"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-bad-yellow/10 border border-bad-yellow/20 flex items-center justify-center text-bad-yellow">
                            <Wallet className="w-5 h-5"/>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Income (August)</p>
                    </div>
                    <span className="bg-bad-green/10 text-bad-green px-3 py-1 rounded-full text-xs font-bold border border-bad-green/20 flex items-center gap-1">
                        +12.5% <span className="opacity-50 font-normal text-[10px]">vs last month</span>
                    </span>
                </div>

                <div className="relative z-10 mb-8">
                    {/* FONT JERSEY UNTUK ANGKA */}
                    <h2 className="text-6xl md:text-7xl font-jersey text-white tracking-wide mb-2 drop-shadow-lg">
                        Rp 15.420.000
                    </h2>
                </div>

                {/* Animated Bars */}
                <div className="absolute bottom-0 left-0 right-0 h-28 px-8 flex items-end justify-between gap-3 opacity-80">
                    {[35, 55, 45, 75, 55, 95, 65, 50].map((height, i) => (
                         <div key={i} className="w-full h-full flex items-end relative group/bar">
                            <div 
                                style={{ height: `${height}%` }}
                                className={`w-full rounded-t-sm transition-all duration-500 ease-out 
                                ${i === 5 
                                    ? 'bg-bad-yellow shadow-[0_0_20px_rgba(250,204,21,0.4)]' 
                                    : 'bg-white/10 hover:bg-white/30'
                                }`}
                            ></div>
                         </div>
                    ))}
                </div>
            </div>

            {/* Side Stats: Dark Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                
                {/* Members Card */}
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-bad-blue/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-bad-blue/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-bad-blue/10 transition"></div>
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="w-10 h-10 bg-bad-blue/10 text-bad-blue border border-bad-blue/20 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Total</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-blue transition-colors">1,204</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Registered Members</p>
                    </div>
                </div>

                {/* Occupancy Card */}
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] flex-1 flex flex-col justify-center border border-white/5 relative overflow-hidden group hover:border-bad-red/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-bad-red/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-bad-red/10 transition"></div>

                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="w-10 h-10 bg-bad-red/10 text-bad-red border border-bad-red/20 rounded-xl flex items-center justify-center">
                            <Clock className="w-5 h-5"/>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase border border-white/5 px-2 py-1 rounded-md">Today</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-5xl font-jersey font-normal mb-1 group-hover:text-bad-red transition-colors">85%</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avg. Occupancy</p>
                    </div>
                </div>

            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Court Status Section */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        Live Court Status <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
                    </h3>
                    <button className="text-xs font-bold text-gray-400 flex items-center gap-2 hover:text-white transition">
                        View CCTV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Court 01: On Match */}
                    <div className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-bad-red/20 relative overflow-hidden group hover:bg-[#202020] transition">
                        <span className="absolute top-4 right-4 bg-bad-red/10 text-bad-red border border-bad-red/20 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider animate-pulse">
                            • On Match
                        </span>
                        <div className="h-24 flex items-center justify-center mb-2 relative">
                            {/* Ganti Emoji dengan Icon Lucide */}
                            <Dumbbell className="w-16 h-16 text-white/5 group-hover:text-bad-red/10 transition-colors duration-300 absolute"/>
                            <div className="flex -space-x-3 relative z-10 mt-4">
                                {courtAvatars.map((avatar, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#1A1A1A]">
                                        <Image src={avatar.src} alt={avatar.name} width={32} height={32} className='rounded-full'/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <h4 className="text-2xl font-jersey text-white">Court 01</h4>
                        <p className="text-xs font-bold text-gray-500">Host: GOR Koni</p>
                    </div>

                    {/* Court 02: Available */}
                    <div className="bg-[#1A1A1A] p-5 rounded-[2rem] border border-bad-green/20 relative overflow-hidden group hover:bg-[#202020] transition">
                        <span className="absolute top-4 right-4 bg-bad-green/10 text-bad-green border border-bad-green/20 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                            Available
                        </span>
                        <div className="h-24 flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-16 h-16 text-bad-green/20 group-hover:scale-110 transition-transform duration-300"/>
                        </div>
                        <h4 className="text-2xl font-jersey text-white">Court 02</h4>
                        <p className="text-xs font-bold text-gray-500 mb-4">Host: GOR Koni</p>
                        <button className="w-full py-2 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-200 transition">Book Manual</button>
                    </div>

                    {/* Court 03: Maintenance */}
                    <div className="bg-[#121212] p-5 rounded-[2rem] border border-white/5 relative overflow-hidden opacity-60 hover:opacity-100 transition">
                        <div className="h-24 flex items-center justify-center mb-2">
                            <Construction className="w-16 h-16 text-white/10"/>
                        </div>
                        <h4 className="text-2xl font-jersey text-gray-500">Court 03</h4>
                        <p className="text-xs font-bold text-gray-600 mb-2">Est. Ready: 18:00</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="lg:col-span-1">
                <h3 className="text-xl font-black text-white mb-6">Recent Activity</h3>
                
                <div className="bg-[#1A1A1A] text-white p-6 rounded-[2.5rem] h-full border border-white/5">
                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                           <div key={index} className="flex gap-4 group cursor-default">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${activity.color}`}>
                                   <activity.icon className="w-5 h-5"/>
                               </div>
                               <div>
                                   <p className="text-sm font-medium leading-tight text-gray-300">
                                     {activity.isNew ? activity.action : ''} <span className="font-bold text-white">{activity.user}</span> {!activity.isNew ? activity.action : ''}
                                   </p>
                                   <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">{activity.time}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                    
                    <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition">
                        View All History
                    </button>
                </div>
            </div>
        </div>
    </main>
  );
}
