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
        levelClass: 'bg-gray-100 text-gray-500',
        podiumClass: 'bg-white translate-y-4 shadow-lg border-gray-100',
        rankClass: 'bg-gray-300',
        rankNumber: 2,
        imageBorder: 'border-gray-200',
    },
    {
        rank: 1,
        name: 'Kevin.S',
        points: 1550,
        level: 'PRO',
        avatar: 'https://ui-avatars.com/api/?name=Kevin&background=000&color=fff',
        levelClass: 'bg-black text-white',
        podiumClass: 'bg-gradient-to-b from-bad-yellow to-yellow-400 shadow-xl z-10',
        rankClass: 'text-4xl drop-shadow-md',
        rankNumber: '👑',
        imageBorder: 'border-white',
        nameClass: 'text-black text-xl',
        pointsClass: 'text-black/70',
        imageSize: 'w-20 h-20'
    },
    {
        rank: 3,
        name: 'Siti Aminah',
        points: 1100,
        level: 'Intermediate',
        avatar: 'https://ui-avatars.com/api/?name=Siti&background=random',
        levelClass: 'bg-orange-50 text-orange-500',
        podiumClass: 'bg-white translate-y-8 shadow-lg border-orange-100',
        rankClass: 'bg-orange-300',
        rankNumber: 3,
        imageBorder: 'border-orange-100',
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
                    <h1 className="text-5xl font-black text-bad-dark tracking-tighter mb-1">Rank & Rewards</h1>
                    <p className="text-gray-500 font-medium">Atur poin, leaderboard, dan badges member.</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="px-6 py-3 rounded-full font-bold text-sm transition-all bg-white border-gray-200 hover:bg-gray-50 text-gray-500 h-auto">
                        ⚙️ Config Points
                    </Button>
                    <Button className="px-6 py-3 rounded-full font-bold text-sm transition-all bg-bad-dark text-white shadow-xl hover:shadow-2xl h-auto">
                        + Assign Badge
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-3 gap-4 items-end">
                        {topPlayers.map((player) => (
                            <div key={player.rank} className={`p-6 rounded-[2.5rem] border text-center relative transform transition-all duration-300 ${player.podiumClass}`}>
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-black text-white border-4 border-white shadow-sm ${player.rankClass}`}>
                                    {player.rankNumber}
                                </div>
                                <div className="mt-4">
                                    <Image src={player.avatar} alt={player.name} width={80} height={80} className={`rounded-full mx-auto mb-3 border-2 ${player.imageBorder} ${player.imageSize || 'w-16 h-16'}`} />
                                    <h3 className={`font-bold ${player.nameClass || 'text-bad-dark'}`}>{player.name}</h3>
                                    <p className={`text-xs font-bold ${player.pointsClass || 'text-gray-400'} mb-2`}>{player.points} Pts</p>
                                    <span className={`px-2 py-1 text-[10px] font-bold rounded-lg ${player.levelClass}`}>{player.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
                        <h3 className="font-black text-xl mb-4 ml-2">Top 50 Players</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3">Rank</th>
                                        <th className="px-4 py-3">Member</th>
                                        <th className="px-4 py-3">Badges</th>
                                        <th className="px-4 py-3 text-right">Points</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {playerList.map(player => (
                                        <tr key={player.rank} className="hover:bg-gray-50 transition group">
                                            <td className="px-4 py-4 font-black text-gray-400">{player.rank}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Image src={player.avatar} width={32} height={32} alt={player.name} className="w-8 h-8 rounded-full bg-gray-200" />
                                                    <span className="font-bold">{player.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex -space-x-2">
                                                    {player.badges.map((badge, i) => (
                                                        <div key={i} className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] border border-white">{badge}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black">{player.points}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-gray-400 hover:text-bad-dark font-bold text-xs underline">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-bad-dark text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-black text-xl mb-4">Active Badges</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {activeBadges.map(badge => (
                                    <div key={badge.name} className="bg-white/10 p-3 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
                                        <span className="text-2xl">{badge.icon}</span>
                                        <div>
                                            <p className="font-bold text-xs">{badge.name}</p>
                                            <p className="text-[10px] text-gray-400">{badge.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-6 py-3 bg-bad-yellow text-black font-bold rounded-xl text-sm hover:bg-yellow-400 h-auto">Buat Badge Baru</Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
                        <h3 className="font-black text-lg mb-4">Quick Adjust</h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Poin diupdate!') }} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Pilih Member</label>
                                <Input type="text" placeholder="Cari nama..." className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-bad-dark h-auto" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Aksi</label>
                                    <Select>
                                        <SelectTrigger className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold outline-none h-auto">
                                            <SelectValue placeholder="Tambah (+)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="add">Tambah (+)</SelectItem>
                                            <SelectItem value="subtract">Kurang (-)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Poin</label>
                                    <Input type="number" placeholder="10" className="w-full mt-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-bad-dark h-auto" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full py-3 bg-bad-dark text-white font-bold rounded-xl text-sm hover:bg-gray-800 h-auto">Update Poin</Button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
