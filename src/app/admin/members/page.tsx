
'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Plus,
  Search,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

type Member = {
  id: string;
  name: string;
  phone: string;
  level: 'Advance' | 'Intermediate' | 'Newbie' | 'Unknown';
  joinDate: string;
  status: 'Active' | 'Trial' | 'Banned';
  avatar: string;
};

const initialMembers: Member[] = [
    { id: 'M-001', name: 'Kevin Sanjaya', phone: '0812-3456-7890', level: 'Advance', joinDate: '24 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Kevin+Sanjaya&background=fff&color=000' },
    { id: 'M-002', name: 'Budi Santoso', phone: '0819-9988-7766', level: 'Newbie', joinDate: '01 Jan 2025', status: 'Trial', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random' },
    { id: 'M-003', name: 'Siti Aminah', phone: '0857-1234-5678', level: 'Intermediate', joinDate: '15 Dec 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=random' },
    { id: 'M-004', name: 'Joko Kendil', phone: '0813-0000-1111', level: 'Newbie', joinDate: '10 Oct 2024', status: 'Banned', avatar: 'https://ui-avatars.com/api/?name=Joko+Kendil&background=random' },
    { id: 'M-005', name: 'Taufik Hidayat', phone: '0811-2233-4455', level: 'Advance', joinDate: '01 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Taufik+Hidayat&background=random' },
    { id: 'M-006', name: 'Susi Susanti', phone: '0812-9988-7766', level: 'Advance', joinDate: '05 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Susi+Susanti&background=random' },
    { id: 'M-007', name: 'Alan Budikusuma', phone: '0812-5555-6666', level: 'Intermediate', joinDate: '07 Dec 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Alan+Budikusuma&background=random' },
    // Add more members to test pagination
    { id: 'M-008', name: 'Ricky Subagja', phone: '0812-1111-2222', level: 'Advance', joinDate: '11 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Ricky+Subagja&background=random' },
    { id: 'M-009', name: 'Rexy Mainaky', phone: '0812-3333-4444', level: 'Advance', joinDate: '12 Nov 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Rexy+Mainaky&background=random' },
    { id: 'M-010', name: 'Liliyana Natsir', phone: '0812-5555-4444', level: 'Intermediate', joinDate: '18 Dec 2024', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Liliyana+Natsir&background=random' },
    { id: 'M-011', name: 'Debby Susanto', phone: '0812-6666-7777', level: 'Intermediate', joinDate: '20 Dec 2024', status: 'Trial', avatar: 'https://ui-avatars.com/api/?name=Debby+Susanto&background=random' },
    { id: 'M-012', name: 'Jonatan Christie', phone: '0812-8888-9999', level: 'Advance', joinDate: '02 Jan 2025', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Jonatan+Christie&background=random' },
];

const getLevelBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
        case 'advance':
            return 'bg-bad-blue/10 text-bad-blue border-bad-blue/20';
        case 'intermediate':
            return 'bg-bad-yellow/20 text-yellow-700 border-bad-yellow/40';
        case 'newbie':
            return 'bg-green-50 text-green-600 border-green-200';
        default:
            return 'bg-gray-100 text-gray-500 border-gray-200';
    }
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'Active':
            return 'text-bad-green bg-green-50';
        case 'Banned':
            return 'text-white bg-bad-red';
        default:
            return 'text-gray-500 bg-gray-100';
    }
}

