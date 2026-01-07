'use client';

import {
    LayoutGrid,
    CalendarPlus,
    Users,
    Wallet,
    QrCode,
    Settings,
    LogOut,
    User,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function HostSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/host/dashboard", icon: LayoutGrid, label: "Dashboard" },
        { href: "/host/events", icon: CalendarPlus, label: "Kelola Event" },
        { href: "/host/scan", icon: QrCode, label: "Scan Tiket" },
        { href: "/host/check-in", icon: MapPin, label: "Absensi Host" },
        { href: "/host/community", icon: Users, label: "Komunitas" },
        { href: "/host/finance", icon: Wallet, label: "Pendapatan" },
        { href: "/host/profile", icon: User, label: "Profile & Akun" },
    ];

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-[#151515]/90 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl transition-all duration-300 hover:bg-[#151515] hover:border-[#ca1f3d]/30">
                <TooltipProvider delayDuration={0}>

                    {/* Brand Logo (Updated) */}
                    <div className="mb-6 relative w-10 h-10 p-1.5 bg-white/5 rounded-full border border-white/10 shadow-[0_0_15px_rgba(202,31,61,0.2)] group overflow-hidden">
                        <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-110">
                            <Image
                                src="/images/logo-light.png"
                                alt="BadminTour"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <nav className="flex-1 flex flex-col gap-4 w-full items-center justify-center">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                                                isActive
                                                    ? "bg-[#ca1f3d] text-white shadow-[0_0_20px_rgba(202,31,61,0.5)] scale-110"
                                                    : "text-gray-500 hover:bg-white/10 hover:text-white hover:scale-105"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="ml-4 bg-[#1A1A1A] text-[#ffbe00] border-[#ca1f3d]/20 text-xs font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>

                    <div className="p-2 border-t border-transparent w-full mt-auto space-y-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full h-12 justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center hover:bg-red-500 hover:text-white transition-all duration-300 group"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-4 bg-red-600 text-white border-red-600 text-xs font-bold">
                                Sign Out
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </aside>

            {/* MOBILE NAV */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <nav className="flex justify-around items-center bg-[#151515]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] px-6 py-3 shadow-2xl">
                    {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[4]].map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1">
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    isActive ? "bg-[#ca1f3d] text-white shadow-lg shadow-[#ca1f3d]/30" : "text-gray-500"
                                )}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={cn("text-[9px] font-bold", isActive ? "text-[#ffbe00]" : "text-gray-600")}>
                                    {item.label.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div >
        </>
    );
}
