'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
    ShieldAlert, 
    Search, 
    MoreHorizontal, 
    UserCog, 
    Loader2,
    Users,
    Trophy,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ITEMS_PER_PAGE = 10;

export default function SuperAdminUsersPage() {
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState<any[]>([]); // Data mentah dari API
    const [loading, setLoading] = useState(true);
    
    // States untuk Filter & Sort & Pagination
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'a-z', 'z-a'
    const [currentPage, setCurrentPage] = useState(1);
    
    // State untuk Modal Edit Role
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [newRole, setNewRole] = useState('');
    const [updating, setUpdating] = useState(false);

    // Fetch All Users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/users');
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

    useEffect(() => {
        fetchUsers();
    }, []);

    // LOGIC: Filter -> Sort -> Pagination
    const processedUsers = useMemo(() => {
        let data = [...allUsers];

        // 1. Filter Search
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
            if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === 'a-z') return a.name.localeCompare(b.name);
            if (sortBy === 'z-a') return b.name.localeCompare(a.name);
            return 0;
        });

        return data;
    }, [allUsers, search, roleFilter, sortBy]);

    // 4. Pagination Slicing
    const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = processedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page jika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, roleFilter, sortBy]);

    // Handle Update Role
    const handleUpdateRole = async () => {
        if (!selectedUser || !newRole) return;
        setUpdating(true);
        try {
            const res = await fetch('/api/superadmin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser.id, role: newRole })
            });

            if (res.ok) {
                toast({ title: "Sukses", description: `Role diubah menjadi ${newRole.toUpperCase()}.`, className: "bg-green-600 text-white" });
                fetchUsers(); 
                setSelectedUser(null);
            } else {
                throw new Error("Gagal update role");
            }
        } catch (error) {
            toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", variant: "destructive" });
        } finally {
            setUpdating(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'superadmin': return <Badge className="bg-red-600 text-white border-none">SUPERADMIN</Badge>;
            case 'admin': return <Badge className="bg-orange-500 text-white border-none">ADMIN</Badge>;
            case 'host': return <Badge className="bg-blue-500 text-white border-none">HOST</Badge>;
            case 'coach': return <Badge className="bg-[#00f2ea] text-black border-none font-bold">COACH</Badge>;
            default: return <Badge variant="outline" className="text-gray-400 border-gray-600">MEMBER</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-[#ca1f3d]" /> USER MANAGEMENT
                    </h1>
                    <p className="text-gray-400">Total User: {allUsers.length} | Menampilkan: {paginatedUsers.length}</p>
                </div>
                
                {/* Controls */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Cari user..." 
                            className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl focus:border-[#ca1f3d]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Role */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[130px] bg-[#151515] border-white/10 text-white rounded-xl">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <SelectItem value="all">Semua Role</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="coach">Coach</SelectItem>
                            <SelectItem value="host">Host</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sorting */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] bg-[#151515] border-white/10 text-white rounded-xl">
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

            {/* Users Table */}
            <Card className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden">
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
                                        <th className="p-6">User Info</th>
                                        <th className="p-6">Role</th>
                                        <th className="p-6">Bergabung</th>
                                        <th className="p-6 text-right">Action</th>
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
                                            <td className="p-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white">
                                                        <DropdownMenuItem 
                                                            className="cursor-pointer focus:bg-[#ca1f3d]/10 focus:text-[#ca1f3d]"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setNewRole(user.role);
                                                            }}
                                                        >
                                                            <UserCog className="w-4 h-4 mr-2" /> Ubah Role Access
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-gray-500">
                                                Tidak ada data user ditemukan.
                                            </td>
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
                                        className="border-white/10 text-white hover:bg-white/10"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Prev
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="border-white/10 text-white hover:bg-white/10"
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* Modal Edit Role (Sama seperti sebelumnya) */}
            <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-2xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserCog className="w-5 h-5 text-[#ffbe00]" /> Ubah Role User
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="p-4 bg-[#0a0a0a] rounded-xl border border-white/5 flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={selectedUser?.image} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-white">{selectedUser?.name}</p>
                                <p className="text-xs text-gray-500">{selectedUser?.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Pilih Role Baru</label>
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="bg-[#0a0a0a] border-white/10 text-white h-12 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                    <SelectItem value="member">
                                        <span className="flex items-center gap-2"><Users className="w-4 h-4"/> Member (User Biasa)</span>
                                    </SelectItem>
                                    <SelectItem value="coach">
                                        <span className="flex items-center gap-2"><Trophy className="w-4 h-4"/> Coach (Pelatih)</span>
                                    </SelectItem>
                                    <SelectItem value="host">
                                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Host (Pengelola GOR)</span>
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Admin</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button 
                            onClick={handleUpdateRole} 
                            disabled={updating}
                            className="w-full h-12 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl"
                        >
                            {updating ? <Loader2 className="animate-spin" /> : "SIMPAN PERUBAHAN"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
