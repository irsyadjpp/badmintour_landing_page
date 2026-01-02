'use client';
import Link from 'next/link';
import { LogOut, User, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MemberHeader() {
    const { data: session } = useSession();

    return (
        <div className="fixed top-6 right-6 z-50 hidden md:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-full bg-[#151515]/90 backdrop-blur-xl border border-white/10 hover:border-[#ffbe00]/50 transition-all shadow-xl group">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-[#ffbe00] transition-colors">Member</p>
                            <p className="text-sm font-black text-white leading-none max-w-[100px] truncate">
                                {session?.user?.name || 'Athlete'}
                            </p>
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-white/10 group-hover:border-[#ffbe00] transition-colors">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-[#ffbe00] text-black font-bold">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1A1A1A] border-white/10 text-white mr-6 mt-2 rounded-2xl shadow-2xl p-2" align="end">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-black leading-none text-white">{session?.user?.name}</p>
                            <p className="text-xs leading-none text-gray-500 font-mono">{session?.user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer">
                        <Link href="/member/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-[#ffbe00]" />
                            <span>Profil Saya</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer">
                        <Link href="/member/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4 text-gray-400" />
                            <span>Pengaturan</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-red-500 focus:bg-red-500/10 focus:text-red-500 rounded-xl cursor-pointer font-bold"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Keluar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
