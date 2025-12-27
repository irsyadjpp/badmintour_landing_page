'use client';

import {
    LayoutGrid,
    Calendar,
    Users,
    Dumbbell,
    DollarSign,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function CoachSidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: "/coach/dashboard", icon: LayoutGrid, label: "Dashboard" },
        { href: "/coach/schedule", icon: Calendar, label: "My Schedule" },
        { href: "/coach/students", icon: Users, label: "Students" },
        { href: "/coach/drills", icon: Dumbbell, label: "Drill Library" },
        { href: "/coach/finance", icon: DollarSign, label: "Earnings" },
    ];

    return (
        <aside className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-6 z-50 flex-col items-center py-8 bg-[#151515]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl min-h-[500px]">
            <div className="mb-8 p-3 rounded-full bg-[#00f2ea]/10 border border-[#00f2ea]/20 text-[#00f2ea]">
                <Dumbbell className="w-6 h-6" />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full items-center px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group",
                                isActive 
                                    ? "bg-[#00f2ea] text-black shadow-[0_0_20px_rgba(0,242,234,0.4)]" 
                                    : "text-gray-500 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                        </Link>
                    );
                })}
            </nav>

            <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mt-6 hover:bg-red-500 hover:text-white transition-all"
            >
                <LogOut className="w-4 h-4"/>
            </button>
        </aside>
    );
}
