
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Trophy, Users, MapPin, Calendar, CheckCircle, Dumbbell, Star, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/header';
import FollowButton from '@/components/social/follow-button';
import { useSession } from 'next-auth/react';

export default function PublicProfilePage() {
    const params = useParams();
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Determine ID: if 'me', use session ID
                const targetId = params.id === 'me' ? session?.user?.id : params.id;
                if (!targetId) return;

                const res = await fetch(`/api/profile/${targetId}`);
                const data = await res.json();
                if (data.success) {
                    setProfile(data.data);

                    // Fetch Reviews if Coach
                    if (data.data.role === 'coach') {
                        const reviewsRes = await fetch(`/api/reviews?targetId=${targetId}`);
                        const reviewsData = await reviewsRes.json();
                        if (reviewsData.success) {
                            setReviews(reviewsData.data);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [params.id, session]);

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!profile) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">User not found</div>;

    const isMe = session?.user?.id === profile.id;
    const isCoach = profile.role === 'coach';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            <Header />

            {/* Cover Image & Profile Header */}
            <div className="relative pt-24">
                <div className={`h-48 w-full relative overflow-hidden ${isCoach ? 'bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00]' : 'bg-gradient-to-r from-gray-800 to-gray-600'}`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    {/* Coach Pattern */}
                    {isCoach && <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>}
                </div>

                <div className="container mx-auto px-4 -mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                        {/* Avatar Besar */}
                        <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 ${isCoach ? 'border-[#ffbe00]' : 'border-[#1A1A1A]'} bg-[#1A1A1A] overflow-hidden shadow-2xl group`}>
                            {profile.image ? (
                                <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#222] text-4xl font-black text-gray-600">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                            {isCoach && <div className="absolute bottom-0 inset-x-0 bg-[#ffbe00] text-black text-[10px] font-black uppercase text-center py-1">Official Coach</div>}
                        </div>

                        {/* Info & Action */}
                        <div className="flex-1 mb-4 md:mb-0">
                            <h1 className="text-3xl font-black text-white flex items-center gap-2">
                                {profile.name}
                                {isCoach && <Badge className="bg-[#ffbe00] text-black hover:bg-[#ffbe00] shadow-[0_0_15px_rgba(255,190,0,0.4)]">COACH</Badge>}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {profile.joinedAt}</span>
                                {!isCoach && <span className="flex items-center gap-1 text-[#ffbe00] font-bold"><Trophy className="w-4 h-4" /> {profile.level}</span>}
                            </div>
                        </div>

                        {/* Tombol Follow (Sembunyikan jika profil sendiri) */}
                        {!isMe && (
                            <div className="mb-6 md:mb-0">
                                <FollowButton targetId={profile.id} initialIsFollowing={profile.isFollowing} className="h-12 px-8 text-base" />
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {isCoach ? (
                            <>
                                <StatBox label="Experience" value={`${profile.experienceYears}+ Thn`} color="text-[#ffbe00]" />
                                <StatBox label="Rating" value={profile.rating || '5.0'} color="text-yellow-400" />
                                <StatBox label="Students" value={profile.stats.matches} />
                                <StatBox label="Reviews" value={profile.reviewCount} />
                            </>
                        ) : (
                            <>
                                <StatBox label="Matches" value={profile.stats.matches} />
                                <StatBox label="Wins" value={profile.stats.wins} color="text-green-500" />
                                <StatBox label="Followers" value={profile.stats.followers} />
                                <StatBox label="Following" value={profile.stats.following} />
                            </>
                        )}
                    </div>

                    {/* Bio & Details Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* MAIN INFO */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                <h3 className="font-bold text-white mb-2 uppercase tracking-widest text-xs text-gray-500">About</h3>
                                <p className="text-gray-300 leading-relaxed font-medium">{profile.bio}</p>
                            </Card>

                            {/* Coach: Certifications & Specializations */}
                            {isCoach && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-[#ffbe00]" /> Certifications
                                        </h3>
                                        {profile.certifications && profile.certifications.length > 0 ? (
                                            <ul className="space-y-2">
                                                {profile.certifications.map((cert: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {cert}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="text-xs text-gray-500">No public certifications.</p>}
                                    </Card>

                                    <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Dumbbell className="w-4 h-4 text-[#ca1f3d]" /> Specializations
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.specialization && profile.specialization.length > 0 ? profile.specialization.map((spec: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-white border-white/10">{spec}</Badge>
                                            )) : <p className="text-xs text-gray-500">Generals</p>}
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Coach Reviews */}
                            {isCoach && (
                                <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-[#ffbe00]" /> Student Reviews ({reviews.length})
                                    </h3>

                                    {reviews.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 border border-white/5 border-dashed rounded-xl">
                                            <p className="text-sm">Belum ada review untuk coach ini.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-gray-300">
                                                                {review.reviewerName?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-white">{review.reviewerName}</p>
                                                                <p className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-[#ffbe00]/10 text-[#ffbe00] border-[#ffbe00]/20 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-current" /> {review.rating}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-300 leading-relaxed italic">"{review.comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Recent Activity (Placeholder) */}
                            <div>
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                                    <Clock className="w-5 h-5 text-gray-500" /> Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-[#151515] border border-white/5 hover:bg-[#1A1A1A] transition-colors">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl">🏸</div>
                                            <div>
                                                <p className="font-bold text-white">{isCoach ? 'Coached "Smash Masterclass"' : 'Joined "Mabar Senin Ceria"'}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">2 days ago • GOR Wartawan</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR */}
                        <div className="space-y-6">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-[#ffbe00]" /> Reputation
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="border-[#ffbe00]/30 text-[#ffbe00] bg-[#ffbe00]/10">Community Favorite</Badge>
                                    <Badge variant="outline" className="border-[#00f2ea]/30 text-[#00f2ea] bg-[#00f2ea]/10">{isCoach ? 'Top Rated' : 'Mabar King'}</Badge>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, color = "text-white" }: any) {
    return (
        <Card className="bg-[#151515] border-white/5 p-4 rounded-2xl text-center hover:bg-[#1A1A1A] transition-colors">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
        </Card>
    );
}
