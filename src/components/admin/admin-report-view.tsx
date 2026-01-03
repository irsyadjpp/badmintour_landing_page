"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Target,
  Zap,
  Shield,
  BrainCircuit,
  Activity,
  User,
  Quote
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

// Reusing Type (or import if exported)
export interface AssessmentReport {
  date: string;
  coachName: string;
  moduleTitle: string;
  level: string;
  totalScore: number;
  scores: {
    biomechanics: number;
    footwork: number;
    strokeQuality: number;
    defense: number;
    offense: number;
    gameIQ: number;
    physique: number;
    [key: string]: number;
  };
  notes: string;
  aiFeedback?: string;
  skillAnalysis?: Record<string, string>;
}

export default function AdminReportView({ report }: { report: AssessmentReport }) {

  // Prepare Data for Radar Chart
  const radarData = [
    { subject: 'Teknik', A: report.scores.biomechanics, fullMark: 5 },
    { subject: 'Footwork', A: report.scores.footwork, fullMark: 5 },
    { subject: 'Akurasi', A: report.scores.strokeQuality, fullMark: 5 },
    { subject: 'Attack', A: report.scores.offense, fullMark: 5 },
    { subject: 'Defense', A: report.scores.defense, fullMark: 5 },
    { subject: 'Taktik', A: report.scores.gameIQ, fullMark: 5 },
  ];

  // Helper func
  const getScoreColor = (score: number) => {
    if (score >= 5) return "text-[#ffbe00]"; // Gold
    if (score >= 4) return "text-emerald-500"; // Green
    if (score >= 3) return "text-blue-500"; // Blue
    return "text-orange-500";
  };

  const getLevelBadgeColor = (level: string) => {
    if (level.includes('Elite') || level.includes('Advance')) return 'bg-[#ca1f3d] text-white';
    if (level.includes('Intermediate')) return 'bg-[#ffbe00] text-black';
    return 'bg-emerald-600 text-white';
  };

  return (
    <div className="w-full space-y-6">

      {/* 1. HERO SECTION (Player Stats Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Info */}
        <Card className="lg:col-span-1 bg-[#151515] border-white/5 p-6 rounded-[2rem] relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbe00]/10 rounded-full blur-3xl"></div>

          <div className="w-24 h-24 rounded-full border-4 border-[#1A1A1A] bg-[#222] flex items-center justify-center mb-4 shadow-2xl relative z-10">
            <Trophy className={`w-10 h-10 ${getScoreColor(report.totalScore / 7)}`} />
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">
            {report.level}
          </h2>
          <Badge className={`mb-6 ${getLevelBadgeColor(report.level)} border-0 px-4 py-1 text-xs font-bold uppercase tracking-widest`}>
            Official Rank
          </Badge>

          <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Total Score</p>
              <p className="text-2xl font-black text-white">{report.totalScore}<span className="text-sm text-gray-600">/35</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Coach</p>
              <p className="text-sm font-bold text-white truncate px-2">{report.coachName}</p>
            </div>
          </div>
        </Card>

        {/* Right: Radar Chart (The "Gen-Z" Visual) */}
        <Card className="lg:col-span-2 bg-[#151515] border-white/5 p-4 rounded-[2rem] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ca1f3d] to-[#ffbe00] opacity-50"></div>
          <div className="flex justify-between items-center px-4 pt-2 mb-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#ffbe00]" /> PERFORMANCE RADAR
            </h3>
            <span className="text-xs text-gray-500 font-mono">{report.date}</span>
          </div>

          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar
                  name="Skill"
                  dataKey="A"
                  stroke="#ca1f3d"
                  strokeWidth={3}
                  fill="#ca1f3d"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 2. DETAILED STATS (Grid Cards) */}
      <h3 className="text-xl font-black text-white uppercase flex items-center gap-2 mt-8">
        <Zap className="w-6 h-6 text-[#ffbe00]" /> Skill Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'biomechanics', label: "BIOMECHANICS", val: report.scores.biomechanics, icon: <User className="w-4 h-4" />, desc: "Grip & Wrist" },
          { id: 'footwork', label: "FOOTWORK", val: report.scores.footwork, icon: <Activity className="w-4 h-4" />, desc: "Speed & Agility" },
          { id: 'strokeQuality', label: "STROKES", val: report.scores.strokeQuality, icon: <Target className="w-4 h-4" />, desc: "Backhand & Overhead" },
          { id: 'offense', label: "ATTACK", val: report.scores.offense, icon: <Zap className="w-4 h-4" />, desc: "Smash Power" },
          { id: 'defense', label: "DEFENSE", val: report.scores.defense, icon: <Shield className="w-4 h-4" />, desc: "Reflexes" },
          { id: 'gameIQ', label: "TACTICS", val: report.scores.gameIQ, icon: <BrainCircuit className="w-4 h-4" />, desc: "Game Reading" },
          { id: 'physique', label: "PHYSIQUE", val: report.scores.physique, icon: <Activity className="w-4 h-4" />, desc: "Endurance & Mental" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#1A1A1A] border-white/5 p-5 rounded-2xl hover:border-[#ffbe00]/30 transition-colors group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-[#222] rounded-lg text-gray-400 group-hover:text-white transition-colors">{stat.icon}</div>
                <span className={`text-2xl font-black ${getScoreColor(stat.val)}`}>{stat.val}</span>
              </div>
              <h4 className="font-bold text-white text-sm tracking-wider">{stat.label}</h4>
              <p className="text-xs text-gray-500 mb-3">{stat.desc}</p>
              <Progress value={(stat.val / 5) * 100} className="h-1.5 bg-black mb-4" indicatorClassName={stat.val >= 4 ? "bg-[#ffbe00]" : "bg-[#ca1f3d]"} />
            </div>

            {/* AI Micro-Analysis */}
            <div className="mt-2 text-[10px] leading-relaxed text-gray-400 border-t border-white/5 pt-2">
              <span className="text-[#00F2EA] font-bold">ANALISIS: </span>
              {report.skillAnalysis?.[stat.id] || "No analysis available."}
            </div>
          </Card>
        ))}
      </div>

      {/* 3. COACH FEEDBACK */}
      {/* 3. COACH FEEDBACK & HEAD COACH SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#151515] to-[#1A1A1A] border-white/5 p-8 rounded-[2rem] relative overflow-hidden">
          <Quote className="absolute top-6 left-6 w-12 h-12 text-white/5 -scale-x-100" />
          <div className="relative z-10 pl-8 border-l-2 border-[#ca1f3d]">
            <h3 className="text-lg font-bold text-[#ffbe00] mb-2 uppercase tracking-widest text-xs">Coach Note</h3>
            <p className="text-lg text-white font-medium italic leading-relaxed">
              "{report.notes || 'Good effort! Keep practicing.'}"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px bg-white/10 w-12"></div>
              <span className="text-sm text-gray-500 font-bold uppercase">{report.coachName}</span>
            </div>
          </div>
        </Card>

        {/* HEAD COACH SUMMARY CARD */}
        <Card className="bg-[#151515] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> HEAD COACH SUMMARY
            </h3>
            <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {report.aiFeedback ? (
                report.aiFeedback
              ) : (
                <p className="italic text-gray-500">Analisis belum tersedia untuk sesi ini.</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
