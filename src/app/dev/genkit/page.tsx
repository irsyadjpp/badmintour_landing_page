'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';

export default function GenkitDevPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const [formData, setFormData] = useState({
    playerName: 'Budi Santoso',
    level: 'Intermediate',
    scores: {
      biomechanics: 3,
      footwork: 2,
      strokeQuality: 4,
      defense: 3,
      offense: 4,
      gameIQ: 2,
      physique: 3,
    },
    coachNotes: 'Stamina bagus tapi footwork berantakan saat defense.'
  });

  const generateFeedback = async () => {
    setLoading(true);
    setResult('');
    try {
      // Simulate API call to a specific dev endpoint or use the flow directly if possible server-side
      // For this Dev UI, we'll hit a server action or a specific dev route
      // Creating a simple server action inline logic via API Route for simulation
      const res = await fetch('/api/dev/genkit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data.output || data.error);
    } catch (e: any) {
      setResult('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/50">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Genkit Prompt Playground</h1>
            <p className="text-gray-400">Test AI Feedback Generation without database validation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* INPUT FORM */}
          <Card className="bg-[#151515] border-white/10 p-6 space-y-6">
            <h3 className="font-bold text-lg border-b border-white/5 pb-2">Input Simulation</h3>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Player Name</Label>
                <Input
                  value={formData.playerName}
                  onChange={e => setFormData({ ...formData, playerName: e.target.value })}
                  className="bg-[#0a0a0a] text-white border-white/20 focus:border-blue-500"
                />
              </div>
              <div>
                <Label className="text-gray-300">Level</Label>
                <Input
                  value={formData.level}
                  onChange={e => setFormData({ ...formData, level: e.target.value })}
                  className="bg-[#0a0a0a] text-white border-white/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.scores).map((key) => (
                  <div key={key}>
                    <Label className="capitalize text-xs text-gray-400 font-bold">{key}</Label>
                    <Input
                      type="number"
                      min="1" max="5"
                      value={(formData.scores as any)[key]}
                      onChange={e => setFormData({
                        ...formData,
                        scores: { ...formData.scores, [key]: parseInt(e.target.value) }
                      })}
                      className="bg-[#0a0a0a] text-white border-white/20 focus:border-blue-500 mt-1"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label className="text-gray-300">Coach Notes</Label>
                <Textarea
                  value={formData.coachNotes}
                  onChange={e => setFormData({ ...formData, coachNotes: e.target.value })}
                  className="bg-[#0a0a0a] text-white border-white/20 focus:border-blue-500 min-h-[100px]"
                />
              </div>

              <Button
                onClick={generateFeedback}
                className="w-full bg-blue-600 hover:bg-blue-500 font-bold"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2 w-4 h-4" />}
                GENERATE FEEDBACK
              </Button>
            </div>
          </Card>

          {/* OUTPUT RESULT */}
          <Card className="bg-[#151515] border-white/10 p-6 flex flex-col h-full bg-gradient-to-br from-blue-900/10 to-transparent">
            <h3 className="font-bold text-lg border-b border-white/5 pb-2 mb-4 flex items-center justify-between">
              AI Output
              {result && <span className="text-xs font-mono text-green-500">Completed</span>}
            </h3>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 animate-pulse">
                <BrainCircuit className="w-12 h-12 mb-4 opacity-50" />
                <p>Thinking...</p>
              </div>
            ) : (
              <div className="flex-1 whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed overflow-y-auto max-h-[600px] p-4 bg-black/50 rounded-xl border border-white/5">
                {result || "Waiting for input..."}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
