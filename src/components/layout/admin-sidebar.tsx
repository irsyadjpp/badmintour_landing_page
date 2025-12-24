'use client';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Plus
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminSidebar() {
    return (
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col justify-between items-center bg-white border border-gray-200 rounded-[2rem] py-6 shadow-2xl font-sans group hover:w-64 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden">
    
            <div className="flex items-center justify-center w-full h-12 mb-8 relative">
                <span className="absolute left-6 text-2xl text-bad-dark transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-10">⚙️</span>
                <span className="absolute left-6 text-xl font-black text-bad-dark tracking-tighter opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap">
                    ADMIN<span className="text-bad-red">.</span>DASH
                </span>
            </div>

            <div className="flex-1 w-full space-y-2 px-3">
                
                <Link href="/admin/dashboard" className="flex items-center h-12 rounded-xl bg-gray-100 text-bad-dark relative overflow-hidden transition-all hover:bg-bad-dark hover:text-white group/item">
                    <div className="w-14 flex-shrink-0 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Overview</span>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-bad-dark rounded-r-full group-hover/item:bg-white"></div>
                </Link>

                <Link href="#" className="flex items-center h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-bad-dark transition-all group/item">
                    <div className="w-14 flex-shrink-0 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Data Member</span>
                </Link>

                <Link href="#" className="flex items-center h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-bad-dark transition-all group/item">
                    <div className="w-14 flex-shrink-0 flex items-center justify-center">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Turnamen</span>
                </Link>

                <Link href="#" className="flex items-center h-12 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-bad-dark transition-all group/item">
                    <div className="w-14 flex-shrink-0 flex items-center justify-center">
                        <Settings className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Pengaturan</span>
                </Link>

            </div>

            <div className="w-full px-3 border-t border-gray-100 pt-4">
                <Link href="/login" className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <Image src="https://ui-avatars.com/api/?name=Admin&background=000&color=fff" alt="Admin" width={40} height={40} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        <p className="text-bad-dark text-sm font-bold">Administrator</p>
                        <p className="text-xs text-bad-red font-bold">Log Out</p>
                    </div>
                </Link>
            </div>
        </aside>
    );
}