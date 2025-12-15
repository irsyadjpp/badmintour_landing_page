'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shuffle, UserPlus, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: string;
  name: string;
}

interface Match {
  id: number;
  teamA: Player[];
  teamB: Player[];
}

export default function MatchGenerator() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Irsyad' }, { id: '2', name: 'Budi' },
    { id: '3', name: 'Kevin' }, { id: '4', name: 'Marcus' },
    { id: '5', name: 'Hendra' }, { id: '6', name: 'Ahsan' },
    { id: '7', name: 'Fajar' }, { id: '8', name: 'Rian' },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [generatedMatches, setGeneratedMatches] = useState<Match[]>([]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers([...players, { id: Date.now().toString(), name: newPlayerName }]);
    setNewPlayerName('');
  };

  const generateMatches = () => {
    // 1. Shuffle array pemain
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    
    // 2. Bagi jadi tim (Double vs Double = 4 orang per match)
    const matches: Match[] = [];
    let matchId = 1;

    for (let i = 0; i < shuffled.length; i += 4) {
      if (i + 3 < shuffled.length) {
        matches.push({
          id: matchId++,
          teamA: [shuffled[i], shuffled[i + 1]],
          teamB: [shuffled[i + 2], shuffled[i + 3]],
        });
      }
    }
    setGeneratedMatches(matches);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      {/* Panel Kiri: Input Pemain */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Daftar Pemain ({players.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Nama Pemain..." 
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            <Button onClick={addPlayer} size="icon"><UserPlus className="h-4 w-4" /></Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <Badge key={p.id} variant="secondary" className="px-3 py-1 text-sm">
                {p.name}
              </Badge>
            ))}
          </div>

          <Button 
            className="w-full mt-4 bg-primary text-primary-foreground font-bold" 
            onClick={generateMatches}
            disabled={players.length < 4}
          >
            <Shuffle className="mr-2 h-4 w-4" /> Acak Pasangan (Generate)
          </Button>
        </CardContent>
      </Card>

      {/* Panel Kanan: Hasil Match */}
      <div className="space-y-4">
        {generatedMatches.length > 0 ? (
          generatedMatches.map((match) => (
            <Card key={match.id} className="overflow-hidden border-2 border-muted hover:border-accent transition-colors">
              <div className="bg-muted px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest flex justify-between">
                <span>Court {match.id}</span>
                <span>Match {match.id}</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  {/* Team A */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="font-bold text-lg text-primary">{match.teamA[0].name}</div>
                    <div className="font-bold text-lg text-primary">{match.teamA[1].name}</div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-muted-foreground/30 italic">VS</span>
                  </div>

                  {/* Team B */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="font-bold text-lg text-accent-foreground">{match.teamB[0].name}</div>
                    <div className="font-bold text-lg text-accent-foreground">{match.teamB[1].name}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20 text-muted-foreground">
            <p>Belum ada jadwal pertandingan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
