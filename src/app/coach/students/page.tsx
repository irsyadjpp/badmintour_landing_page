
'use client';

import { useState } from 'react';
import { Search, User, MoreHorizontal, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CoachStudentsPage() {
    const [search, setSearch] = useState('');

    // Mock Data
    const students = [
        { id: 1, name: "Budi Santoso", level: "Intermediate", sessions: 12, status: "Active", image: "", lastSession: "2 days ago" },
        { id: 2, name: "Siti Aminah", level: "Beginner", sessions: 4, status: "Active", image: "", lastSession: "1 week ago" },
        { id: 3, name: "Kevin Sanjaya KW", level: "Advanced", sessions: 45, status: "Inactive", image: "", lastSession: "1 month ago" },
    ];

    const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-[#00f2ea]" /> MY STUDENTS
                    </h1>
                    <p className="text-gray-400">Kelola data murid dan pantau progress latihan mereka.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Cari nama murid..." 
                        className="pl-10 bg-[#151515] border-white/10 rounded-xl text-white focus:border-[#00f2ea]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <Card key={student.id} className="bg-[#151515] border-white/5 p-6 rounded-[2rem] group hover:border-[#00f2ea]/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f2ea]/5 rounded-full blur-[40px] group-hover:bg-[#00f2ea]/10 transition"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <Avatar className="w-16 h-16 border-2 border-[#1A1A1A] shadow-lg">
                                <AvatarImage src={student.image} />
                                <AvatarFallback className="bg-[#222] text-[#00f2ea] font-bold">{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Badge variant="outline" className={student.status === 'Active' ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-gray-500 border-gray-500/20"}>
                                {student.status}
                            </Badge>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[#00f2ea] transition-colors">{student.name}</h3>
                                <p className="text-sm text-gray-500">{student.level} Player</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Sessions</p>
                                    <p className="text-lg font-black text-white">{student.sessions}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Last Trained</p>
                                    <p className="text-sm font-bold text-white mt-1">{student.lastSession}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl h-10 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-2" /> Report
                                </Button>
                                <Button className="flex-1 bg-[#1A1A1A] border border-white/10 text-white hover:text-[#00f2ea] hover:border-[#00f2ea] font-bold rounded-xl h-10 text-xs">
                                    <MessageSquare className="w-3 h-3 mr-2" /> Chat
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
