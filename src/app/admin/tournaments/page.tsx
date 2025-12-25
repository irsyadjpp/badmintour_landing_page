'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BracketMatch = ({ teamA, teamB, scoreA, scoreB, isWinnerA }: { teamA: string, teamB: string, scoreA: number | string, scoreB: number | string, isWinnerA: boolean }) => (
    <div className={`bg-[#121212] p-5 rounded-2xl border ${isWinnerA ? 'border-bad-green/50' : 'border-white/5'} transition hover:border-white/20`}>
        <div className="flex justify-between mb-3">
            <span className={`font-bold text-sm ${isWinnerA ? 'text-white' : 'text-gray-500'}`}>{teamA}</span>
            <span className={`font-jersey text-xl ${isWinnerA ? 'text-bad-green' : 'text-gray-600'}`}>{scoreA}</span>
        </div>
        <div className="flex justify-between">
            <span className={`font-bold text-sm ${!isWinnerA && scoreB !== 'TBD' ? 'text-white' : 'text-gray-500'}`}>{teamB}</span>
            <span className={`font-jersey text-xl ${!isWinnerA && scoreB !== 'TBD' ? 'text-bad-green' : 'text-gray-600'}`}>{scoreB}</span>
        </div>
    </div>
);

const SemiFinalMatch = ({ teamA, teamB, winner }: { teamA: string, teamB: string, winner: string | null }) => (
     <div className="bg-[#121212] p-5 rounded-2xl border border-white/5">
        <div className="flex justify-between mb-3">
             <span className={`${winner === teamA ? 'text-bad-green' : 'text-gray-600'} font-bold text-sm`}>{teamA}</span>
             {winner === teamA && <span className="text-[10px] text-bad-green font-black uppercase tracking-wider">WIN</span>}
        </div>
        <div className="flex justify-between">
            <span className={`${winner === teamB ? 'text-bad-green' : 'text-gray-600'} font-bold text-sm`}>{teamB}</span>
            {winner === teamB && <span className="text-[10px] text-bad-green font-black uppercase tracking-wider">WIN</span>}
        </div>
    </div>
);


export default function TournamentsPage() {
    return (
        <main>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-bad-green text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                        <span className="text-gray-400 text-xs font-bold">Gor Koni • 24-25 Aug</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">Bandung Open</h1>
                </div>
                
                <Tabs defaultValue="bracket" className="bg-[#1A1A1A] p-1.5 rounded-full flex border border-white/5">
                    <TabsList className="p-0 bg-transparent h-auto gap-2">
                        <TabsTrigger value="bracket" className="px-6 py-2.5 rounded-full text-xs font-bold text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black transition">Bracket</TabsTrigger>
                        <TabsTrigger value="peserta" className="px-6 py-2.5 rounded-full text-xs font-bold text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black transition">Peserta</TabsTrigger>
                        <TabsTrigger value="hadiah" className="px-6 py-2.5 rounded-full text-xs font-bold text-gray-400 data-[state=active]:bg-white data-[state=active]:text-black transition">Hadiah</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-[2.5rem] p-12 overflow-x-auto shadow-2xl relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-bad-blue/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="flex gap-16 min-w-max relative z-10">
                    <div className="w-72 space-y-8">
                        <h3 className="text-center text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">Quarter Finals</h3>
                        <BracketMatch teamA="Kevin/Marcus" teamB="Ahsan/Hendra" scoreA={21} scoreB={19} isWinnerA={true} />
                        <BracketMatch teamA="Fajar/Rian" teamB="Leo/Daniel" scoreA={0} scoreB={0} isWinnerA={false} />
                    </div>
                    
                    <div className="w-72 space-y-8 pt-16">
                        <h3 className="text-center text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">Semi Finals</h3>
                        <SemiFinalMatch teamA="Kevin/Marcus" teamB="TBD" winner="Kevin/Marcus"/>
                    </div>
                </div>
            </div>
        </main>
    );
}
