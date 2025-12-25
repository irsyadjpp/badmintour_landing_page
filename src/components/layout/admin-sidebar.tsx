'use client';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Wallet,
    Box,
    LogOut,
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
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 bg-white rounded-[3rem] flex flex-col items-center py-8 shadow-2xl text-black">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="p-3 mb-8 text-gray-400 hover:text-black transition">
                            <Search className="w-6 h-6" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
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
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110",
                                            isActive 
                                                ? "bg-black text-white shadow-lg"
                                                : "text-gray-400 hover:bg-gray-100 hover:text-black"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="ml-2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-sm z-50">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/login" className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mt-8">
                            <Image src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" width={40} height={40} className="w-full h-full object-cover"/>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </aside>
    );
}
