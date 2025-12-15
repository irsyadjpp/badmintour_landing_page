import { MapPin, Calendar, Clock, ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const events = [
  {
    id: 1,
    category: "FUN MATCH",
    title: 'Weekend Smash Fest',
    date: '24',
    month: 'AUG',
    time: '10:00 - 13:00',
    location: 'Central Badminton Arena',
    status: 'Sisa 4 Slot',
    isHot: true,
  },
  {
    id: 2,
    category: "COACHING",
    title: 'Beginner\'s Clinic',
    date: '25',
    month: 'AUG',
    time: '14:00 - 16:00',
    location: 'Northside Sports Hall',
    status: 'Open',
    isHot: false,
  },
  {
    id: 3,
    category: "SPARRING",
    title: 'Advanced Night Session',
    date: '27',
    month: 'AUG',
    time: '19:00 - 21:00',
    location: 'Eastwood Badminton Club',
    status: 'Full Booked',
    isHot: false,
  },
];

export default function EventsSection() {
  return (
    <section id="schedule" className="w-full py-24 bg-background relative">
      <div className="container px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
                    Jadwal Main
                </h2>
                <p className="text-muted-foreground text-lg">Pilih jadwal, daftar, dan langsung main.</p>
            </div>
            <Button variant="outline" className="rounded-full px-6 border-2 font-bold hover:bg-accent hover:text-accent-foreground hover:border-accent">
                Lihat Semua Jadwal
            </Button>
        </div>

        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="group relative">
                {/* Card Container (MD3 Surface Container) */}
                <div className="relative flex flex-col md:flex-row items-stretch bg-white dark:bg-zinc-900 border border-border rounded-[2rem] p-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                    
                    {/* Date Block */}
                    <div className={`flex flex-col items-center justify-center p-6 rounded-[1.5rem] w-full md:w-32 shrink-0 ${event.isHot ? 'bg-primary text-white' : 'bg-secondary text-foreground'}`}>
                        <span className="text-sm font-bold tracking-widest uppercase">{event.month}</span>
                        <span className="text-4xl font-black leading-none">{event.date}</span>
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${event.isHot ? 'bg-accent/20 text-orange-700 border-accent' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                                {event.category}
                             </span>
                             {event.isHot && (
                                 <span className="flex items-center text-xs font-bold text-primary animate-pulse">
                                     <Trophy className="w-3 h-3 mr-1" /> POPULAR
                                 </span>
                             )}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {event.time}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center justify-end p-4 md:p-6 md:border-l border-dashed border-border">
                        <Button 
                            className={`w-full md:w-auto h-12 rounded-full px-8 text-base font-bold ${event.status === 'Full Booked' ? 'bg-muted text-muted-foreground hover:bg-muted' : 'bg-black text-white hover:bg-primary'}`}
                            disabled={event.status === 'Full Booked'}
                        >
                            {event.status === 'Full Booked' ? 'Penuh' : 'Book Slot'}
                            {event.status !== 'Full Booked' && <ArrowRight className="ml-2 w-4 h-4" />}
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
