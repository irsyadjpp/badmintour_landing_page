'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '@/lib/firebase'; 
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    Settings, 
    LogOut,
    Shirt, 
    Trophy,
    UserCircle,
    ArrowLeft,
    Wallet,
    Box,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/members", icon: Users, label: "Members" },
    { href: "/admin/events", icon: Calendar, label: "Sessions" },
    { href: "/admin/tournaments", icon: Trophy, label: "Tournaments" },
    { href: "/admin/finance", icon: Wallet, label: "Finance" },
    { href: "/admin/jersey", icon: Shirt, label: "Jersey Orders" },
    { href: "/admin/inventory", icon: Box, label: "Inventory" },
    { href: "/admin/gamification", icon: Sparkles, label: "Gamification" },
];


export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    
    // State untuk Data Profile dari Firestore
    const [adminProfile, setAdminProfile] = useState({
        name: '',
        image: '',
        role: 'Admin'
    });

    // FETCH DATA REAL-TIME DARI FIRESTORE
    useEffect(() => {
        if (session?.user?.id) {
            // Menggunakan onSnapshot agar jika foto diubah, sidebar langsung update
            const unsub = onSnapshot(doc(db, "users", session.user.id), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setAdminProfile({
                        name: data.name || session.user?.name || 'Admin',
                        image: data.image || session.user?.image || '', // Prioritas gambar dari DB
                        role: data.role || 'Admin'
                    });
                }
            });

            return () => unsub(); // Cleanup listener
        }
    }, [session]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl text-white transition-all duration-300 hover:bg-black/30 hover:border-white/20">
            <TooltipProvider delayDuration={0}>
                
                {/* Logo Area */}
                <div className="p-3 mb-6 rounded-2xl bg-[#ca1f3d]/80 text-white shadow-[0_0_15px_rgba(202,31,61,0.5)]">
                     <Trophy className="w-5 h-5" />
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
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                                            isActive 
                                                ? "bg-bad-yellow text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-110"
                                                : "text-white/40 hover:bg-white/10 hover:text-white hover:scale-105"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
                                        
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

                <Link href="/">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white/5 text-gray-400 border border-white/10 mt-6 hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>

                {/* Profile / Logout */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 overflow-hidden mt-2 hover:border-bad-red/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.3)]">
                            {adminProfile.image ? (
                                <Image 
                                    src={adminProfile.image} 
                                    alt="Admin" 
                                    width={40} 
                                    height={40} 
                                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#151515] flex items-center justify-center text-gray-400">
                                   <UserCircle className="w-6 h-6" />
                                </div>
                            )}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-4 bg-bad-red text-white border-bad-red text-xs font-bold">
                        Logout
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </aside>
    );
}
