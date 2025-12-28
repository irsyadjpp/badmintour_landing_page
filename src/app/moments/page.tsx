'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    Play, 
    Heart, 
    Share2, 
    Camera, 
    X,
    MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const MOMENTS = [
    {
        id: 1,
        type: 'video',
        src: 'https://images.unsplash.com/photo-1689058260074-5b94674b82c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxiYWRtaW50b24lMjBzbWFzaHxlbnwwfHx8fDE3NjU4MTUyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Tournament',
        title: 'Winning Smash! 🏸🔥',
        user: 'Kevin S.',
        likes: '1.2k',
        aspect: 'aspect-[9/16]', // Portrait (TikTok Style)
    },
    {
        id: 2,
        type: 'image',
        src: '/images/badmintour-hero.webp',
        category: 'Mabar',
        title: 'Squad Goals 🤩',
        user: 'Admin',
        likes: '856',
        aspect: 'aspect-[4/3]', // Landscape
    },
    {
        id: 3,
        type: 'image',
        src: '/images/jersey-season-1.png',
        category: 'Merch',
        title: 'New Jersey Season 1',
        user: 'Store',
        likes: '2.5k',
        aspect: 'aspect-square', // Square
    },
    {
        id: 4,
        type: 'video',
        src: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1080&auto=format&fit=crop',
        category: 'Drilling',
        title: 'Footwork Drill 101',
        user: 'Coach Budi',
        likes: '900',
        aspect: 'aspect-[9/16]',
    },
    {
        id: 5,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1738330194751-e096b51af7bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxiYWRtaW50b24lMjBncm91cHxlbnwwfHx8fDE3NjU4MTUyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        category: 'Fun Match',
        title: 'Kalah gapapa yang penting gaya 😎',
        user: 'Member 001',
        likes: '120',
        aspect: 'aspect-[3/4]',
    },
    {
        id: 6,
        type: 'image',
        src: '/images/logo-light.png',
        category: 'Tournament',
        title: 'Champion of The Day 🏆',
        user: 'Panitia',
        likes: '3k',
        aspect: 'aspect-[4/5]',
    },
];

const CATEGORIES = ['All', 'Mabar', 'Tournament', 'Drilling', 'Fun Match', 'Merch'];

export default function MomentsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const filteredMoments = activeCategory === 'All' 
        ? MOMENTS 
        : MOMENTS.filter(m => m.category === activeCategory);

    return (
        // Container utama. 'pt-32' memberi jarak agar tidak tertutup Navbar Fixed.
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 md:pt-32 pb-20">
            
            {/* 1. HERO HEADER */}
            <div className="relative px-6 mb-12">
                {/* Background Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#ffbe00]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                        <Camera className="w-4 h-4 text-[#ff0099]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Badmintour Gallery</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6 leading-none">
                        Momen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] via-[#ff0099] to-[#00f2ea]">Seru.</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                        Kumpulan aksi terbaik, bloopers lucu, dan euforia komunitas kita.
                    </p>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border",
                                    activeCategory === cat 
                                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
                                        : "bg-[#151515] text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. GALLERY GRID (Masonry Feel) */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {filteredMoments.map((item) => (
                        <div 
                            key={item.id} 
                            className="break-inside-avoid group relative cursor-pointer"
                            onClick={() => setSelectedItem(item)}
                        >
                            <div className={cn(
                                "relative w-full overflow-hidden rounded-[2rem] bg-[#151515] border border-white/5 transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-[#00f2ea]/10",
                                item.aspect
                            )}>
                                {/* Image */}
                                <Image 
                                    src={item.src} 
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                />

                                {/* Play Icon if Video */}
                                {item.type === 'video' && (
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                        <Play className="w-4 h-4 text-white fill-current" />
                                    </div>
                                )}

                                {/* Overlay & Content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 md:opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>

                                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 md:translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                                    <Badge className="mb-2 bg-[#00f2ea] text-black font-bold border-0">
                                        {item.category}
                                    </Badge>
                                    <h3 className="text-xl font-black text-white leading-tight mb-1">{item.title}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ffbe00] to-[#ff0099] flex items-center justify-center text-[10px] text-white">
                                                {item.user.charAt(0)}
                                            </div>
                                            {item.user}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-[#ff0099]">
                                            <Heart className="w-4 h-4 fill-current" /> {item.likes}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. LIGHTBOX MODAL */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-5xl w-full h-[90vh] md:h-auto bg-[#0a0a0a]/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden rounded-[2.5rem] flex flex-col md:flex-row gap-0">
                    
                    {/* Media Left/Top */}
                    <div className="relative flex-1 bg-black flex items-center justify-center h-1/2 md:h-auto">
                        {selectedItem && (
                            <Image 
                                src={selectedItem.src} 
                                alt={selectedItem.title} 
                                fill 
                                className="object-contain"
                            />
                        )}
                        <Button 
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 md:left-4 rounded-full w-10 h-10 bg-black/50 hover:bg-black/80 text-white p-0 border border-white/10 z-50"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Details Right/Bottom */}
                    <div className="w-full md:w-[400px] bg-[#151515] p-6 md:p-8 flex flex-col justify-between h-1/2 md:h-auto border-l border-white/5 overflow-y-auto">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffbe00] to-[#ff0099] flex items-center justify-center text-lg font-black text-black border-2 border-white">
                                        {selectedItem?.user.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{selectedItem?.user}</h4>
                                        <p className="text-xs text-gray-500">Posted recently</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                    <MoreHorizontal className="w-5 h-5" />
                                </Button>
                            </div>

                            <Badge className="mb-4 bg-[#00f2ea]/10 text-[#00f2ea] border-[#00f2ea]/20">
                                {selectedItem?.category}
                            </Badge>

                            <h2 className="text-2xl md:text-3xl font-black text-white italic leading-tight mb-4">
                                {selectedItem?.title}
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Momen seru dari kegiatan {selectedItem?.category}. Bagikan keseruan ini ke teman-temanmu!
                            </p>
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex items-center justify-between py-4 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 group">
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#ff0099]/20 transition-colors">
                                            <Heart className="w-5 h-5 text-gray-400 group-hover:text-[#ff0099] transition-colors" />
                                        </div>
                                        <span className="text-sm font-bold text-white">{selectedItem?.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 group">
                                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#00f2ea]/20 transition-colors">
                                            <Share2 className="w-5 h-5 text-gray-400 group-hover:text-[#00f2ea] transition-colors" />
                                        </div>
                                        <span className="text-sm font-bold text-white">Share</span>
                                    </button>
                                </div>
                            </div>
                            
                            <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold rounded-xl shadow-lg">
                                Lihat Profil {selectedItem?.user}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
