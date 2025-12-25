'use client';

import { useState, useEffect } from 'react';
import { 
    Search, 
    Shield, 
    ShieldAlert, 
    UserCog, 
    CheckCircle2, 
    Ban,
    Loader2,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type UserRole = 'member' | 'host' | 'admin' | 'superadmin';

interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
    status?: string;
}

export default function UserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State Sheet Edit
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editRole, setEditRole] = useState<UserRole>('member');
    const [isSaving, setIsSaving] = useState(false);

    // 1. Fetch Users saat Load
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/superadmin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Gagal load users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Handle Update Role
    const handleSaveChanges = async () => {
        if (!selectedUser) return;
        setIsSaving(true);

        try {
            const res = await fetch('/api/superadmin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser.id || selectedUser.uid, // Firestore Doc ID
                    newRole: editRole
                })
            });

            if (res.ok) {
                toast({
                    title: "Role Updated",
                    description: `User ${selectedUser.name} sekarang adalah ${editRole}.`,
                    className: "bg-[#ffbe00] text-black border-none font-bold"
                });
                // Refresh list user agar data sinkron
                fetchUsers();
                setIsSheetOpen(false);
            } else {
                throw new Error("Gagal update");
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal mengubah role user.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const openManageUser = (user: User) => {
        setSelectedUser(user);
        setEditRole(user.role || 'member');
        setIsSheetOpen(true);
    };

    // Filter Logic
    const filteredUsers = users.filter(user => 
        (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch(role) {
            case 'superadmin': return 'bg-[#ffbe00] text-black border-[#ffbe00]';
            case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'host': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    return (
        <main>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        User <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-600">Control</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Kelola akses role member, host, dan admin.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-2xl font-black text-white">{users.length}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Total User</span>
                </div>
            </div>

            {/* Search */}
            <div className="bg-[#1A1A1A] p-4 rounded-[2rem] border border-white/5 mb-6 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-500 ml-2" />
                <Input 
                    placeholder="Cari nama atau email..." 
                    className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-600 font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* User List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ffbe00] w-10 h-10"/></div>
            ) : (
                <div className="space-y-3">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="group bg-[#151515] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#ffbe00]/30 rounded-[2rem] p-4 transition-all flex flex-col md:flex-row items-center gap-4">
                            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                                <Avatar className="w-12 h-12 border-2 border-[#1A1A1A] group-hover:border-[#ffbe00]">
                                    <AvatarImage src={user.image} />
                                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">{user.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`uppercase text-[10px] font-black tracking-widest ${getRoleBadgeColor(user.role)}`}>
                                    {user.role}
                                </Badge>
                                <Button 
                                    onClick={() => openManageUser(user)}
                                    size="sm" 
                                    className="bg-[#1A1A1A] hover:bg-[#ffbe00] text-gray-400 hover:text-black border border-white/10 hover:border-[#ffbe00] rounded-xl font-bold"
                                >
                                    <UserCog className="w-4 h-4 mr-2"/> Edit Role
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SHEET EDIT ROLE */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="bg-[#0a0a0a] border-l border-white/10 text-white sm:max-w-md w-full p-0 flex flex-col h-full">
                    {selectedUser && (
                        <>
                            <SheetHeader className="p-8 border-b border-white/5 bg-[#121212]">
                                <SheetTitle className="text-2xl font-black text-white">Edit Access</SheetTitle>
                                <SheetDescription className="text-gray-500">Ubah hak akses user ini dalam sistem.</SheetDescription>
                            </SheetHeader>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-6">
                                    <div className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                        <Avatar className="w-12 h-12"><AvatarImage src={selectedUser.image} /></Avatar>
                                        <div>
                                            <p className="font-bold text-white">{selectedUser.name}</p>
                                            <p className="text-xs text-gray-500">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest flex items-center gap-2">
                                            <Shield className="w-4 h-4"/> Assign New Role
                                        </label>
                                        <div className="bg-[#1A1A1A] p-1 rounded-2xl border border-white/5">
                                            <Select value={editRole} onValueChange={(val: UserRole) => setEditRole(val)}>
                                                <SelectTrigger className="w-full bg-transparent border-none h-12 text-white font-bold">
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                    <SelectItem value="member">Member (User)</SelectItem>
                                                    <SelectItem value="host">Host (Jaga Lapangan)</SelectItem>
                                                    <SelectItem value="admin">Admin (Backoffice)</SelectItem>
                                                    <SelectItem value="superadmin" className="text-[#ffbe00]">Superadmin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-[10px] text-gray-500 leading-relaxed">
                                            *Perubahan role akan efektif saat user login berikutnya.
                                        </p>
                                    </div>
                                </div>
                            </ScrollArea>

                            <SheetFooter className="p-6 border-t border-white/5 bg-[#121212]">
                                <Button 
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="w-full h-12 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : "SIMPAN PERUBAHAN"}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </main>
    );
}
