'use client'
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const topPlayers = [
    {
        rank: 2,
        name: 'Budi Santoso',
        points: 1240,
        level: 'Intermediate',
        avatar: 'https://ui-avatars.com/api/?name=Budi&background=random',
        levelClass: 'bg-bad-yellow/10 text-bad-yellow border border-bad-yellow/20',
        podiumClass: 'bg-[#1A1A1A] translate-y-4 shadow-lg border border-white/5',
        rankClass: 'bg-[#252525] text-white text-lg',
        rankNumber: 2,
        imageBorder: 'border-[#333]',
    },
    {
        rank: 1,
        name: 'Kevin.S',
        points: 1550,
        level: 'PRO',
        avatar: 'https://ui-avatars.com/api/?name=Kevin&background=000&color=fff',
        levelClass: 'bg-bad-yellow text-black font-black',
        podiumClass: 'bg-gradient-to-b from-[#222] to-black shadow-2xl z-10 border border-bad-yellow/30',
        rankClass: 'text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]',
        rankNumber: '👑',
        imageBorder: 'border-bad-yellow',
        nameClass: 'text-white text-xl',
        pointsClass: 'text-bad-yellow',
        imageSize: 'w-24 h-24'
    },
    {
        rank: 3,
        name: 'Siti Aminah',
        points: 1100,
        level: 'Intermediate',
        avatar: 'https://ui-avatars.com/api/?name=Siti&background=random',
        levelClass: 'bg-bad-yellow/10 text-bad-yellow border border-bad-yellow/20',
        podiumClass: 'bg-[#1A1A1A] translate-y-8 shadow-lg border border-white/5',
        rankClass: 'bg-[#252525] text-white text-lg',
        rankNumber: 3,
        imageBorder: 'border-[#333]',
    },
];

const playerList = [
    { rank: '04', name: 'Taufik H.', badges: ['🔥', '🛡️'], points: 980, avatar: 'https://ui-avatars.com/api/?name=Taufik+H&background=random' },
    { rank: '05', name: 'Alan B.', badges: ['🌱'], points: 850, avatar: 'https://ui-avatars.com/api/?name=Alan+B&background=random' },
];

const activeBadges = [
    { icon: '🔥', name: 'Smash King', desc: 'Win 5 matches' },
    { icon: '🛡️', name: 'Iron Def', desc: 'No miss serve' },
    { icon: '🤝', name: 'Friendly', desc: 'High rating' },
    { icon: '⚡', name: 'Speedy', desc: 'Fast Play' },
];

export default function GamificationPage() {
    return (
        <main>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-1">Rank & Rewards</h1>
                    <p className="text-gray-400 font-medium">Atur poin, leaderboard, dan badges member.</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="px-6 py-3 rounded-full font-bold text-sm transition-all bg-transparent border-white/10 hover:bg-white/5 text-gray-400 h-auto">
                        ⚙️ Config Points
                    </Button>
                    <Button className="px-6 py-3 rounded-full font-bold text-sm transition-all bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-gray-200 h-auto">
                        + Assign Badge
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-3 gap-4 items-end">
                        {topPlayers.map((player) => (
                            <div key={player.rank} className={`p-8 rounded-[2.5rem] text-center relative transform transition-all duration-300 ${player.podiumClass}`}>
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-black shadow-sm ${player.rankClass}`}>
                                    {player.rankNumber}
                                </div>
                                <div className="mt-4">
                                    <Image src={player.avatar} alt={player.name} width={96} height={96} className={`rounded-full mx-auto mb-4 border-4 shadow-lg ${player.imageBorder} ${player.imageSize || 'w-20 h-20'}`} />
                                    <h3 className={`font-bold ${player.nameClass || 'text-white'}`}>{player.name}</h3>
                                    <p className={`text-sm font-bold font-jersey ${player.pointsClass || 'text-gray-500'} mb-3`}>{player.points} Pts</p>
                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${player.levelClass}`}>{player.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#1A1A1A] rounded-[2.5rem] p-8 shadow-xl border border-white/5">
                        <h3 className="font-black text-xl mb-6 ml-2 text-white">Top 50 Players</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold text-gray-500 uppercase border-b border-white/5">
                                    <tr>
                                        <th className="px-4 py-4">Rank</th>
                                        <th className="px-4 py-4">Member</th>
                                        <th className="px-4 py-4">Badges</th>
                                        <th className="px-4 py-4 text-right">Points</th>
                                        <th className="px-4 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {playerList.map(player => (
                                        <tr key={player.rank} className="hover:bg-[#1F1F1F] transition group cursor-default">
                                            <td className="px-4 py-4 font-black text-gray-600 font-jersey text-lg">{player.rank}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <Image src={player.avatar} width={40} height={40} alt={player.name} className="w-10 h-10 rounded-full border border-white/10" />
                                                    <span className="font-bold text-white">{player.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex -space-x-2">
                                                    {player.badges.map((badge, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-sm border border-[#1A1A1A]">{badge}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black text-white font-jersey text-lg">{player.points}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-gray-500 hover:text-white font-bold text-xs underline decoration-gray-700 hover:decoration-white transition">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-[#121212] border border-white/10 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-black text-xl mb-6">Active Badges</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {activeBadges.map(badge => (
                                    <div key={badge.name} className="bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:border-bad-yellow/30 transition cursor-pointer group">
                                        <span className="text-2xl group-hover:scale-110 transition">{badge.icon}</span>
                                        <div>
                                            <p className="font-bold text-xs text-white">{badge.name}</p>
                                            <p className="text-[10px] text-gray-500">{badge.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-8 py-4 bg-bad-yellow text-black font-black rounded-xl text-xs hover:bg-yellow-400 h-auto shadow-[0_0_15px_rgba(250,204,21,0.4)]">Buat Badge Baru</Button>
                        </div>
                    </div>

                    <div className="bg-[#1A1A1A] rounded-[2.5rem] p-8 shadow-sm border border-white/5">
                        <h3 className="font-black text-lg mb-6 text-white">Quick Adjust</h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Poin diupdate!') }} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Pilih Member</label>
                                <Input type="text" placeholder="Cari nama..." className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-bad-yellow text-white h-auto" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Aksi</label>
                                    <Select>
                                        <SelectTrigger className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-3 py-3 text-sm font-bold text-white outline-none h-auto">
                                            <SelectValue placeholder="Tambah (+)" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                            <SelectItem value="add">Tambah (+)</SelectItem>
                                            <SelectItem value="subtract">Kurang (-)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Poin</label>
                                    <Input type="number" placeholder="10" className="w-full mt-2 bg-[#121212] border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-bad-yellow h-auto" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-xl text-sm hover:bg-gray-200 h-auto mt-2">Update Poin</Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
