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
import { CustomAlertModal } from '@/components/ui/custom-alert-modal';

const ITEMS_PER_PAGE = 10;

export default function SuperAdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // States
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // State untuk Modal Edit Role
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);

    // Custom Alert State
    const [alertConfig, setAlertConfig] = useState<{
        open: boolean;
        type: 'success' | 'error';
        title: string;
        message: React.ReactNode;
        buttonText?: string;
    }>({
        open: false,
        type: 'success',
        title: '',
        message: '',
    });

    // Debounce Search
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset Page on Filter Change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, roleFilter, sortBy]);

    // Fetch API
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search: debouncedSearch,
                role: roleFilter,
                sortBy: sortBy
            });

            const res = await fetch(`/api/superadmin/users?${params}`);
            const data = await res.json();

            if (data.success) {
                setUsers(data.data);
                setHasMore(data.meta.hasMore);
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
    }, [currentPage, debouncedSearch, roleFilter, sortBy]);

    // Cleanup: Remove client-side logic (processedUsers, etc)
    const paginatedUsers = users; // Direct mapping

    // Handle Update Role
    const handleUpdateRole = async () => {
        if (!selectedUser || selectedRoles.length === 0) return;
        setUpdating(true);
        try {
            const res = await fetch('/api/superadmin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedUser.id, roles: selectedRoles })
            });

            if (res.ok) {
                setAlertConfig({
                    open: true,
                    type: 'success',
                    title: 'ROLES UPDATED!',
                    message: (
                        <span>
                            Roles user <strong className="text-white">{selectedUser.name}</strong> berhasil diubah menjadi <span className="text-[#22c55e] font-black">{selectedRoles.join(', ').toUpperCase()}</span>.
                        </span>
                    ),
                    buttonText: 'OK, LANJUT'
                });
                fetchUsers();
                setSelectedUser(null);
            } else {
                throw new Error("Gagal update role");
            }
        } catch (error) {
            setAlertConfig({
                open: true,
                type: 'error',
                title: 'GAGAL MENYIMPAN',
                message: "Gagal mengubah role user. Terjadi kesalahan sistem atau koneksi.",
                buttonText: 'COBA LAGI'
            });
        } finally {
            setUpdating(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'superadmin': return <Badge className="bg-red-600 text-white border-none">SUPERADMIN</Badge>;
            case 'admin': return <Badge className="bg-orange-500 text-white border-none">ADMIN</Badge>;
            case 'social_admin': return <Badge className="bg-[#ffbe00] text-black border-none font-bold">SOCIAL</Badge>;
            case 'host': return <Badge className="bg-[#ca1f3d] text-white border-none">HOST</Badge>;
            case 'coach': return <Badge className="bg-[#ffbe00] text-black border-none font-bold">COACH</Badge>;
            default: return <Badge variant="outline" className="text-gray-400 border-gray-600">MEMBER</Badge>;
        }
    };

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
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
                    <p className="text-gray-400">Halaman {currentPage} | Menampilkan {users.length} user</p>
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
                            <SelectItem value="social_admin">Social Admin</SelectItem>
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
                                        <th className="p-6">Roles</th>
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
                                                <div className="flex flex-wrap gap-1">
                                                    {(user.roles || [user.role]).map((r: string) => (
                                                        <div key={r}>
                                                            {getRoleBadge(r)}
                                                        </div>
                                                    ))}
                                                </div>
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
                                                                setSelectedRoles(user.roles || [user.role]);
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

                        {/* Pagination Controls (Server Side) */}
                        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#1A1A1A]">
                            <div className="text-xs text-gray-500 font-bold">
                                Page {currentPage}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1 || loading}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="border-white/10 text-white hover:bg-white/10"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasMore || loading}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="border-white/10 text-white hover:bg-white/10"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>

            {/* Modal Edit Role (Updated for Multi-Select) */}
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

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase">Pilih Role (Bisa Lebih Dari Satu)</label>

                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'member', label: 'Member', icon: <Users className="w-4 h-4" />, color: 'text-gray-400' },
                                    { id: 'coach', label: 'Coach', icon: <Trophy className="w-4 h-4" />, color: 'text-[#ffbe00]' },
                                    { id: 'host', label: 'Host', icon: <CheckCircle className="w-4 h-4" />, color: 'text-[#ca1f3d]' },
                                    { id: 'admin', label: 'Admin', icon: <ShieldAlert className="w-4 h-4" />, color: 'text-orange-500' },
                                    { id: 'social_admin', label: 'Social Admin', icon: <Users className="w-4 h-4" />, color: 'text-[#ffbe00]' },
                                    { id: 'superadmin', label: 'Superadmin', icon: <ShieldAlert className="w-4 h-4" />, color: 'text-red-500' }
                                ].map((role) => {
                                    const isSelected = selectedRoles.includes(role.id);
                                    return (
                                        <div
                                            key={role.id}
                                            onClick={() => toggleRole(role.id)}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-white/10 border-white/20' : 'bg-[#0a0a0a] border-white/5 hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full bg-white/5 ${role.color}`}>
                                                    {role.icon}
                                                </div>
                                                <span className="text-sm font-bold">{role.label}</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-[#ca1f3d] border-[#ca1f3d]' : 'border-gray-600'}`}>
                                                {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <Button
                            onClick={handleUpdateRole}
                            disabled={updating || selectedRoles.length === 0}
                            className="w-full h-12 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl"
                        >
                            {updating ? <Loader2 className="animate-spin" /> : "SIMPAN PERUBAHAN"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <CustomAlertModal
                isOpen={alertConfig.open}
                onClose={() => setAlertConfig(prev => ({ ...prev, open: false }))}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                buttonText={alertConfig.buttonText}
            />
        </div>
    );
};
