import { MapPin, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    slotsFilled: number;
    totalSlots: number;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const percentage = (event.slotsFilled / event.totalSlots) * 100;
  const isFull = event.slotsFilled >= event.totalSlots;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-2xl hover:-translate-y-1">
      {/* Decorative Top Color Bar */}
      <div className="h-3 w-full bg-gradient-to-r from-primary to-accent" />
      
      <div className="flex flex-1 flex-col p-6 gap-4">
        <div className="flex justify-between items-start">
            <Badge variant={isFull ? "destructive" : "secondary"} className="rounded-md px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {isFull ? 'Full Booked' : 'Available'}
            </Badge>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">ID: #{event.id}</span>
        </div>
        
        <div>
          <h3 className="text-xl font-black leading-tight text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            {event.location}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 py-4 border-y border-dashed border-border">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Calendar className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Date</p>
                    <p className="text-sm font-bold">{event.date}</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg text-accent-foreground">
                    <Clock className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Time</p>
                    <p className="text-sm font-bold">{event.time}</p>
                </div>
             </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
                <User className="h-3 w-3" /> Players
            </span>
            <span className="font-bold text-foreground">
              {event.slotsFilled} <span className="text-muted-foreground">/ {event.totalSlots}</span>
            </span>
          </div>
          <Progress value={percentage} className="h-3 rounded-full bg-secondary" indicatorClassName={isFull ? 'bg-destructive' : 'bg-primary'} />
        </div>

        <Button 
            className="mt-2 w-full rounded-full font-bold shadow-lg" 
            variant={isFull ? "outline" : "default"}
            disabled={isFull}
        >
            {isFull ? "Join Waiting List" : "Book Slot"}
        </Button>
      </div>
    </div>
  );
}
