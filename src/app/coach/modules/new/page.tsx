'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Plus, ListTodo, Dumbbell, GripVertical, Gauge, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FormValues = {
  title: string;
  level: string;
  durationMinutes: number;
  tags: string; // Comma separated for input
  drills: { name: string }[];
};

export default function NewModulePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [activeLevel, setActiveLevel] = useState('Beginner');

  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      level: 'Beginner',
      durationMinutes: 60,
      tags: '',
      drills: [{ name: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "drills"
  });

  // Watch for dynamic styling
  const currentLevel = watch('level');

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: data.title,
        level: data.level,
        durationMinutes: Number(data.durationMinutes),
        tags: data.tags.split(',').map(t => t.trim()).filter(t => t),
        drills: data.drills.map(d => d.name).filter(n => n)
      };

      const res = await fetch('/api/coach/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({ title: "Module Created!", description: "Your new training curriculum is ready.", className: "bg-green-600 text-white border-none" });
        router.push('/coach/modules');
      } else {
        throw new Error("Failed to create module");
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in zoom-in-95 duration-500">

      {/* 1. Header Navigation */}
      <div className="flex items-center gap-6 mb-12 group">
        <Link href="/coach/modules">
          <Button variant="ghost" size="icon" className="rounded-2xl w-14 h-14 bg-[#151515] hover:bg-[#ffbe00] hover:text-black text-white border border-white/5 shadow-2xl transition-all duration-300 hover:scale-110">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
            New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d]">Module</span>
          </h1>
          <p className="text-gray-400 font-bold tracking-widest text-xs uppercase mt-2 pl-1 border-l-2 border-[#ffbe00] pl-3">
            Curriculum Builder
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-7 space-y-8">

          {/* Card: Title & Config */}
          <Card className="bg-[#151515]/80 backdrop-blur-xl border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fff]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#ffbe00]/10 transition-all duration-700"></div>

            <div className="space-y-8 relative z-10">

              {/* Title Input */}
              <div className="space-y-3">
                <label className="text-xs font-black text-[#ffbe00] uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Dumbbell className="w-3 h-3" /> Module Title
                </label>
                <div className="relative">
                  <Input
                    {...register("title", { required: true })}
                    placeholder="e.g. ULTIMATE SMASH DRILL"
                    className="bg-[#0a0a0a] border-none h-20 rounded-[2rem] text-white font-black text-2xl md:text-3xl placeholder:text-gray-700 px-8 hover:bg-[#0f0f0f] focus:ring-2 focus:ring-[#ffbe00]/50 transition-all shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ffbe00] animate-pulse"></div>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Focus Tags
                </label>
                <Input
                  {...register("tags")}
                  placeholder="Footwork, Power, Agility..."
                  className="bg-[#0a0a0a] border-none h-16 rounded-[1.5rem] text-gray-300 font-bold text-lg px-6 hover:bg-[#0f0f0f] focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
                />
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="bg-[#0a0a0a] p-5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group/time">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                    <Clock className="w-3 h-3 group-hover/time:text-[#ca1f3d] transition-colors" /> Duration
                  </label>
                  <div className="flex items-end gap-2">
                    <input
                      type="number"
                      {...register("durationMinutes", { required: true })}
                      className="bg-transparent border-none text-4xl font-black text-white w-full p-0 focus:ring-0 placeholder:text-gray-800"
                      placeholder="60"
                    />
                    <span className="text-xs font-bold text-gray-500 mb-2">MIN</span>
                  </div>
                </div>

                {/* Level Selection (Visual) */}
                <div className="bg-[#0a0a0a] p-5 rounded-[2rem] border border-white/5 pointer-events-none relative overflow-hidden">
                  <div className={`absolute inset-0 opacity-20 transition-colors duration-500 ${currentLevel === 'Advance' ? 'bg-[#ca1f3d]' : currentLevel === 'Intermediate' ? 'bg-[#ffbe00]' : 'bg-green-500'}`}></div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block flex items-center gap-2 relative z-10">
                    <Gauge className="w-3 h-3" /> Intensity
                  </label>
                  <div className="text-2xl font-black text-white uppercase italic relative z-10 pt-1">
                    {currentLevel}
                  </div>
                </div>
              </div>

              {/* Level Selector Buttons */}
              <div className="grid grid-cols-3 gap-2 bg-[#0a0a0a] p-2 rounded-[1.5rem]">
                {['Beginner', 'Intermediate', 'Advance'].map((lvl) => (
                  <div
                    key={lvl}
                    onClick={() => setValue('level', lvl)}
                    className={cn(
                      "text-center py-3 rounded-xl text-xs font-black uppercase cursor-pointer transition-all duration-300 select-none",
                      currentLevel === lvl
                        ? lvl === 'Advance' ? "bg-[#ca1f3d] text-white shadow-[0_0_15px_rgba(202,31,61,0.5)]"
                          : lvl === 'Intermediate' ? "bg-[#ffbe00] text-black shadow-[0_0_15px_rgba(255,190,0,0.5)]"
                            : "bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                        : "text-gray-600 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {lvl}
                  </div>
                ))}
              </div>

            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Curriculum Drills */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <Card className="bg-[#151515] border-white/5 p-6 rounded-[3rem] flex-1 flex flex-col shadow-2xl relative overflow-hidden border-t-4 border-t-[#ffbe00]">

            <div className="flex justify-between items-center mb-6 pl-2 pr-2">
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Drills</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sequence & Flow</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#ffbe00] flex items-center justify-center text-black shadow-lg animate-bounce">
                <ListTodo className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {fields.map((field, index) => (
                <div key={field.id} className="group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ffbe00] to-transparent rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex gap-3 items-center bg-[#0a0a0a] p-3 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all group-hover:translate-x-1">
                    <div className="flex flex-col items-center justify-center w-8 text-gray-700 group-hover:text-[#ffbe00] cursor-grab active:cursor-grabbing transition-colors">
                      <span className="text-[9px] font-mono font-bold mb-1">0{index + 1}</span>
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <Input
                        {...register(`drills.${index}.name` as const, { required: true })}
                        placeholder="Drill Name..."
                        className="bg-transparent border-none text-white font-bold h-auto p-0 placeholder:text-gray-700 focus:ring-0 text-sm"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-xl text-gray-700 hover:bg-[#ca1f3d] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => append({ name: '' })}
              variant="outline"
              className="w-full mt-6 h-12 rounded-2xl border-dashed border-gray-700 text-gray-500 hover:text-white hover:border-[#ffbe00] hover:bg-[#ffbe00]/10 transition-all uppercase font-bold text-xs tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Next Drill
            </Button>
          </Card>

          {/* SAVE BUTTON */}
          <Button
            disabled={submitting}
            onClick={handleSubmit(onSubmit)}
            className="w-full mt-6 h-16 rounded-[2rem] bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] hover:to-[#ffbe00] text-black font-black text-xl uppercase tracking-tighter shadow-[0_0_40px_rgba(255,190,0,0.3)] hover:shadow-[0_0_60px_rgba(255,190,0,0.5)] hover:scale-[1.02] transition-all relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-3">
              {submitting ? "PUBLISHING..." : "PUBLISH MODULE"} <Save className="w-6 h-6" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Button>

        </div>
      </form>
    </div>
  );
}

function Trash2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
  )
}
