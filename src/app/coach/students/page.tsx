'use client';

import { useState } from 'react';
import { Search, User, MessageSquare, TrendingUp, NotebookPen, Plus, Loader2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CoachStudentsPage() {
    const [search, setSearch] = useState('');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch Students
    const { data: apiData, isLoading } = useQuery({
        queryKey: ['coach-students'],
        queryFn: async () => {
            const res = await fetch('/api/coach/students');
            const json = await res.json();
            return json.data || [];
        }
    });

    const students = apiData || [];
    const filteredStudents = students.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()));

    // Notes Logic
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [noteContent, setNoteContent] = useState('');
    const [noteType, setNoteType] = useState('General');

    // Fetch Notes for Selected Student
    const { data: notes = [], isLoading: notesLoading } = useQuery({
        queryKey: ['student-notes', selectedStudent?.id],
        queryFn: async () => {
            if (!selectedStudent?.id) return [];
            const res = await fetch(`/api/coach/students/${selectedStudent.id}/notes`);
            const json = await res.json();
            return json.data || [];
        },
        enabled: !!selectedStudent?.id
    });

    // Mutation to Add Note
    const addNoteMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/coach/students/${selectedStudent.id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: noteContent, type: noteType })
            });
            if (!res.ok) throw new Error('Failed to save note');
        },
        onSuccess: () => {
            toast({ title: "Note Saved", className: "bg-green-600 text-white" });
            setNoteContent('');
            queryClient.invalidateQueries({ queryKey: ['student-notes', selectedStudent?.id] });
        }
    });

    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
                        <User className="w-8 h-8 text-[#ca1f3d]" /> My Students
                    </h1>
                    <p className="text-gray-400 font-medium">Kelola data murid & catat perkembangan mereka.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Cari nama murid..."
                        className="pl-11 h-12 bg-[#151515] border-white/10 rounded-xl text-white focus:border-[#ffbe00] placeholder:text-gray-600 transition-all focus:ring-[#ffbe00]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#ca1f3d] mx-auto" /></div>
            ) : filteredStudents.length === 0 ? (
                <div className="text-center py-20 text-gray-500 border border-white/5 border-dashed rounded-[2rem]">
                    <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Belum ada data murid.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student: any) => (
                        <Card key={student.id} className="bg-[#151515] border-white/5 p-6 rounded-[2rem] group hover:border-[#ffbe00]/30 transition-all relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ffbe00]/10 transition-all"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <Avatar className="w-16 h-16 border-2 border-[#1A1A1A] shadow-lg ring-2 ring-white/5 group-hover:ring-[#ffbe00]/30 transition-all">
                                    <AvatarImage src={student.image} />
                                    <AvatarFallback className="bg-[#222] text-[#ffbe00] font-bold">{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 font-bold px-3 py-1 text-[10px] uppercase tracking-wide">
                                    Active Student
                                </Badge>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-white group-hover:text-[#ffbe00] transition-colors">{student.name}</h3>
                                    <p className="text-sm text-gray-400 font-bold">{student.email}</p>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-white/5">
                                    {/* NOTES BUTTON */}
                                    <Dialog onOpenChange={(open) => {
                                        if (open) setSelectedStudent(student);
                                        else setSelectedStudent(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button className="flex-1 bg-white text-black hover:bg-[#ffbe00] hover:text-black font-black rounded-xl h-10 text-xs border-none shadow-md transition-all">
                                                <NotebookPen className="w-3 h-3 mr-2" /> NOTES
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md w-full bg-[#151515] border-white/10 text-white rounded-[2rem] p-0 overflow-hidden">
                                            <DialogHeader className="p-6 bg-[#1A1A1A] border-b border-white/5">
                                                <DialogTitle className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 border border-white/10">
                                                        <AvatarImage src={student.image} />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="text-lg font-black uppercase italic">{student.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Private Coach Notes</div>
                                                    </div>
                                                </DialogTitle>
                                            </DialogHeader>

                                            <div className="p-6 space-y-6 bg-[#0a0a0a]">
                                                {/* Add Note Form */}
                                                <div className="space-y-3">
                                                    <div className="flex gap-2">
                                                        <Select value={noteType} onValueChange={setNoteType}>
                                                            <SelectTrigger className="w-[120px] bg-[#151515] border-white/10 h-10 rounded-lg text-xs font-bold uppercase">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-[#151515] border-white/10 text-white">
                                                                <SelectItem value="General">General</SelectItem>
                                                                <SelectItem value="Technical">Technical</SelectItem>
                                                                <SelectItem value="Physical">Physical</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="flex-1"></div>
                                                    </div>
                                                    <Textarea
                                                        placeholder="Tulis catatan progress disini..."
                                                        className="bg-[#151515] border-white/10 rounded-xl min-h-[80px] text-sm focus:border-[#ffbe00]"
                                                        value={noteContent}
                                                        onChange={(e) => setNoteContent(e.target.value)}
                                                    />
                                                    <Button
                                                        className="w-full bg-[#ca1f3d] hover:bg-[#a61932] text-white font-bold rounded-xl h-10"
                                                        onClick={() => addNoteMutation.mutate()}
                                                        disabled={!noteContent || addNoteMutation.isPending}
                                                    >
                                                        {addNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-2" /> Add Note</>}
                                                    </Button>
                                                </div>

                                                {/* Notes List */}
                                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">History</h4>
                                                    {notesLoading ? (
                                                        <Loader2 className="mx-auto w-6 h-6 animate-spin text-gray-500" />
                                                    ) : notes.length === 0 ? (
                                                        <p className="text-center text-xs text-gray-600 italic py-4">Belum ada catatan.</p>
                                                    ) : (
                                                        notes.map((note: any) => (
                                                            <div key={note.id} className="bg-[#151515] p-3 rounded-xl border border-white/5 text-sm">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-5 border-0 ${note.type === 'Technical' ? 'bg-blue-500/10 text-blue-500' :
                                                                            note.type === 'Physical' ? 'bg-orange-500/10 text-orange-500' :
                                                                                'bg-gray-500/10 text-gray-500'
                                                                        }`}>
                                                                        {note.type}
                                                                    </Badge>
                                                                    <span className="text-[9px] text-gray-600 font-mono">
                                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-300 leading-relaxed">{note.content}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button className="flex-1 bg-transparent border border-white/10 text-white hover:text-[#ca1f3d] hover:border-[#ca1f3d] hover:bg-[#ca1f3d]/10 font-bold rounded-xl h-10 text-xs transition-all">
                                        <MessageSquare className="w-3 h-3 mr-2" /> CHAT
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
