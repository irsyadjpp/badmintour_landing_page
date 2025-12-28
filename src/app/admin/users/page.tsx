
'use client';

import { useState, useEffect } from 'react';
import { 
    Users, 
    Search, 
    Loader2, 
    Trophy, 
    CheckCircle, 
    User 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AdminUserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Panggil API khusus Admin
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (data.success) {
                    setUsers(data.data);
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

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(search.toLowerCase()) || 
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'host': return <Badge className="bg-blue-500 text-white">HOST</Badge>;
            case 'coach': return <Badge className="bg-[#00f2ea] text-black font-bold">COACH</Badge>;
            default: return <Badge variant="outline" className="text-gray-400">MEMBER</Badge>;
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#ffbe00]" /> DATA PENGGUNA
                    </h1>
                    <p className="text-gray-400">Daftar Member, Host, dan Coach yang terdaftar.</p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Cari nama / email..." 
                        className="pl-10 bg-[#151515] border-white/10 text-white rounded-xl focus:border-[#ffbe00]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <Card className="bg-[#151515] border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center p-12 text-gray-500">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : filteredUsers.length > 0 ? (
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
                                {filteredUsers.map((user) => (
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
                                        <td className="p-6 text-sm text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        Data tidak ditemukan.
                    </div>
                )}
            </Card>
        </div>
    );
}
