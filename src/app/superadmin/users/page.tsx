'use client';

import { useState } from 'react';
import { 
    Search, 
    Filter, 
    Shield, 
    ShieldAlert, 
    Trash2, 
    UserCog, 
    CheckCircle2, 
    Ban,
    RefreshCcw
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

// --- Tipe Data Mock ---
type UserRole = 'member' | 'host' | 'admin' | 'superadmin';
type UserStatus = 'active' | 'banned' | 'suspended';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar: string;
    joinedAt: string;
}

// --- Mock Data (Updated: Host adalah Orang/Admin Mabar) ---
const initialUsers: User[] = [
    { id: 'U-001', name: 'Irsyad JPP', email: 'irsyad@badmintour.com', role: 'superadmin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Irsyad&background=ffbe00&color=000', joinedAt: '2023-01-01' },
    { id: 'U-002', name: 'Budi Santoso', email: 'budi.mabar@gmail.com', role: 'host', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random', joinedAt: '2023-05-12' },
    { id: 'U-003', name: 'Siti Aminah', email: 'siti@gmail.com', role: 'member', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Siti&background=random', joinedAt: '2023-06-20' },
    { id: 'U-004', name: 'Kevin Sanjaya', email: 'kevin@admin.com', role: 'admin', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Kevin&background=random', joinedAt: '2023-02-15' },
    { id: 'U-005', name: 'Trouble Maker', email: 'spam@bot.com', role: 'member', status: 'banned', avatar: 'https://ui-avatars.com/api/?name=T&background=red&color=fff', joinedAt: '2023-08-01' },
];

export default function UserManagementPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State untuk Sheet Management
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    
    // State Form Edit
    const [editRole, setEditRole] = useState<UserRole>('member');
    const [editStatus, setEditStatus] = useState<UserStatus>('active');
    const [newPassword, setNewPassword] = useState('');

    // --- Helpers ---
    const getRoleBadgeColor = (role: UserRole) => {
        switch(role) {
            case 'superadmin': return 'bg-[#ffbe00] text-black border-[#ffbe00] shadow-[0_0_10px_rgba(255,190,0,0.4)]';
            case 'admin': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            case 'host': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch(role) {
            case 'superadmin': return <ShieldAlert className="w-3 h-3 mr-1" />;
            case 'admin': return <Shield className="w-3 h-3 mr-1" />;
            case 'host': return <UserCog className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    // --- Actions ---
    const openManageUser = (user: User) => {
        setSelectedUser(user);
        setEditRole(user.role);
        setEditStatus(user.status);
        setNewPassword('');
        setIsSheetOpen(true);
    };

    const handleSaveChanges = () => {
        if (!selectedUser) return;

        const updatedUsers = users.map(u => 
            u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u
        );
        setUsers(updatedUsers);
        
        if (newPassword) {
            toast({
                title: "Security Update",
                description: `Password untuk ${selectedUser.name} berhasil direset.`,
                className: "bg-green-600 border-none text-white"
            });
        } else {
            toast({
                title: "Role Updated",
                description: `Data user ${selectedUser.name} diperbarui.`,
                className: "bg-[#ffbe00] border-none text-black"
            });
        }
        setIsSheetOpen(false);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        if (confirm(`Yakin ingin menghapus permanent user ${selectedUser.name}?`)) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsSheetOpen(false);
            toast({ title: "User Deleted", description: "User telah dihapus dari database.", variant: "destructive" });
        }
    }

    const generateRandomPassword = () => {
        const randomPass = Math.random().toString(36).slice(-8);
        setNewPassword(randomPass);
    }

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Role <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-orange-600">Manager</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">Atur hierarki akses, angkat Admin, atau reset keamanan.</p>
                </div>
                
                {/* Stats Chips */}
                <div className="flex gap-3">
                    <div className="bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="bg-[#ffbe00]/10 p-2 rounded-lg text-[#ffbe00]"><ShieldAlert className="w-4 h-4"/></div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Admins</p>
                            <p className="text-xl font-jersey text-white leading-none">{users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}</p>
                        </div>
                    </div>
                    <div className="bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><UserCog className="w-4 h-4"/></div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Hosts</p>
                            <p className="text-xl font-jersey text-white leading-none">{users.filter(u => u.role === 'host').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-[#1A1A1A] p-4 rounded-[2rem] border border-white/5 mb-6 flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-500 ml-2" />
                <Input 
                    placeholder="Cari nama, email, atau role..." 
                    className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-gray-600 font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white"><Filter className="w-5 h-5"/></Button>
            </div>

            {/* User List Cards */}
            <div className="space-y-3">
                {filteredUsers.map((user) => (
                    <div 
                        key={user.id} 
                        className="group relative bg-[#151515] hover:bg-[#1A1A1A] border border-white/5 hover:border-[#ffbe00]/30 rounded-[2rem] p-4 transition-all duration-300 flex flex-col md:flex-row items-center gap-4 md:gap-6"
                    >
                        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                            <Avatar className="w-12 h-12 border-2 border-[#1A1A1A] group-hover:border-[#ffbe00] transition-colors">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                                    {user.name}
                                    {user.status === 'banned' && <Ban className="w-4 h-4 text-red-500"/>}
                                </h3>
                                <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex justify-between md:justify-center items-center gap-4 min-w-[150px]">
                            <Badge variant="outline" className={`rounded-lg px-3 py-1.5 uppercase text-[10px] font-black tracking-widest ${getRoleBadgeColor(user.role)}`}>
                                {getRoleIcon(user.role)} {user.role}
                            </Badge>
                        </div>

                        <div className="w-full md:w-auto flex justify-end">
                            <Button 
                                onClick={() => openManageUser(user)}
                                className="bg-[#1A1A1A] hover:bg-[#ffbe00] text-gray-400 hover:text-black border border-white/10 hover:border-[#ffbe00] rounded-xl font-bold text-xs h-10 px-6 transition-all shadow-lg"
                            >
                                Manage Access
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SHEET MANAGEMENT --- */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="bg-[#0a0a0a] border-l border-white/10 text-white sm:max-w-md w-full p-0 flex flex-col h-full">
                    {selectedUser && (
                        <>
                            <SheetHeader className="p-8 border-b border-white/5 bg-[#121212]">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-16 h-16 border-4 border-[#1A1A1A] shadow-xl">
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-2xl font-black text-white">{selectedUser.name}</SheetTitle>
                                        <SheetDescription className="text-gray-500 font-mono text-xs">{selectedUser.id}</SheetDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className={`${selectedUser.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} border-0`}>
                                        {selectedUser.status}
                                    </Badge>
                                </div>
                            </SheetHeader>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-8">
                                    
                                    {/* 1. ROLE MANAGEMENT (Updated Description) */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-[#ffbe00] uppercase tracking-widest flex items-center gap-2">
                                            <Shield className="w-4 h-4"/> Role Assignment
                                        </h4>
                                        <div className="bg-[#1A1A1A] p-1 rounded-2xl border border-white/5">
                                            <Select value={editRole} onValueChange={(val: UserRole) => setEditRole(val)}>
                                                <SelectTrigger className="w-full bg-transparent border-none h-12 text-white font-bold focus:ring-0">
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                                    <SelectItem value="member">Member</SelectItem>
                                                    <SelectItem value="host">Host</SelectItem> {/* REVISI: Gunakan Host Saja */}
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="superadmin" className="text-[#ffbe00] font-bold">Superadmin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* REVISI: Penjelasan Definisi Host */}
                                        <p className="text-[10px] text-gray-500 leading-relaxed">
                                            *Superadmin: Akses penuh (God Mode). <br/>
                                            *Admin: Staff back-office & manajemen. <br/>
                                            *Host: Admin Mabar / Drilling (Petugas Lapangan).
                                        </p>
                                    </div>

                                    {/* 2. SECURITY */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                                            <RefreshCcw className="w-4 h-4"/> Emergency Reset
                                        </h4>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 font-bold">New Password</label>
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Set password baru..."
                                                    className="bg-[#1A1A1A] border-white/10 text-white rounded-xl h-12 font-mono"
                                                />
                                                <Button 
                                                    onClick={generateRandomPassword}
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/5 text-gray-400"
                                                >
                                                    <RefreshCcw className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. ACCOUNT STATUS */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Status</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setEditStatus('active')}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${editStatus === 'active' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-[#1A1A1A] border-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                <CheckCircle2 className="w-5 h-5"/>
                                                <span className="text-xs font-bold">Active</span>
                                            </button>
                                            <button 
                                                onClick={() => setEditStatus('banned')}
                                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${editStatus === 'banned' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#1A1A1A] border-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                <Ban className="w-5 h-5"/>
                                                <span className="text-xs font-bold">Banned</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </ScrollArea>

                            <SheetFooter className="p-6 border-t border-white/5 bg-[#121212] gap-3">
                                <Button 
                                    onClick={handleDeleteUser}
                                    variant="ghost" 
                                    className="flex-1 h-12 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold"
                                >
                                    <Trash2 className="w-4 h-4 mr-2"/> Hapus
                                </Button>
                                <Button 
                                    onClick={handleSaveChanges}
                                    className="flex-[2] h-12 rounded-xl bg-[#ffbe00] text-black hover:bg-yellow-400 font-black"
                                >
                                    Simpan Perubahan
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </main>
    );
}
