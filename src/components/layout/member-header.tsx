'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Shirt, Calendar, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MemberHeader() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/member/dashboard', label: 'Dashboard' },
        { href: '/member/jersey', label: 'Jersey Drop', hot: true },
        { href: '/#schedule', label: 'Jadwal' },
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 font-sans">
            <div className="bg-[#0f0f0f]/90 backdrop-blur-xl border border-white/10 rounded-full py-3 px-6 w-full max-w-6xl shadow-2xl flex justify-between items-center relative">

                <Link href="/member/dashboard" className="flex items-center gap-2 group shrink-0">
                    <span className="text-2xl transition-transform group-hover:rotate-12">🏸</span>
                    <span className="font-black text-xl tracking-tight text-white group-hover:text-accent transition-colors">
                        BADMINTOUR<span className="text-accent">.</span>
                    </span>
                </Link>

                <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-bold transition-all relative",
                                pathname === link.href
                                    ? 'bg-accent text-bad-dark shadow-[0_0_15px_rgba(255,235,59,0.3)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                            )}
                        >
                            {link.label}
                            {link.hot && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>}
                        </Link>
                    ))}
                </div>

                <div className="relative group shrink-0">
                    <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Member</p>
                            <p className="text-sm font-black text-white leading-none">KEVIN.S</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-orange-500 p-[2px]">
                            <Image src="https://ui-avatars.com/api/?name=Kevin+S&background=000&color=fff" alt="User Avatar" width={40} height={40} className="rounded-full w-full h-full border-2 border-[#0f0f0f]" />
                        </div>
                    </button>

                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 overflow-hidden z-50">
                        <div className="md:hidden px-4 py-3 border-b border-white/5">
                            <p className="text-xs text-gray-400">Login sebagai</p>
                            <p className="text-white font-bold">KEVIN.S</p>
                        </div>
                        <div className="lg:hidden border-b border-white/5">
                            <Link href="/member/jersey" className="flex items-center gap-2 px-4 py-3 text-sm text-accent hover:bg-white/10 font-bold">
                                <Shirt className="w-4 h-4" /> Claim Jersey
                            </Link>
                            <Link href="/#schedule" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 font-bold">
                                <Calendar className="w-4 h-4" /> Jadwal
                            </Link>
                        </div>
                        <Link href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white font-bold">Edit Profil</Link>
                        <Link href="/" className="flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary/10 font-bold">
                            <LogOut className="w-4 h-4" /> Logout
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
