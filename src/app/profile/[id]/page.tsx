
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Trophy, Users, MapPin, Calendar } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi Fetch Data Profil Publik
        // Di real app: fetch(`/api/users/${params.id}`)
        const fetchProfile = async () => {
            setTimeout(() => {
                setProfile({
                    id: params.id,
                    name: "Kevin Sanjaya KW",
                    image: "", // Kosong = fallback
                    role: "Member",
                    level: "Advanced",
                    location: "Bandung, Jawa Barat",
                    joinedAt: "Jan 2024",
                    stats: { matches: 45, wins: 30, followers: 128, following: 50 },
                    bio: "Mencari lawan sparring ganda putra. Main santai tapi serius.",
                    isFollowing: false // Status apakah current user follow dia
                });
                setLoading(false);
            }, 1000);
        };
        fetchProfile();
    }, [params.id]);

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading Profile...</div>;
    if (!profile) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">User not found</div>;

    const isMe = session?.user?.id === profile.id;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
            <Header />
            
            {/* Cover Image & Profile Header */}
            <div className="relative pt-24">
                <div className="h-48 w-full bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div className="container mx-auto px-4 -mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                        {/* Avatar Besar */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0a0a0a] bg-[#1A1A1A] overflow-hidden shadow-2xl">
                            {profile.image ? (
                                <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#222] text-4xl font-black text-gray-600">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Info & Action */}
                        <div className="flex-1 mb-4 md:mb-0">
                            <h1 className="text-3xl font-black text-white flex items-center gap-2">
                                {profile.name}
                                {profile.role === 'coach' && <Badge className="bg-[#00f2ea] text-black hover:bg-[#00f2ea]">COACH</Badge>}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {profile.joinedAt}</span>
                                <span className="flex items-center gap-1 text-[#ffbe00] font-bold"><Trophy className="w-4 h-4" /> {profile.level}</span>
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
                        <StatBox label="Matches" value={profile.stats.matches} />
                        <StatBox label="Wins" value={profile.stats.wins} color="text-green-500" />
                        <StatBox label="Followers" value={profile.stats.followers} />
                        <StatBox label="Following" value={profile.stats.following} />
                    </div>

                    {/* Bio Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                <h3 className="font-bold text-white mb-2">About</h3>
                                <p className="text-gray-400 leading-relaxed">{profile.bio}</p>
                            </Card>

                            {/* Recent Activity (Placeholder) */}
                            <div>
                                <h3 className="font-bold text-white mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#151515] border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">🏸</div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Joined "Mabar Senin Ceria"</p>
                                                <p className="text-xs text-gray-500">2 days ago • GOR Wartawan</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Badges/Achievements) */}
                        <div className="space-y-6">
                            <Card className="bg-[#151515] border-white/5 p-6 rounded-[2rem]">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-[#ffbe00]" /> Achievements
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="border-[#ffbe00]/30 text-[#ffbe00] bg-[#ffbe00]/10">Early Adopter</Badge>
                                    <Badge variant="outline" className="border-[#00f2ea]/30 text-[#00f2ea] bg-[#00f2ea]/10">Mabar King</Badge>
                                    <Badge variant="outline" className="border-[#ff0099]/30 text-[#ff0099] bg-[#ff0099]/10">Friendly</Badge>
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
