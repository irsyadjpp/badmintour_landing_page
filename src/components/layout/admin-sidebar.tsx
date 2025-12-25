'use client';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Wallet,
    Box,
    ClipboardList,
    Sparkles,
    Search,
    Trophy,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
        { href: "/admin/members", icon: Users, label: "Members" },
        { href: "/admin/events", icon: Calendar, label: "Sessions" },
        { href: "/admin/tournaments", icon: Trophy, label: "Tournaments" },
        { href: "/admin/finance", icon: Wallet, label: "Finance" },
        { href: "/admin/orders", icon: ClipboardList, label: "Orders" },
        { href: "/admin/inventory", icon: Box, label: "Inventory" },
        { href: "/admin/gamification", icon: Sparkles, label: "Gamification" },
    ];

    return (
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl text-white transition-all duration-300 hover:bg-black/30 hover:border-white/20">
            <TooltipProvider delayDuration={0}>
                
                {/* Search Trigger */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-3 mb-6 text-white/40 hover:text-white transition-all hover:scale-110 hover:bg-white/5 rounded-full">
                            <Search className="w-5 h-5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-4 bg-[#1A1A1A] text-white border-white/10 text-xs font-bold">
                        Search
                    </TooltipContent>
                </Tooltip>
    
                {/* Navigation Items */}
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
                                                ? "bg-bad-yellow text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-110" // Active: Neon Yellow & Glow
                                                : "text-white/40 hover:bg-white/10 hover:text-white hover:scale-105" // Inactive: Ghost
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                        
                                        {/* Dot Indicator untuk item aktif (Opsional, menambah detail) */}
                                        {isActive && (
                                            <span className="absolute -right-1 top-1 w-2 h-2 bg-white rounded-full border border-black/10"></span>
                                        )}
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="ml-4 bg-[#1A1A1A] text-white border-white/10 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Profile / Logout */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/login" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden mt-6 hover:border-bad-red/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.3)]">
                            <Image 
                                src="https://ui-avatars.com/api/?name=Admin&background=random" 
                                alt="Admin" 
                                width={40} 
                                height={40} 
                                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-4 bg-bad-red text-white border-bad-red text-xs font-bold">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </aside>
    );
}
