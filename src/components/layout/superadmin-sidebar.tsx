'use client';
import {
    LayoutGrid,
    ShieldAlert,
    Users,
    Activity,
    Database,
    Settings,
    LogOut,
    Lock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SuperAdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/superadmin/dashboard", icon: LayoutGrid, label: "Command Center" },
        { href: "/superadmin/users", icon: Users, label: "Role Manager" },
        { href: "/superadmin/security", icon: ShieldAlert, label: "Security & Logs" },
        { href: "/superadmin/system", icon: Activity, label: "System Health" },
        { href: "/superadmin/database", icon: Database, label: "Backup & Restore" },
        { href: "/superadmin/settings", icon: Settings, label: "Global Config" },
    ];

    return (
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-black/40 backdrop-blur-xl border border-[#ffbe00]/20 rounded-[3rem] shadow-2xl text-white transition-all duration-300 hover:bg-black/60 hover:border-[#ffbe00]/40">
            <TooltipProvider delayDuration={0}>
                
                {/* Superadmin Logo Indicator */}
                <div className="mb-8 p-3 rounded-full bg-[#ffbe00]/10 border border-[#ffbe00]/20 text-[#ffbe00] shadow-[0_0_15px_rgba(255,190,0,0.2)] animate-pulse">
                    <Lock className="w-6 h-6" />
                </div>
    
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
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
                                            isActive 
                                                ? "bg-[#ffbe00] text-black shadow-[0_0_20px_rgba(255,190,0,0.5)] scale-110" 
                                                : "text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="ml-4 bg-[#1A1A1A] text-[#ffbe00] border-[#ffbe00]/20 text-xs font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Profile / Logout */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/login" className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mt-6 hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            <LogOut className="w-4 h-4"/>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-4 bg-red-600 text-white border-red-600 text-xs font-bold">
                        Secure Logout
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </aside>
    );
}
