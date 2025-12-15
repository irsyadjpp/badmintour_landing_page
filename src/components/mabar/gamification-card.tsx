import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Medal, Clock, ShieldCheck } from 'lucide-react';

export default function GamificationCard() {
  const badges = [
    { label: "Early Bird", icon: Clock, color: "bg-blue-100 text-blue-700", desc: "Datang 30 menit sebelum mulai" },
    { label: "MVP Mabar", icon: Medal, color: "bg-yellow-100 text-yellow-700", desc: "Voted by 8 players" },
    { label: "Unstoppable", icon: Flame, color: "bg-red-100 text-red-700", desc: "Win streak 5x" },
    { label: "Fair Play", icon: ShieldCheck, color: "bg-green-100 text-green-700", desc: "0 pelanggaran" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Your Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, idx) => (
            <div key={idx} className={`flex flex-col items-center p-4 rounded-2xl ${badge.color} bg-opacity-50 border-2 border-transparent hover:border-black/5 transition-all cursor-default`}>
              <div className="p-3 bg-white/50 rounded-full mb-3 backdrop-blur-sm">
                <badge.icon className="h-6 w-6" />
              </div>
              <span className="font-bold text-sm mb-1">{badge.label}</span>
              <span className="text-[10px] opacity-80 text-center leading-tight">{badge.desc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
