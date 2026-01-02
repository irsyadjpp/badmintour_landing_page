'use client';

import {
    Target,
    LayoutGrid,
    Swords,
    Trophy,
    Ticket,
    User,
    LogOut,
    History,
    Zap,
    Dumbbell,
    GraduationCap
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { signOut } from "next-auth/react";

export default function MemberSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/member/dashboard", icon: LayoutGrid, label: "Dashboard" },
        { href: "/member/mabar", icon: Swords, label: "Mabar" },
        { href: "/member/sparring", icon: Target, label: "Sparring" },
        { href: "/member/drilling", icon: Dumbbell, label: "Latihan" },
        { href: "/member/coaching", icon: GraduationCap, label: "Cari Coach" },
        { href: "/member/tournament", icon: Trophy, label: "Info Turnamen" },
        { href: "/member/tickets", icon: Ticket, label: "Tiket Saya" },
        { href: "/member/history", icon: History, label: "Riwayat Match" },
        { href: "/member/profile", icon: User, label: "Profil" },
    ];

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-6 z-50 flex-col items-center py-8 bg-[#151515]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:bg-[#151515] hover:border-[#ffbe00]/30 min-h-[600px]">
                <TooltipProvider delayDuration={0}>

                    {/* Brand */}
                    <Link href="/" className="mb-6 block">
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-[#ffbe00]/30 transition-all duration-300">
                            <NextImage src="/images/logo-light.png" width={40} height={40} alt="BadminTour" className="h-5 w-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>

                    {/* Nav Items */}
                    <nav className="flex-1 flex flex-col gap-4 w-full items-center justify-center px-3">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
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

                    {/* Logout */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mt-6 hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-4 bg-red-600 text-white border-red-600 text-xs font-bold">
                            Sign Out
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </aside>

            {/* MOBILE NAV (Bottom Bar Updated with Labels) */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <nav className="flex justify-between items-center bg-[#151515]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] px-6 py-3 shadow-2xl">
                    {[navItems[0], navItems[1], navItems[2], navItems[6]].map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.4)]"
                                        : "text-gray-500"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                    "text-[9px] font-bold transition-colors",
                                    isActive ? "text-[#ffbe00]" : "text-gray-600"
                                )}>
                                    {item.label.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
