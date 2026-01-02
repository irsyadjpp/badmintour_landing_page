'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Play,
    Heart,
    Share2,
    Camera,
    X,
    MoreHorizontal,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// --- IMPORT LAYOUT COMPONENTS ---
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// --- MOCK DATA ---
const MOMENTS = [
    {
        id: 1,
        type: 'video',
        src: PlaceHolderImages.find(p => p.id === 'hero-player')?.imageUrl || "https://picsum.photos/seed/moment1/900/1600",
        category: 'Tournament',
        title: 'Winning Smash! 🏸🔥',
        user: 'Kevin S.',
        likes: '1.2k',
        aspect: 'aspect-[9/16]',
    },
    {
        id: 2,
        type: 'image',
        src: PlaceHolderImages.find(p => p.id === 'feature-mabar')?.imageUrl || "https://picsum.photos/seed/moment2/800/600",
        category: 'Mabar',
        title: 'Squad Goals 🤩',
        user: 'Admin',
        likes: '856',
        aspect: 'aspect-[4/3]',
    },
    {
        id: 3,
        type: 'image',
        src: "/images/jersey-season-1.png",
        category: 'Merch',
        title: 'New Jersey Season 1',
        user: 'Store',
        likes: '2.5k',
        aspect: 'aspect-square',
    },
    {
        id: 4,
        type: 'video',
        src: PlaceHolderImages.find(p => p.id === 'feature-coaching')?.imageUrl || "https://picsum.photos/seed/moment4/900/1600",
        category: 'Drilling',
        title: 'Footwork Drill 101',
        user: 'Coach Budi',
        likes: '900',
        aspect: 'aspect-[9/16]',
    },
    {
        id: 5,
        type: 'image',
        src: PlaceHolderImages.find(p => p.id === 'feature-sparring')?.imageUrl || "https://picsum.photos/seed/moment5/600/800",
        category: 'Fun Match',
        title: 'Kalah gapapa yang penting gaya 😎',
        user: 'Member 001',
        likes: '120',
        aspect: 'aspect-[3/4]',
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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

            <Header />

            <main className="flex-1 pt-28 md:pt-36 pb-20">

                {/* 1. HERO HEADER (Light Version) */}
                <div className="relative px-6 mb-16">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#ffbe00]/20 to-[#ca1f3d]/20 rounded-full blur-[100px] pointer-events-none opacity-60"></div>

                    <div className="container mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
                            <Camera className="w-4 h-4 text-[#ff0099]" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Badmintour Gallery</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-6 leading-[0.9] text-slate-900">
                            Momen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] via-[#ca1f3d] to-[#ffbe00]">Seru.</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl mx-auto text-xl mb-10 leading-relaxed">
                            Kumpulan aksi terbaik, bloopers lucu, dan euforia komunitas kita. Abadikan setiap detik permainan!
                        </p>

                        <div className="flex flex-wrap justify-center gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2",
                                        activeCategory === cat
                                            ? "bg-black text-white border-black shadow-lg scale-105"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. GALLERY GRID */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredMoments.map((item) => (
                            <div
                                key={item.id}
                                className="break-inside-avoid group relative cursor-pointer"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className={cn(
                                    "relative w-full overflow-hidden rounded-[2.5rem] bg-white border-4 border-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ca1f3d]/20",
                                    item.aspect
                                )}>
                                    <Image
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {item.type === 'video' && (
                                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-sm z-20">
                                            <Play className="w-5 h-5 text-white fill-current ml-1" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300"></div>

                                    <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <Badge className="mb-3 bg-[#ffbe00] text-black font-black border-0 px-3 py-1 hover:bg-white hover:text-black transition-colors">
                                            {item.category}
                                        </Badge>
                                        <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md">{item.title}</h3>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                                            <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ffbe00] to-[#ff0099] flex items-center justify-center text-xs text-black border-2 border-white">
                                                    {item.user.charAt(0)}
                                                </div>
                                                {item.user}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff0099] bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                <Heart className="w-3.5 h-3.5 fill-current" /> {item.likes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredMoments.length === 0 && (
                        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Belum ada momen di kategori ini.</h3>
                            <p className="text-slate-500 mt-2">Yuk upload momen kamu sekarang!</p>
                        </div>
                    )}
                </div>

                {/* 3. LIGHTBOX MODAL */}
                <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                    <DialogContent className="max-w-6xl w-full h-[95vh] md:h-[85vh] bg-white p-0 overflow-hidden rounded-[3rem] flex flex-col md:flex-row gap-0 shadow-2xl border-0">

                        <div className="relative flex-1 bg-black flex items-center justify-center h-[50vh] md:h-full">
                            {selectedItem && (
                                <Image src={selectedItem.src} alt={selectedItem.title} fill className="object-contain" />
                            )}
                            <Button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 left-6 rounded-full w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black p-0 backdrop-blur-md transition-all z-50 border border-white/20"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="w-full md:w-[450px] bg-white p-8 md:p-10 flex flex-col h-[50vh] md:h-full overflow-y-auto relative">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffbe00] to-[#ff0099] flex items-center justify-center text-xl font-black text-white shadow-lg">
                                            {selectedItem?.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-xl">{selectedItem?.user}</h4>
                                            <p className="text-sm font-bold text-slate-400">2 jam yang lalu</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-100 rounded-full">
                                        <MoreHorizontal className="w-6 h-6" />
                                    </Button>
                                </div>

                                <Badge className="mb-4 bg-[#ca1f3d]/20 text-[#ca1f3d] border-0 px-4 py-1.5 hover:bg-[#ca1f3d]/30 text-xs font-bold uppercase tracking-wide">
                                    {selectedItem?.category}
                                </Badge>

                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic leading-[0.95] mb-6">
                                    {selectedItem?.title}
                                </h2>

                                <p className="text-slate-600 text-base leading-relaxed font-medium">
                                    Momen seru dari kegiatan {selectedItem?.category}. Jangan lupa like dan share ke teman-teman mabar kalian! 🔥🏸
                                    <br /><br />
                                    <span className="text-[#ff0099]">#Badmintour #BandungJuara</span>
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-6">
                                        <button className="flex items-center gap-2 group">
                                            <div className="p-3 rounded-full bg-slate-50 group-hover:bg-red-50 transition-colors">
                                                <Heart className="w-6 h-6 text-slate-400 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
                                            </div>
                                            <span className="text-base font-bold text-slate-700">{selectedItem?.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 group">
                                            <div className="p-3 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                                                <Share2 className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <span className="text-base font-bold text-slate-700">Share</span>
                                        </button>
                                    </div>
                                </div>

                                <Button className="w-full h-16 bg-black text-white hover:bg-slate-800 font-black rounded-2xl text-lg shadow-xl shadow-slate-200">
                                    Lihat Profil {selectedItem?.user}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </main>

            <Footer />

        </div>
    );
}