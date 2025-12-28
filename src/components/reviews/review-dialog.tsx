'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ReviewDialogProps {
    targetId: string;
    targetName: string;
    type: 'coach' | 'event';
    trigger?: React.ReactNode; // Tombol pemicu custom
}

export default function ReviewDialog({ targetId, targetName, type, trigger }: ReviewDialogProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ title: "Rating Kosong", description: "Silakan beri bintang 1-5.", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, targetType: type, rating, comment })
            });

            if (res.ok) {
                toast({ title: "Terima Kasih!", description: "Ulasan Anda telah dikirim." });
                setOpen(false);
                setRating(0);
                setComment('');
            } else {
                throw new Error();
            }
        } catch (e) {
            toast({ title: "Gagal", description: "Terjadi kesalahan.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Beri Ulasan</Button>}
            </DialogTrigger>
            <DialogContent className="bg-[#1A1A1A] border-white/10 text-white rounded-[2rem] sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Rate <span className="text-[#00f2ea]">{targetName}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Star Input */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star 
                                    className={`w-10 h-10 ${star <= rating ? 'fill-[#ffbe00] text-[#ffbe00]' : 'text-gray-600'}`} 
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {rating === 5 ? "Luar Biasa!" : rating >= 4 ? "Sangat Bagus" : rating >= 3 ? "Cukup" : rating > 0 ? "Kurang" : "Ketuk Bintang"}
                    </p>

                    {/* Comment Input */}
                    <div className="space-y-2">
                        <Textarea 
                            placeholder="Bagaimana pengalaman latihan/main Anda? Ceritakan di sini..."
                            className="bg-[#0a0a0a] border-white/10 text-white min-h-[100px] resize-none focus:border-[#00f2ea]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <Button 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        className="w-full h-12 bg-[#00f2ea] text-black font-black hover:bg-[#00c2bb] rounded-xl"
                    >
                        {submitting ? <Loader2 className="animate-spin" /> : "KIRIM ULASAN"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
