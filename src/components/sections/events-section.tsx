import { MapPin, Clock, ArrowRight, Zap, CalendarDays, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock Data: Fokus pada "Jadwal Terdekat" (Real-time feel)
const upcomingSessions = [
  {
    id: 1,
    timeLabel: "HARI INI",
    date: "24 Aug",
    title: 'Mabar Malam: Competitive',
    time: '19:00 - 23:00 WIB',
    location: 'GOR KONI Bandung',
    level: 'Intermediate B++',
    slots: { total: 12, filled: 10 }, // Sisa 2
    price: 'Rp 40.000',
    tags: ['🔥 Hot Session', '⚡ Fast Game'],
    isHot: true,
    status: 'Sisa 2 Slot',
    btnText: 'Book Fast'
  },
  {
    id: 2,
    timeLabel: "BESOK PAGI",
    date: "25 Aug",
    title: 'Drilling: Smash & Defense',
    time: '08:00 - 10:00 WIB',
    location: 'GOR C-Tra Arena',
    level: 'Beginner - Intermediate',
    slots: { total: 8, filled: 3 },
    price: 'Rp 60.000',
    tags: ['🎓 Coach Pro', '🏸 Shuttlecock Inc.'],
    isHot: false,
    status: 'Available',
    btnText: 'Amankan Slot'
  },
  {
    id: 3,
    timeLabel: "BESOK MALAM",
    date: "25 Aug",
    title: 'Fun Game: Santai Sore',
    time: '18:00 - 21:00 WIB',
    location: 'GOR Lodaya',
    level: 'Newbie Welcome',
    slots: { total: 20, filled: 20 },
    price: 'Rp 30.000',
    tags: ['😄 Fun & Sweat', '🍿 Free Snack'],
    isHot: false,
    status: 'Full Booked',
    btnText: 'Join Waitlist'
  },
];

export default function EventsSection() {
  return (
    <section id="schedule" className="w-full py-20 bg-zinc-50 dark:bg-black/50 relative overflow-hidden">
      
      <div className="container px-4 md:px-6 relative z-10">
        
        {/* Header Section: Quick Action */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest uppercase text-red-500">Live Booking</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-3 leading-none">
                    Jadwal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Terdekat</span>
                </h2>
                <p className="text-muted-foreground text-lg font-medium">
                    Jangan sampai kehabisan slot! Pilih sesi yang available hari ini & besok.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="rounded-full h-12 px-6 font-bold border-2 hover:bg-zinc-100">
                    Filter Level
                </Button>
                <Button className="rounded-full h-12 px-6 font-bold bg-black text-white hover:bg-primary shadow-lg">
                    Lihat Semua Jadwal <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>

        {/* Cards Grid: Vertical Stack for Fast Scanning */}
        <div className="flex flex-col gap-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="group relative">
                
                {/* Card Container */}
                <div className="relative flex flex-col md:flex-row items-center bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-3 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    
                    {/* 1. Time Indicator (Left) */}
                    <div className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] w-full md:w-36 shrink-0 md:h-32 relative overflow-hidden ${session.isHot ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                        {session.isHot && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>}
                        <span className="text-[10px] font-black tracking-widest uppercase mb-1">{session.timeLabel}</span>
                        <span className="text-2xl font-black leading-none">{session.date}</span>
                        <div className="mt-2 px-2 py-1 bg-black/10 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {session.time.split(' ')[0]}
                        </div>
                    </div>

                    {/* 2. Main Info (Center) */}
                    <div className="flex-1 p-6 flex flex-col justify-center w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                             {session.isHot && (
                                 <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                     <Zap className="w-3 h-3 mr-1" /> Selling Fast
                                 </Badge>
                             )}
                             {session.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                    {tag}
                                </span>
                             ))}
                        </div>

                        <h3 className="text-2xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">
                            {session.title}
                        </h3>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                {session.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                {session.level}
                            </div>
                        </div>
                    </div>

                    {/* 3. Slot & Action (Right) */}
                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto p-4 md:p-6 md:border-l border-dashed border-border gap-4 min-w-[180px]">
                        
                        <div className="w-full">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                                <span>{session.status}</span>
                                <span>{session.slots.filled}/{session.slots.total}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${session.status === 'Full Booked' ? 'bg-zinc-400' : 'bg-primary'}`} 
                                    style={{ width: `${(session.slots.filled / session.slots.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <Button 
                            className={`w-full h-12 rounded-xl font-bold shadow-md transition-all active:scale-95 flex justify-between px-4 ${session.status === 'Full Booked' ? 'bg-zinc-200 text-zinc-400 hover:bg-zinc-200 cursor-not-allowed' : 'bg-black text-white hover:bg-primary'}`}
                            disabled={session.status === 'Full Booked'}
                        >
                            <span>{session.btnText}</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">{session.price}</span>
                        </Button>
                    </div>

                </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
