'use client';

import { useState } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
    targetId: string;
    initialIsFollowing?: boolean;
    className?: string;
}

export default function FollowButton({ targetId, initialIsFollowing = false, className }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah navigasi jika tombol ada di dalam Link
        e.stopPropagation();
        
        setLoading(true);
        try {
            const res = await fetch('/api/social/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId })
            });
            
            const data = await res.json();
            if (res.ok) {
                setIsFollowing(data.isFollowing);
                toast({ 
                    title: data.isFollowing ? "Followed!" : "Unfollowed", 
                    description: data.isFollowing ? "Kalian sekarang berteman." : "Berhenti mengikuti user ini." 
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Gagal update status follow.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            size="sm"
            onClick={handleFollow}
            disabled={loading}
            className={`font-bold transition-all rounded-full ${isFollowing 
                ? "bg-transparent border border-white/20 text-gray-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50" 
                : "bg-[#00f2ea] text-black hover:bg-[#00c2bb] shadow-[0_0_15px_rgba(0,242,234,0.3)]"
            } ${className}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : isFollowing ? (
                <><UserCheck className="w-4 h-4 mr-1" /> Following</>
            ) : (
                <><UserPlus className="w-4 h-4 mr-1" /> Follow</>
            )}
        </Button>
    );
}
