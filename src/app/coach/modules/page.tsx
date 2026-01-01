'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Clock, ExternalLink, Trash2, Edit, Star } from 'lucide-react';
import Link from 'next/link';

export default function CoachModulesPage() {
  const { data: session } = useSession();

  // Fetch Modules
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['coach-modules', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const res = await fetch('/api/coach/modules');
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 uppercase italic tracking-tighter">
            <Dumbbell className="w-10 h-10 text-[#ca1f3d]" /> Training Modules
          </h1>
          <p className="text-gray-400 mt-2 font-medium">Create and manage your badminton training curriculums.</p>
        </div>
        <Link href="/coach/modules/new">
          <Button className="h-12 px-8 rounded-xl bg-[#ffbe00] text-black hover:bg-[#ffbe00] hover:scale-105 transition-all font-black shadow-[0_0_20px_rgba(255,190,0,0.4)]">
            <Plus className="w-5 h-5 mr-2" /> CREATE NEW MODULE
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-[#151515] rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-20 bg-[#151515] rounded-[2rem] border border-white/5 border-dashed">
          <Dumbbell className="w-20 h-20 text-gray-700 mx-auto mb-6 opacity-20" />
          <h3 className="text-2xl font-black text-white mb-2">No Modules Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Start creating your first training module to assign it to your drilling sessions.</p>
          <Link href="/coach/modules/new">
            <Button variant="outline" className="border-[#ca1f3d] text-[#ca1f3d] hover:bg-[#ca1f3d] hover:text-white rounded-xl font-bold">
              Create First Module
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod: any) => (
            <Card key={mod.id} className="bg-[#151515] border-white/5 p-6 rounded-[2rem] group relative overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#ca1f3d]/30 flex flex-col justify-between h-full">
              {/* Decorative Details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ca1f3d]/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-[#ca1f3d]/10"></div>

              <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <Badge variant="outline" className={`
                                        uppercase font-bold tracking-widest px-3 py-1 rounded-full text-[10px]
                                        ${mod.level === 'Advance' ? 'border-purple-500 text-purple-500 bg-purple-500/10' :
                      mod.level === 'Intermediate' ? 'border-[#ffbe00] text-[#ffbe00] bg-[#ffbe00]/10' :
                        'border-green-500 text-green-500 bg-green-500/10'}
                                    `}>
                    {mod.level}
                  </Badge>
                  <div className="text-xs font-bold text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3" /> {mod.durationMinutes} min
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 leading-tight group-hover:text-[#ca1f3d] transition-colors line-clamp-2">
                  {mod.title}
                </h3>

                <div className="space-y-3 mt-4 mb-6">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-3 h-3 text-[#ffbe00]" /> Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mod.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold text-gray-300 bg-[#0a0a0a] border border-white/10 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                    {mod.tags.length > 3 && <span className="text-[10px] text-gray-500 py-1">+{mod.tags.length - 3}</span>}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-2 mt-auto pt-6 border-t border-white/5 relative z-10">
                <Button size="sm" variant="ghost" className="flex-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-bold">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="w-10 h-10 p-0 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
