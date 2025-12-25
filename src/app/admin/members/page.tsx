
'use client';
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Tipe data dummy untuk contoh
const members = [
  {
    id: "M-2024-001",
    name: "Kevin Sanjaya",
    email: "kevin.sanjaya@example.com",
    avatar: "https://ui-avatars.com/api/?name=Kevin+Sanjaya&background=fff&color=000",
    level: "Advance",
    joinDate: "24 Nov 2024",
    status: "Active Member",
    statusVariant: "active",
    phone: "0812-3456-xxxx"
  },
  {
    id: "M-2025-088",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random",
    level: "Newbie",
    joinDate: "01 Jan 2025",
    status: "Guest / Trial",
    statusVariant: "guest",
    phone: "0819-9988-xxxx"
  },
  {
    id: "M-2023-042",
    name: "Joko Kendil",
    email: "joko.kendil@example.com",
    avatar: "https://ui-avatars.com/api/?name=Joko+Kendil&background=random",
    level: "Unknown",
    joinDate: "--",
    status: "Suspended",
    statusVariant: "banned",
    phone: ""
  },
];

const getLevelBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
        case 'advance':
            return 'bg-bad-blue/10 text-bad-blue border-bad-blue/20';
        case 'intermediate':
            return 'bg-yellow-100 text-yellow-600 border-yellow-200';
        case 'newbie':
            return 'bg-green-50 text-green-600 border-green-200';
        default:
            return 'bg-gray-100 text-gray-500 border-gray-200';
    }
}

const getLevelDotClass = (level: string) => {
    switch (level.toLowerCase()) {
        case 'advance':
            return 'bg-bad-blue';
        case 'intermediate':
            return 'bg-yellow-500';
        case 'newbie':
            return 'bg-green-500';
        default:
            return 'bg-gray-400';
    }
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'active':
            return 'text-bad-green bg-green-50';
        case 'guest':
            return 'text-gray-500 bg-gray-100';
        case 'banned':
            return 'text-white bg-red-500';
        default:
            return 'text-gray-500 bg-gray-100';
    }
}


export default function MemberManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
            <h1 className="text-4xl font-black text-bad-dark tracking-tight">Database Member</h1>
            <p className="text-gray-500 mt-1">Kelola data pemain, level skill, dan status membership.</p>
        </div>
        
        <Button className="bg-bad-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-bad-red transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Tambah Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total User</p>
            <p className="text-3xl font-black text-bad-dark mt-1">1,420</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 w-2 h-2 bg-bad-green rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active This Month</p>
            <p className="text-3xl font-black text-bad-green mt-1">850</p>
        </div>
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Advance Level</p>
            <p className="text-3xl font-black text-bad-blue mt-1">120</p>
        </div>
            <div className="bg-bad-dark p-5 rounded-[1.5rem] border border-bad-dark shadow-lg">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Registrations</p>
            <p className="text-3xl font-black text-white mt-1">+45 <span className="text-sm font-medium text-gray-400">/ week</span></p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[1.5rem] border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-2">
            
        <div className="relative w-full md:w-96">
            <Input type="text" placeholder="Cari nama, email, atau ID..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-bad-dark/10 transition-all placeholder-gray-400 border border-transparent focus:border-gray-200 h-auto" />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex gap-1 overflow-x-auto p-1 w-full md:w-auto">
            <Button variant="ghost" className="px-5 py-2 rounded-xl bg-bad-dark text-white text-sm font-bold shadow-md hover:bg-bad-dark">Semua</Button>
            <Button variant="ghost" className="px-5 py-2 rounded-xl bg-white text-gray-500 text-sm font-bold hover:bg-gray-100 transition border border-transparent hover:border-gray-200">Advance</Button>
            <Button variant="ghost" className="px-5 py-2 rounded-xl bg-white text-gray-500 text-sm font-bold hover:bg-gray-100 transition border border-transparent hover:border-gray-200">Intermediate</Button>
            <Button variant="ghost" className="px-5 py-2 rounded-xl bg-white text-gray-500 text-sm font-bold hover:bg-gray-100 transition border border-transparent hover:border-gray-200">Newbie</Button>
        </div>
      </div>
      
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <div className="col-span-4">Member Info</div>
        <div className="col-span-2">Level Skill</div>
        <div className="col-span-2">Join Date</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className={`group bg-white p-4 rounded-2xl border border-gray-100 hover:border-bad-dark/20 hover:shadow-lg transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative ${member.statusVariant === 'banned' ? 'bg-red-50/50 hover:border-red-300 opacity-75 hover:opacity-100' : ''}`}>
            
            <div className="col-span-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full p-[2px] ${member.statusVariant !== 'banned' ? 'bg-gradient-to-br from-bad-dark to-gray-700' : ''}`}>
                <Image src={member.avatar} width={48} height={48} alt={member.name} className={`w-full h-full rounded-full border-2 border-white object-cover ${member.statusVariant === 'banned' ? 'grayscale' : ''}`} />
              </div>
              <div>
                <p className={`font-black text-gray-900 text-lg leading-tight group-hover:text-bad-red transition-colors ${member.statusVariant === 'banned' ? 'line-through decoration-red-500' : ''}`}>{member.name}</p>
                <p className={`text-xs font-mono ${member.statusVariant === 'banned' ? 'text-red-400 font-bold' : 'text-gray-500'}`}>{member.statusVariant !== 'banned' ? `ID: ${member.id} • ${member.phone}` : 'BANNED USER'}</p>
              </div>
            </div>

            <div className="col-span-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide ${getLevelBadgeClass(member.level)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getLevelDotClass(member.level)}`}></span> {member.level}
              </span>
            </div>

            <div className="col-span-2 text-sm font-bold text-gray-600">
              {member.joinDate}
            </div>

            <div className="col-span-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusBadgeClass(member.statusVariant)}`}>{member.status}</span>
            </div>

            <div className="col-span-2 flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {member.statusVariant !== 'banned' ? (
                    <>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-bad-yellow hover:text-black text-gray-500">
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-bad-red hover:text-white text-gray-500">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </>
                ) : (
                    <Button variant="ghost" className="w-24 h-8 rounded-lg bg-white border border-gray-200 text-xs font-bold hover:bg-bad-green hover:text-white hover:border-bad-green transition">
                        Unban User
                    </Button>
                )}
            </div>
          </div>
        ))}
      </div>
      
       <div className="flex justify-between items-center mt-8">
            <p className="text-xs font-bold text-gray-400">Showing 1-3 of 1,420</p>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl"><span className="sr-only">Previous</span>{'<'}</Button>
                <Button size="icon" className="w-10 h-10 rounded-xl bg-bad-dark text-white font-bold shadow-lg">1</Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl">2</Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl">3</Button>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl"><span className="sr-only">Next</span>{'>'}</Button>
            </div>
        </div>
    </main>
  );
}

