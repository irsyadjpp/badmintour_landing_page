
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface AssessmentReport {
  scores: {
    biomechanics: number;
    footwork: number;
    strokeQuality: number;
    defense: number;
    offense: number;
    gameIQ: number;
    physique?: number;
    [key: string]: number | undefined;
  };
}

export function AssessmentRadarPDF({ report, id }: { report: AssessmentReport; id: string }) {
  const radarData = [
    { subject: 'Teknik', A: report.scores.biomechanics || 0, fullMark: 5 },
    { subject: 'Footwork', A: report.scores.footwork || 0, fullMark: 5 },
    { subject: 'Akurasi', A: report.scores.strokeQuality || 0, fullMark: 5 },
    { subject: 'Attack', A: report.scores.offense || 0, fullMark: 5 },
    { subject: 'Defense', A: report.scores.defense || 0, fullMark: 5 },
    { subject: 'Taktik', A: report.scores.gameIQ || 0, fullMark: 5 },
  ];

  return (
    <div
      id={id}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '600px',
        height: '400px',
        backgroundColor: '#ffffff', // White background
        padding: '20px',
        zIndex: -50
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            {/* Light Mode Colors */}
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#374151', fontSize: 14, fontWeight: 'bold' }} // Dark Gray Text
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Skill"
              dataKey="A"
              stroke="#ca1f3d" // Red Stroke
              strokeWidth={3}
              fill="#ca1f3d"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
