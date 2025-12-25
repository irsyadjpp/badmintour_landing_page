'use client';
import { Zap, Users, DollarSign, Scan, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HostSidebar() {
  return (
    <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col justify-between items-center bg-[#121212] border border-white/10 rounded-[2rem] py-6 shadow-2xl font-sans group hover:w-64 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden">
      <div className="flex items-center justify-center w-full h-12 mb-8 relative">
        <span className="absolute left-6 text-2xl transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-10">
          🏸
        </span>
        <span className="absolute left-6 text-xl font-black text-white tracking-tighter opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap">
          HOST<span className="text-accent">.</span>PANEL
        </span>
      </div>

      <div className="flex-1 w-full space-y-4 px-3">
        <Link
          href="#"
          className="flex items-center h-12 rounded-xl bg-white/10 text-accent relative overflow-hidden transition-all hover:bg-accent hover:text-black group/item"
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Live Match
          </span>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"></div>
        </Link>

        <Link
          href="#"
          className="flex items-center h-12 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all group/item"
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Data Pemain
          </span>
        </Link>

        <Link
          href="#"
          className="flex items-center h-12 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all group/item"
        >
          <div className="w-14 flex-shrink-0 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Keuangan
          </span>
        </Link>
      </div>

      <div className="w-full px-3 mb-4">
        <button className="w-full h-14 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-start text-black shadow-lg hover:scale-105 transition-transform group/btn overflow-hidden relative">
          <div className="w-14 flex-shrink-0 flex items-center justify-center z-10">
            <Scan className="w-7 h-7" />
          </div>
          <span className="font-black text-sm uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
            Scan QR
          </span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>
      </div>

      <div className="w-full px-3 border-t border-white/10 pt-4">
        <Link
          href="/login"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors"
        >
          <Image
            src="https://ui-avatars.com/api/?name=Host&background=D32F2F&color=fff"
            alt="Host Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border border-gray-600"
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-white text-sm font-bold">Admin GOR</p>
            <p className="text-xs text-primary font-bold">Log Out</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
