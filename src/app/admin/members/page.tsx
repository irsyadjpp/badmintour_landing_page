
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
    { id: 'M-001', name: 'Kevin Sanjaya', level: 'Advance', joinDate: '24 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Kevin&background=121212&color=fff' },
    { id: 'M-002', name: 'Budi Santoso', level: 'Intermediate', joinDate: '01 Jan 2025', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Budi&background=random' },
];

const getLevelBadgeClass = (level: string) => {
    switch (level) {
        case 'Advance': return 'bg-blue-50 text-blue-600';
        case 'Intermediate': return 'bg-yellow-50 text-yellow-600';
        default: return 'bg-green-50 text-green-600';
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

  const stats = {
    total: 1240,
    active: 980,
    advance: 145,
    newReg: 12
  };

  const filters = ['Semua', 'Advance', 'Intermediate'];

  return (
    <main className="ml-28 mr-6 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Database Member</h1>
            <p className="text-gray-400 mt-2 font-medium">Kelola data pemain, level skill, dan status.</p>
        </div>
        <Button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-lg flex items-center gap-2 h-auto text-sm">
            <Plus className="w-4 h-4"/>
            <span>Tambah Member</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white text-black p-5 rounded-[2rem]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total User</p>
            <p className="text-3xl font-black mt-1">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white text-black p-5 rounded-[2rem]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</p>
            <p className="text-3xl font-black text-bad-green mt-1">{stats.active.toLocaleString()}</p>
        </div>
        <div className="bg-white text-black p-5 rounded-[2rem]">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Advance</p>
            <p className="text-3xl font-black text-bad-blue mt-1">{stats.advance.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-black p-5 rounded-[2rem] border border-white/10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Regis</p>
            <p className="text-3xl font-black text-white mt-1">+{stats.newReg} <span className="text-sm font-medium text-gray-500">/ week</span></p>
        </div>
      </div>

      <div className="bg-white text-black rounded-[2.5rem] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
                <Input 
                    type="text" 
                    placeholder="Cari nama / ID..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black h-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex gap-2">
                {filters.map(filter => (
                    <Button 
                        key={filter}
                        variant={currentFilter === filter ? 'default' : 'ghost'}
                        onClick={() => setCurrentFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition ${currentFilter === filter ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-4">Member Info</div>
            <div className="col-span-2">Level Skill</div>
            <div className="col-span-2">Join Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div key={member.id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 rounded-2xl transition group">
                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                    <Image src={member.avatar} width={40} height={40} alt={member.name} className="w-10 h-10 rounded-full"/>
                    <div>
                        <p className="font-bold text-black text-lg leading-none">{member.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-1">ID: {member.id}</p>
                    </div>
                </div>
                <div className="col-span-6 md:col-span-2"><Badge className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getLevelBadgeClass(member.level)}`}>{member.level}</Badge></div>
                <div className="col-span-6 md:col-span-2 text-sm font-bold text-gray-500">{member.joinDate}</div>
                <div className="col-span-6 md:col-span-2"><span className="text-bad-green font-bold text-xs">● {member.status}</span></div>
                <div className="col-span-6 md:col-span-2 text-right">
                    <button className="text-gray-400 hover:text-black font-bold text-xs underline opacity-0 group-hover:opacity-100 transition">Edit</button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
