
'use client';

import { Dumbbell, Plus, Play, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CoachDrillsPage() {
    // Mock Data
    const drills = [
        { id: 1, title: "Basic Footwork: 6 Corners", duration: "15 Min", difficulty: "Beginner", category: "Footwork" },
        { id: 2, title: "Smash Power & Accuracy", duration: "30 Min", difficulty: "Advanced", category: "Offense" },
        { id: 3, title: "Defense Wall Drill", duration: "20 Min", difficulty: "Intermediate", category: "Defense" },
        { id: 4, title: "Net Play Control", duration: "15 Min", difficulty: "Intermediate", category: "Technique" },
    ];

    const getDifficultyColor = (diff: string) => {
        if(diff === 'Beginner') return 'text-green-500 bg-green-500/10 border-green-500/20';
        if(diff === 'Intermediate') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    };

    return (
        <div className="space-y-8 pb-20 p-6 md:p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Dumbbell className="w-8 h-8 text-[#00f2ea]" /> DRILL LIBRARY
                    </h1>
                    <p className="text-gray-400">Koleksi modul latihan untuk murid Anda.</p>
                </div>
                <Button className="bg-[#00f2ea] text-black hover:bg-[#00c2bb] font-black rounded-xl px-6 h-12 shadow-[0_0_20px_rgba(0,242,234,0.3)]">
                    <Plus className="w-5 h-5 mr-2" /> CREATE NEW
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {drills.map((drill) => (
                    <Card key={drill.id} className="bg-[#151515] border-white/5 rounded-[2rem] overflow-hidden hover:border-[#00f2ea]/30 transition-all group">
                        {/* Thumbnail Placeholder */}
                        <div className="h-40 bg-[#1A1A1A] relative flex items-center justify-center group-hover:bg-[#222] transition">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white ml-1" />
                            </div>
                            <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] uppercase font-bold">
                                {drill.category}
                            </Badge>
                        </div>

                        <div className="p-5 space-y-4">
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight mb-2 group-hover:text-[#00f2ea] transition-colors">{drill.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={`text-[10px] uppercase font-bold ${getDifficultyColor(drill.difficulty)}`}>
                                        {drill.difficulty}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium pt-4 border-t border-white/5">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {drill.duration}</span>
                                <span className="flex items-center gap-1"><BarChart className="w-3 h-3" /> Intensity</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
