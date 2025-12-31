'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Filter,
    ShieldCheck,
    Briefcase,
    User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 10;

export default function AdminUserManagementPage() {
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // States
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (data.success) {
                    setAllUsers(data.data);
                }
            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Gagal memuat data user.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [toast]);

    // LOGIC: Filter -> Sort -> Pagination
    const processedUsers = useMemo(() => {
        let data = [...allUsers];

        // 1. Search
        if (search) {
            data = data.filter(user =>
                user.name?.toLowerCase().includes(search.toLowerCase()) ||
                user.email?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 2. Filter Role
        if (roleFilter !== 'all') {
            data = data.filter(user => user.role === roleFilter);
        }

        // 3. Sorting
        data.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            if (sortBy === 'a-z') return (a.name || "").localeCompare(b.name || "");
            if (sortBy === 'z-a') return (b.name || "").localeCompare(a.name || "");
            return 0;
        });

        return data;
    }, [allUsers, search, roleFilter, sortBy]);

    // 4. Pagination
    const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = processedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => { setCurrentPage(1); }, [search, roleFilter, sortBy]);

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'host': return (
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                    <Briefcase className="w-3 h-3" /> <span className="text-[10px] font-black uppercase tracking-wider">HOST</span>
                </div>
            );
            case 'coach': return (
                <div className="flex items-center gap-2 bg-[#00f2ea]/10 text-[#00f2ea] px-3 py-1 rounded-full border border-[#00f2ea]/20">
                    <ShieldCheck className="w-3 h-3" /> <span className="text-[10px] font-black uppercase tracking-wider">COACH</span>
                </div>
            );
            case 'admin': return (
                <div className="flex items-center gap-2 bg-[#ffbe00]/10 text-[#ffbe00] px-3 py-1 rounded-full border border-[#ffbe00]/20">
                    <ShieldCheck className="w-3 h-3" /> <span className="text-[10px] font-black uppercase tracking-wider">ADMIN</span>
                </div>
            );
            default: return (
                <div className="flex items-center gap-2 bg-white/5 text-gray-400 px-3 py-1 rounded-full border border-white/10">
                    <User className="w-3 h-3" /> <span className="text-[10px] font-black uppercase tracking-wider">MEMBER</span>
                </div>
            );
        }
    };

    return (
        <main className="pb-20 space-y-8">

            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
                        User Database
                    </h1>
                    <p className="text-gray-400 font-medium">Manage members, coaches, and hosts.</p>
                </div>

                <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-6 flex flex-col items-end min-w-[200px] relative overflow-hidden group">
                    {/* Glow User*/}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-[#ffbe00]/30 transition duration-700"></div>

                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2 relative z-10">
                        Total Users <Users className="w-3 h-3 text-[#ffbe00]" />
                    </span>
                    <span className="text-5xl font-jersey text-white tracking-wide relative z-10">
                        {allUsers.length}
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-12 bg-[#121212] border-white/5 text-white h-12 rounded-xl focus:border-[#ffbe00]/50 transition-colors placeholder:text-gray-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full md:w-[150px] h-12 bg-[#121212] border-white/5 rounded-xl text-gray-300 font-medium hover:text-white">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-xl p-1">
                            {['all', 'member', 'coach', 'host', 'admin'].map((role) => (
                                <SelectItem key={role} value={role} className="rounded-lg focus:bg-white/10 focus:text-white cursor-pointer capitalize">
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full md:w-[150px] h-12 bg-[#121212] border-white/5 rounded-xl text-gray-300 font-medium hover:text-white">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4" />
                                <SelectValue placeholder="Sort" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-xl p-1">
                            <SelectItem value="newest" className="rounded-lg focus:bg-white/10">Newest</SelectItem>
                            <SelectItem value="oldest" className="rounded-lg focus:bg-white/10">Oldest</SelectItem>
                            <SelectItem value="a-z" className="rounded-lg focus:bg-white/10">Name (A-Z)</SelectItem>
                            <SelectItem value="z-a" className="rounded-lg focus:bg-white/10">Name (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List View */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-gray-500 gap-4">
                        <Loader2 className="animate-spin w-10 h-10 text-[#ffbe00]" />
                        <p className="animate-pulse">Loading Database...</p>
                    </div>
                ) : (
                    <>
                        {paginatedUsers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {paginatedUsers.map((user, i) => (
                                    <div
                                        key={user.id}
                                        className="bg-[#1A1A1A] hover:bg-[#202020] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="relative">
                                                <Avatar className="w-14 h-14 border-2 border-[#252525] group-hover:border-[#ffbe00] transition-colors duration-300 rounded-2xl">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback className="bg-[#0a0a0a] text-gray-400 font-black text-lg rounded-2xl">
                                                        {user.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1 bg-[#121212] rounded-full p-0.5 border border-white/10">
                                                    <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-[#ffbe00]' : 'bg-gray-500'}`}></div>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white text-lg group-hover:text-[#ffbe00] transition-colors text-left">
                                                    {user.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-mono text-left">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Role</span>
                                                {getRoleBadge(user.role)}
                                            </div>

                                            <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                                <span className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Joined</span>
                                                <span className="text-sm font-bold text-gray-300">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-20 text-center">
                                <Users className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">No Users Found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="w-10 h-10 rounded-xl border-white/10 bg-[#151515] text-white hover:bg-white/10"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="w-10 h-10 rounded-xl border-white/10 bg-[#151515] text-white hover:bg-white/10"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
