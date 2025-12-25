'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BracketMatch = ({ teamA, teamB, scoreA, scoreB, isWinnerA }: { teamA: string, teamB: string, scoreA: number | string, scoreB: number | string, isWinnerA: boolean }) => (
    <div className={`bg-[#252525] p-4 rounded-2xl border-l-4 ${isWinnerA ? 'border-bad-green' : 'border-gray-600'}`}>
        <div className="flex justify-between mb-2">
            <span className={`font-bold text-sm ${isWinnerA ? 'text-white' : 'text-gray-400'}`}>{teamA}</span>
            <span className={`font-mono ${isWinnerA ? 'text-white' : 'text-gray-400'}`}>{scoreA}</span>
        </div>
        <div className="flex justify-between">
            <span className={`font-bold text-sm ${!isWinnerA && scoreB !== 'TBD' ? 'text-white' : 'text-gray-400'}`}>{teamB}</span>
            <span className="font-mono text-gray-400">{scoreB}</span>
        </div>
    </div>
);

const SemiFinalMatch = ({ teamA, teamB, winner }: { teamA: string, teamB: string, winner: string | null }) => (
     <div className="bg-[#252525] p-4 rounded-2xl border border-gray-600">
        <div className="flex justify-between mb-2">
             <span className={`${winner === teamA ? 'text-bad-green' : 'text-gray-500'} font-bold text-sm`}>{teamA}</span>
             {winner === teamA && <span className="text-[10px] text-gray-500">WIN</span>}
        </div>
        <div className="flex justify-between">
            <span className={`${winner === teamB ? 'text-bad-green' : 'text-gray-500'} font-bold text-sm`}>{teamB}</span>
            {winner === teamB && <span className="text-[10px] text-gray-500">WIN</span>}
        </div>
    </div>
);


export default function TournamentsPage() {
    return (
        <main className="ml-28 mr-6 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-bad-green text-black px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                        <span className="text-gray-400 text-xs font-bold">Gor Koni • 24-25 Aug</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight">Bandung Open</h1>
                </div>
                
                <Tabs defaultValue="bracket" className="bg-white p-1 rounded-full flex">
                    <TabsList className="p-0 bg-transparent">
                        <TabsTrigger value="bracket" className="px-6 py-2 rounded-full text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">Bracket</TabsTrigger>
                        <TabsTrigger value="peserta" className="px-6 py-2 rounded-full text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">Peserta</TabsTrigger>
                        <TabsTrigger value="hadiah" className="px-6 py-2 rounded-full text-sm font-bold data-[state=active]:bg-black data-[state=active]:text-white">Hadiah</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] p-8 overflow-x-auto">
                <div className="flex gap-16 min-w-max">
                    <div className="w-64 space-y-6">
                        <h3 className="text-center text-gray-500 font-bold text-xs uppercase">Quarter Finals</h3>
                        <BracketMatch teamA="Kevin/Marcus" teamB="Ahsan/Hendra" scoreA={21} scoreB={19} isWinnerA={true} />
                        <BracketMatch teamA="Fajar/Rian" teamB="Leo/Daniel" scoreA={0} scoreB={0} isWinnerA={false} />
                    </div>
                    
                    <div className="w-64 space-y-6 pt-12">
                        <h3 className="text-center text-gray-500 font-bold text-xs uppercase">Semi Finals</h3>
                        <SemiFinalMatch teamA="Kevin/Marcus" teamB="TBD" winner="Kevin/Marcus"/>
                    </div>
                </div>
            </div>
        </main>
    );
}
