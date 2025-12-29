
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
    UserCog,
    ArrowLeft,
    DollarSign,
    FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import RoleSwitcher from './role-switcher'; // IMPORT RoleSwitcher

const menuItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Transactions", href: "/admin/transactions", icon: DollarSign },
    { title: "Reports", href: "/admin/reports", icon: FileSpreadsheet },
    { title: "Users / Members", href: "/admin/users", icon: Users },
    { title: "Events Management", href: "/admin/events", icon: Calendar },
    { title: "Jersey Orders", href: "/admin/jersey", icon: Shirt },
    { title: "Admin Profile", href: "/admin/profile", icon: UserCog }
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [adminProfile, setAdminProfile] = useState({
        name: '',
        image: '',
        role: 'Admin'
    });

    useEffect(() => {
        if (session?.user?.id) {
            const unsub = onSnapshot(doc(db, "users", session.user.id), (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setAdminProfile({
                        name: data.name || session.user?.name || 'Admin',
                        image: data.image || data.photoURL || session.user?.image || '',
                        role: data.role || 'Admin'
                    });
                }
            });
            return () => unsub();
        }
    }, [session]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl text-white transition-all duration-300 hover:bg-black/30 hover:border-white/20">

            <div className="p-3 mb-6 rounded-2xl bg-[#ca1f3d]/80 text-white shadow-[0_0_15px_rgba(202,31,61,0.5)]">
                <Trophy className="w-5 h-5" />
            </div>

            <div className="mb-4">
                <RoleSwitcher />
            </div>

            <nav className="flex-1 flex flex-col gap-4 w-full items-center justify-center">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                                isActive
                                    ? "bg-bad-yellow text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] scale-110"
                                    : "text-white/40 hover:bg-white/10 hover:text-white hover:scale-105"
                            )}>
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive && "fill-current"
                                )} />

                                {(item.title === 'Transactions') && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bad-yellow opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-bad-yellow text-[8px] items-center justify-center text-black font-black"></span>
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t border-transparent w-full mt-auto space-y-2">

                <Link href="/member/dashboard" className="block">
                    <Button
                        variant="outline"
                        title="Switch to Player Mode"
                        className="w-full h-12 justify-center border-white/10 bg-[#151515] hover:bg-white/10 text-gray-300 hover:text-white gap-3 rounded-2xl font-bold text-xs group"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    title="Sign Out"
                    className="w-full h-12 justify-center text-red-500 hover:text-white hover:bg-[#ca1f3d] transition-all duration-300 gap-3 rounded-2xl font-bold group text-xs"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
            </div>
        </aside>
    );
}