export default function MemberManagementPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
        const matchFilter = currentFilter === 'all' || member.level === currentFilter;
        const matchSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.phone.includes(searchQuery);
        return matchFilter && matchSearch;
    });
  }, [members, currentFilter, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter(m => m.status === 'Active').length,
    advance: members.filter(m => m.level === 'Advance').length,
  }), [members]);

  const handleFilter = (filter: string) => {
    setCurrentFilter(filter);
    setCurrentPage(1);
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      alert('Simulasi: Data Member Berhasil Disimpan!');
      setIsModalOpen(false);
      // In a real app, you would add the new member to the state here
  }

  const filters = ['all', 'Advance', 'Intermediate', 'Newbie'];

  return (
    <main className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-black text-bad-dark tracking-tight">Database Member</h1>
            <p className="text-gray-500 mt-1">Kelola data pemain, level skill, dan status membership.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="bg-bad-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-bad-red transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Tambah Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white rounded-[2rem] p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-bad-dark">Tambah Member Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nama Depan</label>
                            <Input type="text" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-bad-dark h-auto" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Nama Belakang</label>
                            <Input type="text" required className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-bad-dark h-auto" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                        <Input type="tel" required placeholder="0812..." className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-bad-dark h-auto" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Skill Level</label>
                         <Select defaultValue="Newbie">
                            <SelectTrigger className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-bad-dark h-auto">
                                <SelectValue placeholder="Pilih level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Newbie">Newbie (Pemula)</SelectItem>
                                <SelectItem value="Intermediate">Intermediate (Menengah)</SelectItem>
                                <SelectItem value="Advance">Advance (Mahir)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 py-3 h-auto rounded-xl border-gray-200 font-bold text-gray-500 hover:bg-gray-50">Batal</Button>
                        <Button type="submit" className="flex-1 py-3 h-auto rounded-xl bg-bad-dark text-white font-bold hover:bg-bad-green shadow-lg">Simpan Member</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total User</p>
            <p className="text-3xl font-black text-bad-dark mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 w-2 h-2 bg-bad-green rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active</p>
            <p className="text-3xl font-black text-bad-green mt-1">{stats.active}</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advance</p>
            <p className="text-3xl font-black text-bad-blue mt-1">{stats.advance}</p>
        </div>
            <div className="bg-bad-dark p-5 rounded-[1.5rem] border border-bad-dark shadow-lg">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Registrations</p>
            <p className="text-3xl font-black text-white mt-1">+12 <span className="text-sm font-medium text-gray-400">/ week</span></p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[1.5rem] border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-2 sticky top-4 z-30">
        <div className="relative w-full md:w-96">
            <Input 
                type="text" 
                placeholder="Cari nama, email, atau ID..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-bad-dark/10 transition-all placeholder-gray-400 border border-transparent focus:border-gray-200 h-auto"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                }}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex gap-1 overflow-x-auto p-1 w-full md:w-auto">
            {filters.map(filter => (
                <Button 
                    key={filter}
                    variant="ghost" 
                    onClick={() => handleFilter(filter)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all border border-transparent
                        ${currentFilter === filter 
                            ? 'bg-bad-dark text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'}`
                    }
                >
                    {filter}
                </Button>
            ))}
        </div>
      </div>
      
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Member Info</div>
        <div className="col-span-2">Level Skill</div>
        <div className="col-span-2">Join Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      <div className="space-y-3 min-h-[450px]">
        {paginatedMembers.length > 0 ? paginatedMembers.map((member) => (
          <div key={member.id} className={`group p-4 rounded-2xl border transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative ${member.status === 'Banned' ? 'bg-red-50/50 border-red-100 hover:border-red-300 opacity-75 hover:opacity-100' : 'bg-white border-gray-100 hover:border-bad-dark/20 hover:shadow-lg'}`}>
            <div className="col-span-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full p-[2px] overflow-hidden shrink-0 ${member.status !== 'Banned' ? 'bg-gradient-to-br from-bad-dark to-gray-700' : 'bg-gray-200'}`}>
                <Image src={member.avatar} width={48} height={48} alt={member.name} className={`w-full h-full rounded-full border-2 border-white object-cover ${member.status === 'Banned' ? 'grayscale' : ''}`} />
              </div>
              <div>
                <p className={`font-black text-gray-900 text-lg leading-tight group-hover:text-bad-red transition-colors ${member.status === 'Banned' ? 'line-through decoration-red-500' : ''}`}>{member.name}</p>
                <p className={`text-xs font-mono ${member.status === 'Banned' ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                  {member.status !== 'Banned' ? `ID: ${member.id} • ${member.phone}` : 'BANNED USER'}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              <Badge className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wide border ${getLevelBadgeClass(member.level)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full bg-current`} /> {member.level}
              </Badge>
            </div>
            <div className="col-span-2 text-sm font-bold text-gray-600">
              {member.joinDate}
            </div>
            <div className="col-span-2">
              <Badge className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusBadgeClass(member.status)}`}>{member.status}</Badge>
            </div>
            <div className="col-span-2 flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {member.status !== 'Banned' ? (
                    <>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-bad-yellow hover:text-black text-gray-500" onClick={() => alert(`Edit ${member.name}`)}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-bad-red hover:text-white text-gray-500" onClick={() => alert(`Delete/Ban ${member.name}`)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <Button variant="ghost" className="w-24 h-8 rounded-lg bg-white border border-gray-200 text-xs font-bold hover:bg-bad-green hover:text-white hover:border-bad-green transition" onClick={() => alert(`Unban ${member.name}`)}>
                        Unban User
                    </Button>
                )}
            </div>
          </div>
        )) : (
            <div className="text-center py-20 text-gray-400 font-bold">
                Tidak ada data member yang ditemukan.
            </div>
        )}
      </div>
      
       <div className="flex justify-between items-center mt-8">
            <p className="text-xs font-bold text-gray-400">Showing {filteredMembers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length}</p>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{'<'}</Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button 
                        key={page}
                        size="icon" 
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page ? 'bg-bad-dark text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>{'>'}</Button>
            </div>
        </div>
    </main>
  );
}

    