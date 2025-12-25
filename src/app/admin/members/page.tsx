'use client';

import { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type Member = {
  id: string;
  name: string;
  level: 'Advance' | 'Intermediate' | 'Newbie';
  joinDate: string;
  status: 'Active' | 'Banned';
  avatar: string;
};

const initialMembers: Member[] = [
    { id: 'M-001', name: 'Kevin Sanjaya', level: 'Advance', joinDate: '24 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Kevin&background=000&color=fff' },
    { id: 'M-002', name: 'Budi Santoso', level: 'Intermediate', joinDate: '01 Jan 2025', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random' },
];

const getLevelBadgeClass = (level: string) => {
    switch (level) {
        case 'Advance': return 'bg-bad-blue/20 text-bad-blue border-bad-blue/20 border';
        case 'Intermediate': return 'bg-bad-yellow/20 text-bad-yellow border-bad-yellow/20 border';
        default: return 'bg-bad-green/20 text-bad-green border-bad-green/20 border';
    }
}

export default function MemberManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [currentFilter, setCurrentFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
        const matchFilter = currentFilter === 'Semua' || member.level === currentFilter;
        const matchSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            member.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });
  }, [members, currentFilter, searchQuery]);

  const stats = { total: 1240, active: 980, advance: 145, newReg: 12 };
  const filters = ['Semua', 'Advance', 'Intermediate'];

  return (
    <main>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Database Member</h1>
            <p className="text-gray-400 mt-2 font-medium">Kelola data pemain, level skill, dan status.</p>
        </div>
        <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 h-auto text-sm">
            <Plus className="w-4 h-4"/>
            <span>Tambah Member</span>
        </Button>
      </div>

      {/* Dark Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1A1A1A] text-white p-6 rounded-[2rem] border border-white/5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total User</p>
            <p className="text-4xl font-jersey mt-1">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-[#1A1A1A] text-white p-6 rounded-[2rem] border border-white/5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active</p>
            <p className="text-4xl font-jersey text-bad-green mt-1">{stats.active.toLocaleString()}</p>
        </div>
        <div className="bg-[#1A1A1A] text-white p-6 rounded-[2rem] border border-white/5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Advance</p>
            <p className="text-4xl font-jersey text-bad-blue mt-1">{stats.advance.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest relative z-10">New Regis</p>
            <p className="text-4xl font-jersey text-white mt-1 relative z-10">+{stats.newReg} <span className="text-sm font-sans font-medium text-gray-500">/ week</span></p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1A1A1A] text-white rounded-[2.5rem] p-8 shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-96 group">
                <Input 
                    type="text" 
                    placeholder="Cari nama / ID..." 
                    className="w-full pl-12 pr-4 py-3 bg-[#121212] border-white/10 rounded-full font-bold text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-bad-yellow focus:border-bad-yellow transition h-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-bad-yellow transition" />
            </div>
            <div className="flex gap-2 p-1 bg-[#121212] rounded-full border border-white/5">
                {filters.map(filter => (
                    <Button 
                        key={filter}
                        variant="ghost"
                        onClick={() => setCurrentFilter(filter)}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${currentFilter === filter ? 'bg-[#252525] text-white shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-6 mb-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="col-span-4">Member Info</div>
            <div className="col-span-2">Level Skill</div>
            <div className="col-span-2">Join Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div key={member.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-[#121212] border border-white/5 hover:border-white/20 rounded-2xl transition group cursor-default">
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                    <Image src={member.avatar} width={48} height={48} alt={member.name} className="w-12 h-12 rounded-full border-2 border-[#1A1A1A]"/>
                    <div>
                        <p className="font-bold text-white text-lg leading-none">{member.name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {member.id}</p>
                    </div>
                </div>
                <div className="col-span-6 md:col-span-2">
                    <Badge className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-opacity-80 ${getLevelBadgeClass(member.level)}`}>
                        {member.level}
                    </Badge>
                </div>
                <div className="col-span-6 md:col-span-2 text-sm font-bold text-gray-400">{member.joinDate}</div>
                <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-bad-green shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-white font-bold text-xs">{member.status}</span>
                </div>
                <div className="col-span-6 md:col-span-2 text-right">
                    <button className="text-gray-500 hover:text-white font-bold text-xs underline decoration-gray-700 hover:decoration-white underline-offset-4 transition">Edit Profile</button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
