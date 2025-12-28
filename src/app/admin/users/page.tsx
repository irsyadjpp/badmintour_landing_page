'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
    Users, 
    Search, 
    Loader2, 
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Filter
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
        switch(role) {
            case 'host': return <Badge className="bg-blue-500 text-white">HOST</Badge>;
            case 'coach': return <Badge className="bg-[#00f2ea] text-black font-bold">COACH</Badge>;
            default: return <Badge variant="outline" className="text-gray-400">MEMBER</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#ffbe00]" /> DATA PENGGUNA
                    </h1>
                    <p className="text-gray-400">Total User: {allUsers.length}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Cari user..." 
                            className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Role (Admin View Only) */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[130px] bg-[#151515] border-white/10 rounded-xl text-white">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="coach">Coach</SelectItem>
                            <SelectItem value="host">Host</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] bg-[#151515] border-white/10 rounded-xl text-white">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4" />
                                <SelectValue placeholder="Sort" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                            <SelectItem value="a-z">Nama (A-Z)</SelectItem>
                            <SelectItem value="z-a">Nama (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center p-12 text-gray-500">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1A1A1A] text-xs uppercase text-gray-500 font-bold border-b border-white/5">
                                    <tr>
                                        <th className="p-6">User Profile</th>
                                        <th className="p-6">Role</th>
                                        <th className="p-6">Tgl Gabung</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-10 h-10 border border-white/10">
                                                        <AvatarImage src={user.image} />
                                                        <AvatarFallback className="bg-[#222] text-white font-bold">
                                                            {user.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="p-6 text-sm text-gray-400">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="p-12 text-center text-gray-500">Data tidak ditemukan.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                         {/* Pagination Controls */}
                         {totalPages > 1 && (
                            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#1A1A1A]">
                                <div className="text-xs text-gray-500 font-bold">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="border-white/10 bg-[#151515] text-white hover:bg-white/10"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Prev
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="border-white/10 bg-[#151515] text-white hover:bg-white/10"
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
}
