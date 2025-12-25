
'use client';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Wallet,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
        { href: "/admin/members", icon: Users, label: "Members" },
        { href: "/admin/events", icon: Calendar, label: "Events" },
        { href: "/admin/finance", icon: Wallet, label: "Finance" },
    ];

    return (
        <aside className="fixed top-4 bottom-4 left-4 z-40 w-20 flex flex-col justify-between bg-white border border-gray-200 rounded-[2.5rem] py-8 shadow-2xl group hover:w-64 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden">
    
            <div className="flex items-center justify-center w-full h-12 mb-6 relative">
                <span className="absolute left-6 text-2xl transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-10">🏸</span>
                <span className="absolute left-6 text-xl font-black tracking-tighter opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 whitespace-nowrap">
                    BADMINTOUR
                </span>
            </div>

            <nav className="flex-1 w-full space-y-3 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.label}
                            href={item.href} 
                            className={cn(
                                "flex items-center h-12 px-4 rounded-full relative overflow-hidden transition-all",
                                isActive 
                                    ? "bg-bad-dark text-white shadow-xl"
                                    : "text-gray-400 hover:bg-gray-100 hover:text-bad-dark"
                            )}
                        >
                            <item.icon className="w-6 h-6 shrink-0" />
                            <span className="ml-4 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{item.label}</span>
                            {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-bad-green rounded-full animate-pulse"></div>}
                        </Link>
                    );
                })}
            </nav>

            <div className="w-full px-3 border-t border-gray-100 pt-6">
                <Link href="/login" className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                        <p className="text-xs font-bold text-gray-500">Log Out</p>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
