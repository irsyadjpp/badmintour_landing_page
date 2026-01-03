import { AssessmentReport } from "@/components/admin/admin-report-view";
import { ShieldCheck } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface StoryCardProps {
  report: AssessmentReport;
  userName?: string;
}

export function StoryCard({ report, userName = "Athlete" }: StoryCardProps) {
  // Transform scores for Radar Chart
  const radarData = Object.entries(report.scores).map(([subject, A]) => ({
    subject,
    A,
    fullMark: 100,
  }));

  return (
    <div
      id="story-capture-area"
      className="w-[360px] h-[640px] bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-between py-10 px-6 text-center"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
      }}
    >
      {/* Background Accents (Subtler) */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ca1f3d]/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffbe00]/5 rounded-full blur-[60px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 w-full flex flex-col items-center mt-8">
        <div className="flex items-center gap-2 mb-2 opacity-80">
          <ShieldCheck className="w-6 h-6 text-[#ffbe00]" />
          <span className="text-sm font-bold text-white tracking-[0.2em] uppercase">BadminTour Official</span>
        </div>
        <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mt-2">
          <p className="text-xs font-mono text-gray-300 uppercase">{report.date} • {report.moduleTitle}</p>
        </div>
      </div>

      {/* RADAR CHART CENTERPIECE */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center -my-8">
        <div className="w-[340px] h-[340px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#888', fontSize: 11, fontWeight: 'bold' }}
              />
              {/* Hidden Radius Axis for Scale Consistency */}
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Athlete"
                dataKey="A"
                stroke="#ca1f3d"
                strokeWidth={3}
                fill="#ca1f3d"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Center Score Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-white drop-shadow-2xl">{report.totalScore}</span>
            <span className="text-[10px] font-bold text-[#ffbe00] bg-black/50 px-2 py-0.5 rounded-full uppercase border border-[#ffbe00]/20">{report.level}</span>
          </div>
        </div>
      </div>

      {/* Skills List (Compact) */}
      <div className="relative z-10 w-full space-y-2 mb-4">
        {Object.entries(report.scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([key, value]) => (
            <div key={key} className="flex items-center justify-between w-full bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="text-white text-xs font-bold uppercase tracking-wider truncate">{key}</span>
              <span className="text-[#ffbe00] font-mono font-bold text-xs">{value}</span>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full pt-4 border-t border-white/10 flex flex-col items-center">
        <p className="text-gray-500 text-[10px] mb-2 uppercase tracking-wide">Powered by</p>
        <img
          src="/images/logo-light.png"
          alt="BadminTour Logo"
          className="h-6 object-contain opacity-80"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
}
