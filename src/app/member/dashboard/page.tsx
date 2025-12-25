'use client';
import Link from 'next/link';
import { Shirt, Calendar, Rocket, QrCode } from 'lucide-react';

export default function MemberDashboard() {
  return (
    <main className="pt-36 pb-12 px-6 max-w-7xl mx-auto">
        
        <header className="bg-gradient-to-r from-bad-dark to-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl mb-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-125 duration-700"></div>

            <div className="relative z-10 text-center md:text-left mb-6 md:mb-0 w-full md:w-auto">
                <span className="bg-white/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-3 inline-block">
                    Member Area
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-2 leading-none">
                    SIAP MABAR, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">KEVIN?</span>
                </h1>
                <p className="text-gray-400 max-w-md mt-2 text-sm md:text-base">
                    Minggu ini performamu naik 20%. Pertahankan atau gas lagi di sesi drilling besok!
                </p>
            </div>

            <div className="flex gap-3 relative z-10 w-full md:w-auto justify-center md:justify-end">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-center flex-1 md:flex-none hover:bg-white/20 transition">
                    <span className="block text-3xl font-black text-accent">12</span>
                    <span className="text-[10px] text-gray-300 uppercase font-bold tracking-wider">Matches</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-center flex-1 md:flex-none hover:bg-white/20 transition">
                    <span className="block text-3xl font-black text-white">60%</span>
                    <span className="text-[10px] text-gray-300 uppercase font-bold tracking-wider">Win Rate</span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link href="/member/jersey" className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Limited</div>
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition text-2xl">
                    <Shirt size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-primary transition">Claim Jersey</h3>
                <p className="text-sm text-gray-500">Edisi terbatas Season 1.</p>
            </Link>

            <Link href="/#schedule" className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition text-2xl">
                    <Calendar size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition">Jadwal Mabar</h3>
                <p className="text-sm text-gray-500">Booking slot lapangan.</p>
            </Link>

            <Link href="#" className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition text-2xl">
                    <Rocket size={28}/>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-green-600 transition">Drilling</h3>
                <p className="text-sm text-gray-500">Latihan bareng coach.</p>
            </Link>

            <div className="bg-accent p-6 rounded-[2rem] shadow-lg relative overflow-hidden group cursor-pointer border border-yellow-400 hover:-translate-y-2 transition-transform">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-2xl transition group-hover:scale-150"></div>
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-4 text-2xl relative z-10">
                    <QrCode size={28} />
                </div>
                <h3 className="text-xl font-black text-black mb-1 relative z-10">Member ID</h3>
                <p className="text-sm text-black/70 relative z-10">Tunjukkan QR Code.</p>
            </div>

        </div>

    </main>
  );
}
