import { AssessmentReport } from "@/components/admin/admin-report-view";
import { Trophy, Star, TrendingUp, ShieldCheck } from "lucide-react";

interface StoryCardProps {
  report: AssessmentReport;
  userName?: string;
}

export function StoryCard({ report, userName = "Athlete" }: StoryCardProps) {
  return (
    <div
      id="story-capture-area"
      className="w-[360px] h-[640px] bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-between py-12 px-8 text-center"
      style={{
        // Force specific rendering for html2canvas
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
      }}
    >
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ca1f3d]/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffbe00]/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2 opacity-50">
          <ShieldCheck className="w-5 h-5 text-[#ffbe00]" />
          <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">BadminTour Official</span>
        </div>
        <h1 className="text-4xl font-black text-white italic leading-none tracking-tighter uppercase mb-4">
          TRAINING<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d]">COMPLETE</span>
        </h1>

        <div className="px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
          <p className="text-xs font-mono text-gray-300 uppercase">{report.date} • {report.moduleTitle}</p>
        </div>
      </div>

      {/* Main Stats - Big Circle */}
      <div className="relative z-10 my-4">
        <div className="w-48 h-48 rounded-full border-4 border-[#ffbe00]/20 flex flex-col items-center justify-center bg-[#151515] relative">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#ffbe00] border-r-[#ca1f3d] border-b-transparent border-l-transparent rotate-45"></div>

          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Score</span>
          <span className="text-6xl font-black text-white tracking-tighter">{report.totalScore}</span>
          <div className="flex items-center gap-1 mt-2 text-[#ffbe00]">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">{report.level}</span>
          </div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="relative z-10 w-full space-y-3">
        {/* Take Top 3 Skills */}
        {Object.entries(report.scores)
          .sort(([, a], [, b]) => b - a) // Sort High to Low
          .slice(0, 3)
          .map(([key, value], idx) => (
            <div key={key} className="flex items-center justify-between w-full">
              <span className="text-white text-sm font-bold uppercase tracking-wider text-left w-1/2 truncate">{key}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full mx-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffbe00] to-[#ca1f3d]"
                  style={{ width: `${(value / 100) * 100}%` }}
                ></div>
              </div>
              <span className="text-white font-mono font-bold w-8 text-right">{value}</span>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full pt-8 border-t border-white/10 flex flex-col items-center">
        <p className="text-gray-400 text-xs mb-2">Developed by</p>
        <img
          src="/images/logo-light.png"
          alt="BadminTour Logo"
          className="h-8 object-contain opacity-80"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
}
