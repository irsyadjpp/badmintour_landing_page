import { MapPin, Clock, ArrowRight, Trophy, Repeat, CalendarDays, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock Data: Mendukung Recurring (Rutin) & One-Time Event
const events = [
  {
    id: 1,
    title: 'Mabar Rutin: Monday Mayhem',
    isRecurring: true,      // Menandakan ini jadwal berulang
    recurrenceDay: 'SENIN', // Hari berulang
    time: '19:00 - 23:00 WIB',
    location: 'GOR Wartawan Bandung',
    level: 'Intermediate - Advance',
    quota: 'Sisa 4 Slot',
    price: 'Rp 35.000',
    tags: ['🔥 High Intensity', '🏸 Game Point 30'],
    isHot: true,
    buttonText: 'Amankan Slot'
  },
  {
    id: 2,
    title: 'Drilling Class: Basic Stroke',
    isRecurring: false,     // Event sekali jalan
    date: '26',
    month: 'AUG',
    time: '16:00 - 18:00 WIB',
    location: 'GOR Bulutangkis Garandiri',
    level: 'Newbie - Beginner',
    quota: 'Open Registration',
    price: 'Rp 50.000',
    tags: ['🎓 Coach Budi', '👟 Footwork Drill'],
    isHot: false,
    buttonText: 'Daftar Kelas'
  },
  {
    id: 3,
    title: 'Sparring Night: PB Djarum vs Koni',
    isRecurring: false,
    date: '28',
    month: 'AUG',
    time: '20:00 - Selesai',
    location: 'GOR Wartawan Bandung',
    level: 'Pro / Atlet',
    quota: 'Spectator Only',
    price: 'Free Entry',
    tags: ['⚔️ Big Match', '🍿 Live Youtube'],
    isHot: true,
    buttonText: 'Tonton Live'
  },
  {
    id: 4,
    title: 'Sunday Morning Fun Game',
    isRecurring: true,
    recurrenceDay: 'MINGGU',
    time: '08:00 - 12:00 WIB',
    location: 'GOR Bulutangkis Garandiri',
    level: 'All Level (Happy)',
    quota: 'Full Booked',
    price: 'Rp 30.000',
    tags: ['😄 Fun Game', '🥐 Free Breakfast'],
    isHot: false,
    buttonText: 'Join Waitlist'
  },
];

export default function EventsSection() {
  return (
    <section id="schedule" className="w-full py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20"></div>

      <div className="container px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Schedule</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none">
                    Cari Lawan <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Tanding & Latihan</span>
                </h2>
                <p className="text-muted-foreground text-lg font-medium">
                    Gabung sesi mabar rutin atau ikuti event turnamen spesial. Level Newbie sampai Pro ada tempatnya di sini!
                </p>
            </div>
            <Button variant="outline" className="h-auto py-4 rounded-full px-8 border-2 font-bold hover:bg-accent hover:text-accent-foreground hover:border-accent group">
                Lihat Kalender Full <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>

        {/* Event Cards Grid */}
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="group relative">
                {/* Card Surface (MD3) */}
                <div className="relative flex flex-col lg:flex-row items-stretch bg-card border border-border rounded-[2.5rem] p-2 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden group-hover:bg-accent/5">
                    
                    {/* 1. Date/Recurring Box */}
                    <div className={`flex flex-col items-center justify-center p-6 rounded-[2rem] w-full lg:w-40 shrink-0 min-h-[140px] relative overflow-hidden ${event.isRecurring ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'bg-primary text-white'}`}>
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        
                        <div className="relative z-10 text-center">
                            {event.isRecurring ? (
                                <>
                                    <span className="text-[10px] font-black tracking-widest uppercase mb-1 flex justify-center items-center gap-1 opacity-80">
                                        <Repeat className="w-3 h-3" /> SETIAP
                                    </span>
                                    <span className="text-3xl font-black uppercase tracking-tight">{event.recurrenceDay}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-black tracking-widest uppercase mb-1 opacity-80">{event.month}</span>
                                    <span className="text-5xl font-black leading-none">{event.date}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 2. Main Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                        {/* Header: Tags & Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                             {event.isHot && (
                                 <Badge variant="destructive" className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                     <Flame className="w-3 h-3 mr-1" /> Hot
                                 </Badge>
                             )}
                             {event.tags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                                    {tag}
                                </span>
                             ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        
                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm font-bold text-muted-foreground">
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4 text-primary" />
                                {event.time}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                {event.location}
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Trophy className="w-4 h-4 text-primary" />
                                Level: <span className="text-foreground">{event.level}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center text-[8px] font-black text-primary">Rp</div>
                                {event.price}
                            </div>
                        </div>
                    </div>

                    {/* 3. Action Area */}
                    <div className="flex flex-col justify-center p-4 md:p-8 lg:border-l border-dashed border-border gap-3 min-w-[200px]">
                        <div className="text-center mb-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                            <p className={`text-lg font-black ${event.quota.includes('Full') ? 'text-destructive' : 'text-primary'}`}>
                                {event.quota}
                            </p>
                        </div>
                        <Button 
                            className={`w-full h-14 rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-95 ${event.quota.includes('Full') ? 'bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed' : 'bg-foreground text-background hover:bg-primary hover:text-white'}`}
                            disabled={event.quota.includes('Full')}
                        >
                            {event.buttonText}
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
