'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Trophy,
  Swords,
  Coins,
  Play,
  RotateCcw,
  Save,
  ChevronRight,
  Loader2,
  RefreshCw,
  Medal,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// --- SUB-COMPONENTS ---

// 1. PLAYER SELECTOR (Gen-Z Style)
function PlayerSelector({ participants, playCounts, onConfirm }: any) {
  const [teamA, setTeamA] = useState<any[]>([]);
  const [teamB, setTeamB] = useState<any[]>([]);

  const toggleSelection = (p: any) => {
    const inA = teamA.find(x => x.userId === p.userId);
    const inB = teamB.find(x => x.userId === p.userId);

    if (inA) {
      setTeamA(teamA.filter(x => x.userId !== p.userId));
    } else if (inB) {
      setTeamB(teamB.filter(x => x.userId !== p.userId));
    } else {
      if (teamA.length < 2) setTeamA([...teamA, p]);
      else if (teamB.length < 2) setTeamB([...teamB, p]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="border-[#ffbe00] text-[#ffbe00] px-4 py-1 rounded-full uppercase tracking-[0.2em] font-black text-[10px] animate-pulse">Match Setup</Badge>
        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Draft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ffff00]">Squad</span>
        </h2>
        <p className="text-gray-400 font-medium">Select players for the ultimate showdown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEAM A (RED) */}
        <Card className="bg-gradient-to-br from-[#ca1f3d]/20 to-black border-2 border-[#ca1f3d]/50 p-6 rounded-[2.5rem] min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#ca1f3d] transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ca1f3d]"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#ca1f3d]/20 blur-[50px] rounded-full group-hover:bg-[#ca1f3d]/30 transition"></div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <h3 className="text-[#ca1f3d] font-black uppercase italic tracking-widest text-xl mb-4 drop-shadow-md">Team Red (Doubles)</h3>

            <div className="flex gap-4 justify-center w-full">
              {[0, 1].map((index) => {
                const player = teamA[index];
                return (
                  <div
                    key={index}
                    onClick={() => player && toggleSelection(player)}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      player ? "cursor-pointer hover:scale-110" : "opacity-50"
                    )}
                  >
                    <div className="relative">
                      {player ? (
                        <>
                          <Avatar className="w-16 h-16 border-4 border-[#ca1f3d] shadow-[0_0_20px_rgba(202,31,61,0.5)]">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback className="bg-[#ca1f3d] text-white font-black">{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 bg-[#ca1f3d] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">A{index + 1}</div>
                        </>
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#ca1f3d]/30 flex items-center justify-center text-[#ca1f3d]/50 bg-[#ca1f3d]/5">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-black text-white mt-2 uppercase tracking-wide">
                      {player ? player.name.split(' ')[0] : "Empty Slot"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* TEAM B (YELLOW) */}
        <Card className="bg-gradient-to-bl from-[#ffbe00]/20 to-black border-2 border-[#ffbe00]/50 p-6 rounded-[2.5rem] min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#ffbe00] transition-colors duration-300">
          <div className="absolute top-0 right-0 w-full h-1 bg-[#ffbe00]"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffbe00]/20 blur-[50px] rounded-full group-hover:bg-[#ffbe00]/30 transition"></div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <h3 className="text-[#ffbe00] font-black uppercase italic tracking-widest text-xl mb-4 drop-shadow-md">Team Yellow (Doubles)</h3>

            <div className="flex gap-4 justify-center w-full">
              {[0, 1].map((index) => {
                const player = teamB[index];
                return (
                  <div
                    key={index}
                    onClick={() => player && toggleSelection(player)}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      player ? "cursor-pointer hover:scale-110" : "opacity-50"
                    )}
                  >
                    <div className="relative">
                      {player ? (
                        <>
                          <Avatar className="w-16 h-16 border-4 border-[#ffbe00] shadow-[0_0_20px_rgba(255,190,0,0.5)]">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback className="bg-[#ffbe00] text-black font-black">{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-2 -right-2 bg-[#ffbe00] text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">B{index + 1}</div>
                        </>
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#ffbe00]/30 flex items-center justify-center text-[#ffbe00]/50 bg-[#ffbe00]/5">
                          <Users className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-black text-white mt-2 uppercase tracking-wide">
                      {player ? player.name.split(' ')[0] : "Empty Slot"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* ROSTER */}
      <div className="bg-[#151515] rounded-[2rem] p-6 border border-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest italic">Roster Available</h4>
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">{participants.length} Players</Badge>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {participants.map((p: any) => {
            const isSelected = teamA.find(x => x.userId === p.userId) || teamB.find(x => x.userId === p.userId);
            const playCount = playCounts[p.userId] || 0;
            const isPlayedEnough = playCount >= 3;

            return (
              <Button
                key={p.userId}
                variant="ghost"
                className={cn(
                  "h-auto flex-col gap-2 py-3 px-2 rounded-2xl border transition-all duration-300 group relative",
                  isSelected
                    ? "opacity-30 grayscale border-transparent bg-transparent scale-95"
                    : "bg-[#0a0a0a] border-white/5 hover:border-[#ffbe00] hover:bg-white/5 hover:-translate-y-1"
                )}
                onClick={() => toggleSelection(p)}
              >
                {/* Play Count Badge */}
                <div className={cn(
                  "absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full text-[9px] font-black border",
                  isPlayedEnough
                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                    : "bg-red-500/20 text-red-500 border-red-500/30"
                )}>
                  {playCount}
                </div>

                <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-[#ffbe00] transition-all">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback className="text-[10px] font-bold">{p.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center w-full gap-0.5">
                  <span className="text-[10px] text-gray-300 font-bold truncate w-full group-hover:text-white transition-colors">
                    {p.name.split(' ')[0]}
                  </span>
                  <span className={cn("text-[9px] truncate w-full", isPlayedEnough ? "text-green-500" : "text-gray-600")}>
                    {playCount}/3 Match
                  </span>
                </div>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button
          className={cn(
            "w-full h-16 text-xl italic font-black rounded-3xl transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]",
            teamA.length === 2 && teamB.length === 2
              ? "bg-white text-black hover:bg-gray-200 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,190,0,0.4)]"
              : "bg-[#1f1f1f] text-gray-600 cursor-not-allowed"
          )}
          disabled={teamA.length !== 2 || teamB.length !== 2}
          onClick={() => onConfirm(teamA, teamB)}
        >
          START COIN TOSS <ChevronRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

// 2. COIN TOSS (3D Animation)
function CoinToss({ teamA, teamB, onComplete }: any) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);

  const flip = () => {
    setFlipping(true);
    // Sound effect could go here
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? 'A' : 'B';
      setResult(winner);
      setFlipping(false);
    }, 2000);
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Coin Toss</h2>
        <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Who serves first?</p>
      </div>

      <div className="relative w-64 h-64 perspective-1000">
        <div className={cn(
          "w-full h-full relative transition-transform duration-[2000ms] transform-style-3d cursor-pointer active:scale-95 transition-all text-white",
          flipping && "animate-flip",
        )} onClick={!flipping && !result ? flip : undefined}>

          <div className={cn(
            "w-full h-full rounded-full border-[8px] flex items-center justify-center shadow-[0_0_80px_rgba(255,190,0,0.3)] bg-gradient-to-b from-[#1a1a1a] to-black backdrop-blur-xl relative overflow-hidden group",
            result === 'A' ? "border-[#ca1f3d] shadow-[0_0_80px_rgba(202,31,61,0.6)]" :
              result === 'B' ? "border-[#ffbe00] shadow-[0_0_80px_rgba(255,190,0,0.6)]" :
                "border-gray-700 hover:border-[#ffbe00]/50"
          )}>

            {/* Decorative Shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-t-full pointer-events-none"></div>

            {flipping ? (
              <RefreshCw className="w-24 h-24 text-white/50 animate-spin" />
            ) : result ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className={cn("text-8xl font-black italic", result === 'A' ? "text-[#ca1f3d]" : "text-[#ffbe00]")}>
                  {result}
                </div>
              </div>
            ) : (
              <div className="text-center group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-24 h-24 text-gray-500 group-hover:text-[#ffbe00] transition-colors mb-2 mx-auto" />
                <p className="text-xs font-black uppercase text-gray-600 group-hover:text-[#ffbe00]">Tap to Flip</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {result ? (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Winner</p>
            <h3 className={cn("text-5xl font-black italic uppercase drop-shadow-lg", result === 'A' ? "text-[#ca1f3d]" : "text-[#ffbe00]")}>
              {result === 'A' ? "Team Red" : "Team Yellow"}
            </h3>
          </div>

          <Button onClick={() => onComplete(result)} className="w-64 h-16 rounded-[2rem] text-xl font-black italic bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            KICK OFF <Play className="ml-3 w-5 h-5 fill-black" />
          </Button>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center">
          <span className="text-gray-600 animate-pulse text-sm font-bold tracking-widest uppercase">Waiting for flip...</span>
        </div>
      )}
    </div>
  )
}

// 3. SCOREBOARD (Advanced Umpire UI)
function Scoreboard({ teamA, teamB, serverSide, onFinishMatch, isSaving }: any) {
  // Game State
  const [scores, setScores] = useState<{ A: number, B: number }[]>([{ A: 0, B: 0 }]);
  const [currentGame, setCurrentGame] = useState(0);
  const [server, setServer] = useState<'A' | 'B'>(serverSide);

  // Player Positions [Right Court, Left Court]
  // Initial: 0=Right, 1=Left
  const [posA, setPosA] = useState([teamA[0], teamA[1]]);
  const [posB, setPosB] = useState([teamB[0], teamB[1]]);

  // Timer State
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // History for Undo
  const [history, setHistory] = useState<any[]>([]);

  const MAX_POINTS = 15;
  const MAX_LIMIT = 20;
  const currentScore = scores[currentGame];

  // Timer Effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Format Time
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const addPoint = (winner: 'A' | 'B') => {
    // Save State for Undo
    setHistory([...history, {
      scores: JSON.parse(JSON.stringify(scores)),
      currentGame,
      server,
      posA: [...posA],
      posB: [...posB],
      seconds // Optional: Undo timer? Maybe not needed for strict logic but good for state sync
    }]);

    const newScores = [...scores];
    newScores[currentGame][winner]++;

    // Update Positions & Server Logic (BWF Doubles)
    // Rule: If Serving side wins -> Swap positions. Server continues serving.
    // Rule: If Receiving side wins -> No swap. Become server.

    if (winner === server) {
      // Server Won: Swap Positions
      if (winner === 'A') setPosA([posA[1], posA[0]]); // Swap A
      else setPosB([posB[1], posB[0]]); // Swap B
      // Server remains same side
    } else {
      // Receiver Won: No Swap. Change Serve Side.
      setServer(winner);
    }

    setScores(newScores);

    // Check Win
    const isGameWin = checkGameWin(newScores[currentGame].A, newScores[currentGame].B);
    if (isGameWin) {
      handleGameEnd(isGameWin, newScores);
    }
  };

  const checkGameWin = (a: number, b: number) => {
    if (a >= MAX_POINTS && a - b >= 2) return 'A';
    if (b >= MAX_POINTS && b - a >= 2) return 'B';
    if (a === MAX_LIMIT) return 'A';
    if (b === MAX_LIMIT) return 'B';
    return null;
  }

  const handleGameEnd = (winner: 'A' | 'B', currentScores: any) => {
    let winsA = 0;
    let winsB = 0;
    currentScores.forEach((s: any) => {
      // Simple check for previous games
      const gameWinner = s.A > s.B ? 'A' : 'B';
      // Logic needs to be robust, but for now assuming finished games are valid wins
      if (s.A >= MAX_POINTS || s.B >= MAX_POINTS) {
        if (gameWinner === 'A') winsA++; else winsB++;
      }
    });

    if (winsA === 2 || winsB === 2) {
      // Match Over
      setIsPaused(true);
      onFinishMatch({
        winner: winsA === 2 ? 'A' : 'B',
        scores: currentScores,
        durationSeconds: seconds
      });
    } else {
      // Next Game
      if (currentGame < 2) {
        setTimeout(() => {
          // Use minimal disruption confirm or toast
          // For strict requirement "No Rest", we could auto-proceed, but user usually wants a moment.
          // We'll just show the next game setup immediately.

          // Reset Positions for new game? BWF: Loser of game serves first in next game? No, winner serves.
          // Positions can stay or reset. Usually players pick sides. 
          // We will Reset positions to initial for simplicity or keep flow. 
          // Let's Keep flow but reset scores.

          setScores([...currentScores, { A: 0, B: 0 }]);
          setCurrentGame(currentGame + 1);
          setServer(winner); // Winner of game serves first
          // Ideally we might reset positions here:
          setPosA([teamA[0], teamA[1]]);
          setPosB([teamB[0], teamB[1]]);
        }, 1000);
      }
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setScores(last.scores);
    setCurrentGame(last.currentGame);
    setServer(last.server);
    setPosA(last.posA);
    setPosB(last.posB);
    setHistory(history.slice(0, -1));
  };

  // Helper: Who is serving from where?
  // Server is determined by score parity.
  // If (Score % 2 == 0) -> Right Court (Index 0).
  // If (Score % 2 == 1) -> Left Court (Index 1).
  const servingCourtIndex = scores[currentGame][server] % 2;

  if (isSaving) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md flex-col space-y-4">
        <Loader2 className="w-16 h-16 text-[#ffbe00] animate-spin" />
        <p className="text-xl font-black italic text-white animate-pulse">SAVING MATCH...</p>
      </div>
    )
  }

  return (
    <div className="h-[85vh] flex flex-col relative bg-black select-none">

      {/* 1. TOP BAR: Timer & Game Info */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${isPaused ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
            {isPaused ? <Play className="w-4 h-4 text-red-500" /> : <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />}
            <span className="font-mono text-xl font-bold text-white">{formatTime(seconds)}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-gray-500 hover:text-white">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#ffbe00]">Match Score (Best 3)</span>
            <div className="flex gap-2 text-white font-black text-lg">
              {scores.map((s, i) => (
                <span key={i} className={i === currentGame ? "text-white" : "text-gray-600"}>
                  {s.A}-{s.B}
                </span>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={undo} disabled={history.length === 0}>
            <RotateCcw className="w-5 h-5 text-gray-500 hover:text-[#ffbe00]" />
          </Button>
        </div>
      </div>

      {/* 2. MAIN SPLIT SCREEN */}
      <div className="flex-1 flex flex-col md:flex-row relative">

        {/* TEAM A (RED) */}
        <div
          onClick={() => addPoint('A')}
          className="flex-1 relative border-r border-white/10 cursor-pointer active:brightness-125 transition-all"
        >
          <div className="absolute inset-0 bg-[#ca1f3d] bg-[url('/noise.png')] bg-blend-overlay opacity-90"></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/40"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
            {/* Team Name */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <Badge className="bg-white text-[#ca1f3d] text-lg px-3 py-1">Team Red</Badge>
            </div>

            {/* BIG SCORE */}
            <h1 className="text-[14rem] md:text-[20rem] font-black text-white italic leading-none drop-shadow-2xl">{currentScore.A}</h1>

            {/* PLAYERS / COURTS */}
            <div className="flex gap-8 mt-8">
              {/* Right Court (Index 0) */}
              <div className={cn(
                "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 w-32",
                server === 'A' && servingCourtIndex === 0 ? "border-white bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110" : "border-transparent opacity-60"
              )}>
                <Avatar className="w-16 h-16 border-2 border-white mb-2"><AvatarImage src={posA[0]?.avatar} /><AvatarFallback>{posA[0]?.name[0]}</AvatarFallback></Avatar>
                <span className="text-white font-bold text-xs uppercase truncate w-full text-center">{posA[0]?.name.split(' ')[0]}</span>
                <div className="mt-1 text-[10px] text-white/50 font-mono">RIGHT (E)</div>
                {server === 'A' && servingCourtIndex === 0 && <Badge className="mt-2 bg-[#ffbe00] text-black text-[9px] animate-pulse">SERVE</Badge>}
              </div>

              {/* Left Court (Index 1) */}
              <div className={cn(
                "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 w-32",
                server === 'A' && servingCourtIndex === 1 ? "border-white bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110" : "border-transparent opacity-60"
              )}>
                <Avatar className="w-16 h-16 border-2 border-white mb-2"><AvatarImage src={posA[1]?.avatar} /><AvatarFallback>{posA[1]?.name[0]}</AvatarFallback></Avatar>
                <span className="text-white font-bold text-xs uppercase truncate w-full text-center">{posA[1]?.name.split(' ')[0]}</span>
                <div className="mt-1 text-[10px] text-white/50 font-mono">LEFT (O)</div>
                {server === 'A' && servingCourtIndex === 1 && <Badge className="mt-2 bg-[#ffbe00] text-black text-[9px] animate-pulse">SERVE</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* TEAM B (YELLOW) */}
        <div
          onClick={() => addPoint('B')}
          className="flex-1 relative cursor-pointer active:brightness-125 transition-all"
        >
          <div className="absolute inset-0 bg-[#ffbe00] bg-[url('/noise.png')] bg-blend-overlay opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-black/40"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
            <div className="absolute top-6 right-6 flex items-center gap-3">
              <Badge className="bg-black text-[#ffbe00] text-lg px-3 py-1">Team Yellow</Badge>
            </div>

            {/* BIG SCORE */}
            <h1 className="text-[14rem] md:text-[20rem] font-black text-black italic leading-none drop-shadow-white">{currentScore.B}</h1>

            {/* PLAYERS / COURTS */}
            <div className="flex gap-8 mt-8">
              {/* Left Court (Index 1) - Visual mirroring? No, Standard logic. 
                        Wait, typically visual is Left/Right relative to Umpire. 
                        Let's keep standard 0=Right, 1=Left order in array, but render effectively.
                     */}
              <div className={cn(
                "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 w-32",
                server === 'B' && servingCourtIndex === 1 ? "border-black bg-black/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-110" : "border-transparent opacity-60"
              )}>
                <Avatar className="w-16 h-16 border-2 border-black mb-2"><AvatarImage src={posB[1]?.avatar} /><AvatarFallback className="text-black">{posB[1]?.name[0]}</AvatarFallback></Avatar>
                <span className="text-black font-bold text-xs uppercase truncate w-full text-center">{posB[1]?.name.split(' ')[0]}</span>
                <div className="mt-1 text-[10px] text-black/50 font-mono">LEFT (O)</div>
                {server === 'B' && servingCourtIndex === 1 && <Badge className="mt-2 bg-black text-[#ffbe00] text-[9px] animate-pulse">SERVE</Badge>}
              </div>

              {/* Right Court (Index 0) */}
              <div className={cn(
                "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 w-32",
                server === 'B' && servingCourtIndex === 0 ? "border-black bg-black/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-110" : "border-transparent opacity-60"
              )}>
                <Avatar className="w-16 h-16 border-2 border-black mb-2"><AvatarImage src={posB[0]?.avatar} /><AvatarFallback className="text-black">{posB[0]?.name[0]}</AvatarFallback></Avatar>
                <span className="text-black font-bold text-xs uppercase truncate w-full text-center">{posB[0]?.name.split(' ')[0]}</span>
                <div className="mt-1 text-[10px] text-black/50 font-mono">RIGHT (E)</div>
                {server === 'B' && servingCourtIndex === 0 && <Badge className="mt-2 bg-black text-[#ffbe00] text-[9px] animate-pulse">SERVE</Badge>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Ensure PlayCounts is passed correctly
export default function MatchControlPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [teamA, setTeamA] = useState<any[]>([]);
  const [teamB, setTeamB] = useState<any[]>([]);
  const [firstServer, setFirstServer] = useState<'A' | 'B'>('A');

  const { data: eventData, isLoading } = useQuery({
    queryKey: ['match-control', params.id],
    queryFn: async () => {
      const [eventRes, partRes] = await Promise.all([
        fetch(`/api/events/${params.id}?t=${Date.now()}`),
        fetch(`/api/events/${params.id}/participants?t=${Date.now()}`)
      ]);
      const eventJson = await eventRes.json();
      const partJson = await partRes.json();
      const participants = (partJson.data || []).map((p: any) => ({ ...p, userId: p.id }));
      return { ...(eventJson.data || {}), participants };
    }
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', params.id],
    queryFn: async () => {
      const res = await fetch(`/api/matches?eventId=${params.id}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled: !!params.id
  });

  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (matches) {
      const counts: Record<string, number> = {};
      matches.forEach((m: any) => {
        const players = [...(m.teamA || []), ...(m.teamB || [])];
        players.forEach((p: any) => {
          if (p?.userId) counts[p.userId] = (counts[p.userId] || 0) + 1;
        });
      });
      setPlayCounts(counts);
    }
  }, [matches]);

  const participants = eventData?.participants || [];

  const handleConfirmTeams = (a: any, b: any) => {
    setTeamA(a);
    setTeamB(b);
    setStep(2);
  };

  const handleTossComplete = (winner: 'A' | 'B') => {
    setFirstServer(winner);
    setStep(3);
  };

  const { mutate: saveMatch, isPending: isSaving } = useMutation({
    mutationFn: async (result: any) => {
      await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: params.id,
          teamA,
          teamB,
          scores: result.scores,
          winner: result.winner,
          durationSeconds: result.durationSeconds
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches', params.id] });
      toast({ title: "Match Saved!", description: "Result recorded." });
      setStep(1);
      setTeamA([]);
      setTeamB([]);
    }
  });

  const handleMatchFinish = (result: any) => saveMatch(result);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-white w-10 h-10" /></div>;

  return (
    <div className={cn("min-h-screen font-sans pb-safe bg-[#0a0a0a]", step !== 3 && "p-4 md:p-8")}>
      {step !== 3 && (
        <div className="flex justify-between items-center mb-8 w-full px-6 animate-in fade-in">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-500 hover:text-white pl-0">&larr; Exit</Button>
          <div className="flex items-center gap-2">
            <Swords className="text-[#ffbe00] w-5 h-5" />
            <span className="font-black italic text-lg uppercase tracking-wider text-white">UMPIRE<span className="text-[#ffbe00]">mode</span></span>
          </div>
          <div className="w-10"></div>
        </div>
      )}
      <div className={cn("mx-auto w-full", step !== 3 && "px-6")}>
        {step === 1 && <PlayerSelector participants={participants} playCounts={playCounts} onConfirm={handleConfirmTeams} />}
        {step === 2 && <CoinToss teamA={teamA} teamB={teamB} onComplete={handleTossComplete} />}
        {step === 3 && <Scoreboard teamA={teamA} teamB={teamB} serverSide={firstServer} onFinishMatch={handleMatchFinish} isSaving={isSaving} />}
      </div>
    </div>
  );
}
