import { Users, Dumbbell, Trophy, Zap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EventTypeSelectionProps {
  onSelect: (type: string) => void;
}

export function EventTypeSelection({ onSelect }: EventTypeSelectionProps) {
  const types = [
    {
      id: 'mabar',
      title: 'Mabar (Fun Game)',
      description: 'Latihan bersama santai, rotasi pemain bebas, cocok untuk semua level.',
      icon: <Users className="w-8 h-8 text-[#00f2ea]" />,
      color: 'border-[#00f2ea]/20 hover:border-[#00f2ea] hover:bg-[#00f2ea]/5 group-hover:text-[#00f2ea]'
    },
    {
      id: 'drilling',
      title: 'Drilling / Clinic',
      description: 'Kelas latihan terstruktur dengan Coach, modul latihan, dan evaluasi.',
      icon: <Dumbbell className="w-8 h-8 text-[#ffbe00]" />,
      color: 'border-[#ffbe00]/20 hover:border-[#ffbe00] hover:bg-[#ffbe00]/5 group-hover:text-[#ffbe00]'
    },
    {
      id: 'sparring',
      title: 'Sparring (Vs Team)',
      description: 'Pertandingan persahabatan melawan klub atau tim lain.',
      icon: <Zap className="w-8 h-8 text-[#ca1f3d]" />,
      color: 'border-[#ca1f3d]/20 hover:border-[#ca1f3d] hover:bg-[#ca1f3d]/5 group-hover:text-[#ca1f3d]'
    },
    {
      id: 'tournament',
      title: 'Turnamen (Competition)',
      description: 'Kompetisi resmi dengan sistem gugur, banyak kategori, dan hadiah.',
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      color: 'border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/5 group-hover:text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {types.map((t) => (
        <Card
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`group bg-[#151515] p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 relative overflow-hidden ${t.color}`}
        >
          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/5 rounded-2xl">
                {t.icon}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-2 group-hover:translate-x-1 transition-transform">
                {t.title}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300">
                {t.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
