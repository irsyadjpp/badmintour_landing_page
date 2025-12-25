'use client';

import {
    LayoutGrid,
    CalendarDays,
    Ticket,
    Trophy,
    User,
    LogOut,
    History,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { signOut } from "next-auth/react";

export default function MemberSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/member/dashboard", icon: LayoutGrid, label: "Dashboard" },
        { href: "/booking", icon: CalendarDays, label: "Booking Lapangan" },
        { href: "/member/tickets", icon: Ticket, label: "Tiket Saya" },
        { href: "/member/history", icon: History, label: "Riwayat Match" },
        { href: "/member/profile", icon: User, label: "Profil & Settings" },
    ];

    return (
        <>
            {/* DESKTOP SIDEBAR (Floating Left) */}
            <aside className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-6 z-50 flex-col items-center py-8 bg-[#151515]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:bg-[#151515] hover:border-[#ffbe00]/30 min-h-[500px]">
                <TooltipProvider delayDuration={0}>
                    
                    {/* Brand Icon */}
                    <div className="mb-8 p-3 rounded-full bg-[#ffbe00]/10 border border-[#ffbe00]/20 text-[#ffbe00] shadow-[0_0_15px_rgba(255,190,0,0.2)]">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
        
                    {/* Navigation Items */}
                    <nav className="flex-1 flex flex-col gap-6 w-full items-center justify-center px-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Link 
                                            href={item.href} 
                                            className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
                                                isActive 
                                                    ? "bg-[#ffbe00] text-black shadow-[0_0_20px_rgba(255,190,0,0.5)] scale-110" 
                                                    : "text-gray-500 hover:bg-white/10 hover:text-white hover:scale-105"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                            
                                            {/* Active Dot Indicator */}
                                            {isActive && (
                                                <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-white border-2 border-[#151515]"></span>
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="ml-4 bg-[#1A1A1A] text-[#ffbe00] border-[#ffbe00]/20 text-xs font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button 
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mt-6 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                            >
                                <LogOut className="w-4 h-4"/>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-4 bg-red-600 text-white border-red-600 text-xs font-bold">
                            Sign Out
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </aside>

            {/* MOBILE NAVIGATION (Floating Bottom Bar) */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <nav className="flex justify-around items-center bg-[#151515]/90 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link 
                                key={item.label}
                                href={item.href} 
                                className={cn(
                                    "p-3 rounded-2xl transition-all duration-300",
                                    isActive 
                                        ? "bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.4)]" 
                                        : "text-gray-500 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            </Link>
                        );
                    })}
                     <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="p-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </nav>
            </div>
        </>
    );
}
