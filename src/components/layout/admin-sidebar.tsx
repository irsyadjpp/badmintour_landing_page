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
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] flex flex-col items-center py-8 shadow-2xl text-white transition-all duration-300 hover:bg-black/30 hover:border-white/20">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-3 mb-8 text-white/50 hover:text-white transition hover:scale-110">
                            <Search className="w-6 h-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 bg-[#1A1A1A] text-white border-white/10 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Search
                    </TooltipContent>
                </Tooltip>
    
                <nav className="flex-1 flex flex-col gap-6 w-full items-center">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                             <Tooltip key={item.label}>
                                <TooltipTrigger asChild>
                                     <Link 
                                        href={item.href} 
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                            isActive 
                                                ? "bg-bad-yellow text-black shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110"
                                                : "text-white/40 hover:bg-white/10 hover:text-white hover:scale-105"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="ml-2 bg-[#1A1A1A] text-white border-white/10 text-xs font-bold px-2 py-1 rounded shadow-sm z-50">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/login" className="w-10 h-10 rounded-full bg-white/10 border border-white/10 overflow-hidden mt-8 hover:border-bad-red transition duration-300">
                            <Image src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" width={40} height={40} className="w-full h-full object-cover opacity-80 hover:opacity-100"/>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 bg-[#1A1A1A] text-white border-white/10 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </aside>
    );
}
