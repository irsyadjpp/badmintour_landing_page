'use client';

import { Star, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ReviewList() {
    // MOCK DATA (Nanti fetch dari API GET /api/reviews?targetId=...)
    const reviews = [
        { id: 1, name: "Budi S.", rating: 5, comment: "Coach-nya sabar banget, drilling-nya mantap!", date: "2 days ago" },
        { id: 2, name: "Siti A.", rating: 4, comment: "Penjelasan teknik mudah dimengerti.", date: "1 week ago" },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-[#ffbe00] fill-current" /> Ulasan Murid ({reviews.length})
            </h3>
            
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-[#151515] p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-white/10 text-white text-xs">{review.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold text-white">{review.name}</p>
                                    <div className="flex text-[#ffbe00]">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-400 italic">"{review.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
