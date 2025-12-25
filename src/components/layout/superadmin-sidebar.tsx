'use client';

import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    Database, 
    ShieldAlert, 
    Activity,
    LogOut, // Import Icon LogOut
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import { signOut } from "next-auth/react"; // Import signOut

export default function SuperadminSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/superadmin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/superadmin/users", icon: Users, label: "User Management" },
        { href: "/superadmin/database", icon: Database, label: "Database & Backup" },
        { href: "/superadmin/security", icon: ShieldAlert, label: "Security Logs" },
        { href: "/superadmin/system", icon: Activity, label: "System Health" },
        { href: "/superadmin/settings", icon: Settings, label: "Global Config" },
    ];

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center py-8 bg-[#151515]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl min-h-[600px] transition-all duration-300 hover:bg-[#151515] hover:border-[#ffbe00]/30">
            <TooltipProvider delayDuration={0}>
                
                {/* Brand Icon */}
                <div className="mb-8 p-3 rounded-full bg-[#ffbe00]/10 border border-[#ffbe00]/20 text-[#ffbe00] shadow-[0_0_15px_rgba(255,190,0,0.2)]">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
    
                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col gap-4 w-full items-center justify-center px-3">
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

                {/* LOGOUT BUTTON YANG DIPERBAIKI */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })} // Fungsi Logout NextAuth
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
    );
}
