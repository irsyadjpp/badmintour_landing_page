'use client';

import { useState } from 'react';
import { 
    Users, 
    Megaphone, 
    ShieldAlert, 
    Award, 
    Search, 
    MoreVertical, 
    Send, 
    Crown, 
    Swords, 
    Ban, 
    CheckCircle2, 
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- MOCK DATA ---
const initialMembers = [
    { id: 1, name: "Budi Santoso", nickname: "Busan", role: "Regular", status: "Active", attendance: 95, badges: ["Early Bird"] },
    { id: 2, name: "Siti Aminah", nickname: "Siti", role: "MVP", status: "Active", attendance: 100, badges: ["MVP", "Loyal"] },
    { id: 3, name: "Joko Anwar", nickname: "Joko", role: "Regular", status: "Risk", attendance: 40, badges: [] }, // Sering No Show
    { id: 4, name: "Rudi Tabuti", nickname: "Rudi", role: "Banned", status: "Banned", attendance: 0, badges: [] },
];

const squads = [
    { id: 1, name: "PB Djarum Black", level: "Pro", members: 6, winRate: 85 },
    { id: 2, name: "Geng Komplek", level: "Beginner", members: 12, winRate: 40 },
    { id: 3, name: "Rajawali Squad", level: "Intermediate", members: 8, winRate: 60 },
];

export default function HostCommunityPage() {
    const [members, setMembers] = useState(initialMembers);
    const [blastMessage, setBlastMessage] = useState("");
    const [selectedMember, setSelectedMember] = useState<any>(null);

    // --- ACTIONS ---

    const handleBanUser = (id: number) => {
        setMembers(members.map(m => m.id === id ? { ...m, status: "Banned", role: "Banned" } : m));
        toast({
            title: "User Banned",
            description: "Member telah dimasukkan ke daftar blacklist.",
            variant: "destructive"
        });
    };

    const handleGiveBadge = (badge: string) => {
        if (!selectedMember) return;
        // Logic update badge ke DB disini
        toast({
            title: "Badge Awarded! 🏅",
            description: `${badge} badge diberikan kepada ${selectedMember.nickname}.`,
            className: "bg-[#ffbe00] text-black border-none"
        });
        setSelectedMember(null);
    };

    const handleSendBlast = () => {
        if (!blastMessage) return;
        toast({
            title: "Blast Sent! 🚀",
            description: `Notifikasi dikirim ke ${members.length} alumni mabar.`,
            className: "bg-[#ca1f3d] text-white border-none"
        });
        setBlastMessage("");
    };

    return (
        <div className="space-y-8 pb-24">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Community <span className="text-[#ca1f3d]">Hub</span></h1>
                    <p className="text-gray-400 mt-2">Kelola reputasi member, squad, dan kirim info mabar.</p>
                </div>
                <div className="flex items-center gap-2 bg-[#151515] px-4 py-2 rounded-xl border border-white/10">
                    <Users className="w-5 h-5 text-[#ffbe00]" />
                    <span className="text-2xl font-black text-white">{members.filter(m => m.status !== 'Banned').length}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Active Members</span>
                </div>
            </div>

            {/* MAIN TABS */}
            <Tabs defaultValue="members" className="w-full">
                <TabsList className="bg-[#151515] p-1 rounded-2xl border border-white/5 mb-8 h-14 w-full md:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="members" className="h-12 rounded-xl px-6 data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white font-bold">
                        <Users className="w-4 h-4 mr-2" /> Member List
                    </TabsTrigger>
                    <TabsTrigger value="blast" className="h-12 rounded-xl px-6 data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white font-bold">
                        <Megaphone className="w-4 h-4 mr-2" /> Blast Info
                    </TabsTrigger>
                    <TabsTrigger value="squads" className="h-12 rounded-xl px-6 data-[state=active]:bg-[#ca1f3d] data-[state=active]:text-white font-bold">
                        <Swords className="w-4 h-4 mr-2" /> Squads
                    </TabsTrigger>
                </TabsList>

                {/* 1. MEMBERS & REPUTATION */}
                <TabsContent value="members" className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <Input 
                            placeholder="Cari member berdasarkan nama atau nickname..." 
                            className="bg-[#151515] border-white/10 h-14 pl-12 rounded-[1.5rem] text-white focus:border-[#ca1f3d]" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <Card key={member.id} className="bg-[#151515] border-white/5 p-5 rounded-[2rem] relative overflow-hidden group hover:border-[#ca1f3d]/30 transition-all">
                                {/* Status Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                    member.status === 'Banned' ? 'bg-gray-800' : 
                                    member.status === 'Risk' ? 'bg-red-500' : 
                                    member.attendance === 100 ? 'bg-[#ffbe00]' : 'bg-green-500'
                                }`}></div>

                                <div className="flex justify-between items-start pl-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-14 h-14 border-2 border-[#1A1A1A]">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} />
                                            <AvatarFallback>{member.nickname[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-none flex items-center gap-2">
                                                {member.nickname}
                                                {member.role === 'MVP' && <Crown className="w-4 h-4 text-[#ffbe00] fill-current" />}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">{member.name}</p>
                                            
                                            {/* Badges Display */}
                                            <div className="flex gap-1 mt-2">
                                                {member.badges.map(b => (
                                                    <Badge key={b} variant="outline" className="text-[9px] border-[#ffbe00]/30 text-[#ffbe00] px-1.5 py-0 h-5">
                                                        {b}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-white w-48">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSelectedMember(member); }} className="focus:bg-[#ffbe00] focus:text-black cursor-pointer">
                                                        <Award className="w-4 h-4 mr-2" /> Give Badge
                                                    </DropdownMenuItem>
                                                </DialogTrigger>
                                                {/* Dialog Content diletakkan di luar loop idealnya, tapi untuk demo ditaruh sini agar simple */}
                                                <DialogContent className="bg-[#151515] border-white/10 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle>Award Loyalty Badge</DialogTitle>
                                                        <DialogDescription className="text-gray-400">Pilih badge untuk {selectedMember?.nickname}.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-4 py-4">
                                                        <BadgeOption icon={Crown} title="MVP" desc="Best Player" color="text-[#ffbe00]" onClick={() => handleGiveBadge('MVP')} />
                                                        <BadgeOption icon={CheckCircle2} title="Most Loyal" desc="Never Absen" color="text-green-500" onClick={() => handleGiveBadge('Loyal')} />
                                                        <BadgeOption icon={Search} title="Talent" desc="Rising Star" color="text-blue-500" onClick={() => handleGiveBadge('Talent')} />
                                                        <BadgeOption icon={Users} title="Friendly" desc="Good Attitude" color="text-pink-500" onClick={() => handleGiveBadge('Friendly')} />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem onClick={() => handleBanUser(member.id)} className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                                                <Ban className="w-4 h-4 mr-2" /> Ban / Blacklist
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Reputation Meter */}
                                <div className="mt-6 pl-4">
                                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                                        <span className="text-gray-500">Attendance Rate</span>
                                        <span className={`${member.attendance < 50 ? 'text-red-500' : 'text-white'}`}>{member.attendance}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${member.attendance < 50 ? 'bg-red-600' : 'bg-green-500'}`} 
                                            style={{ width: `${member.attendance}%` }}
                                        ></div>
                                    </div>
                                    {member.attendance < 50 && member.status !== 'Banned' && (
                                        <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3"/> Warning: Frequent No-Show
                                        </p>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* 2. BLAST ANNOUNCEMENT */}
                <TabsContent value="blast">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Form Blast */}
                        <div className="lg:col-span-8">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                                    <Megaphone className="w-6 h-6 text-[#ca1f3d]" /> New Broadcast
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Target Audience</label>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="bg-[#ca1f3d] text-white hover:bg-[#a01830] cursor-pointer h-8 px-4 rounded-lg">All Alumni</Badge>
                                            <Badge variant="outline" className="border-white/10 text-gray-400 hover:text-white cursor-pointer h-8 px-4 rounded-lg">MVP Only</Badge>
                                            <Badge variant="outline" className="border-white/10 text-gray-400 hover:text-white cursor-pointer h-8 px-4 rounded-lg">Waiting List</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                        <Textarea 
                                            placeholder="Tulis pesan... Contoh: Slot sisa 2 untuk nanti malam, siapa cepat dia dapat!" 
                                            className="bg-[#0a0a0a] border-white/10 text-white rounded-2xl min-h-[150px] p-4 text-lg"
                                            value={blastMessage}
                                            onChange={(e) => setBlastMessage(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-600 text-right">{blastMessage.length}/160 chars</p>
                                    </div>

                                    <Button 
                                        onClick={handleSendBlast}
                                        disabled={!blastMessage}
                                        className="w-full h-14 bg-[#ca1f3d] hover:bg-[#a01830] text-white font-black rounded-xl shadow-[0_0_20px_rgba(202,31,61,0.4)]"
                                    >
                                        <Send className="w-5 h-5 mr-2" /> KIRIM NOTIFIKASI
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Preview / History */}
                        <div className="lg:col-span-4 space-y-4">
                            <h4 className="text-sm font-bold text-gray-500 uppercase">Recent Blasts</h4>
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-[#151515] border border-white/5 p-4 rounded-2xl opacity-70">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="border-white/10 text-[10px] text-gray-400">2 days ago</Badge>
                                        <span className="text-[10px] text-[#ca1f3d] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Sent</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        "Mabar besok di GOR Wartawan sudah open slot ya! Jangan sampai kehabisan."
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* 3. SQUAD MANAGEMENT */}
                <TabsContent value="squads">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {squads.map((squad) => (
                            <Card key={squad.id} className="bg-[#151515] border-white/5 p-6 rounded-[2rem] hover:border-[#ffbe00]/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl">
                                        🛡️
                                    </div>
                                    <Badge variant="outline" className="border-[#ffbe00]/30 text-[#ffbe00] font-bold">
                                        {squad.level}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#ffbe00] transition-colors">{squad.name}</h3>
                                <p className="text-sm text-gray-500 mb-6">{squad.members} Active Members</p>

                                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5 flex justify-between items-center mb-6">
                                    <span className="text-xs font-bold text-gray-500">Win Rate</span>
                                    <span className="text-lg font-black text-white">{squad.winRate}%</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10">
                                        Detail
                                    </Button>
                                    <Button className="flex-1 bg-[#ffbe00] hover:bg-yellow-400 text-black font-bold rounded-xl">
                                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        
                        {/* Invite Squad Card */}
                        <div className="border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-6 hover:border-[#ca1f3d]/50 hover:bg-[#ca1f3d]/5 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Search className="w-8 h-8 text-gray-500 group-hover:text-[#ca1f3d]" />
                            </div>
                            <h3 className="font-bold text-gray-500 group-hover:text-[#ca1f3d]">Find Squad to Challenge</h3>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
}

// Helper Component untuk Pilihan Badge
function BadgeOption({ icon: Icon, title, desc, color, onClick }: any) {
    return (
        <div 
            onClick={onClick}
            className="bg-[#0a0a0a] border border-white/10 p-3 rounded-xl hover:bg-white/5 hover:border-[#ffbe00]/50 cursor-pointer transition-all flex flex-col items-center text-center group"
        >
            <Icon className={`w-8 h-8 mb-2 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-white font-bold text-sm">{title}</span>
            <span className="text-[10px] text-gray-500">{desc}</span>
        </div>
    )
}
