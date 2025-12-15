import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin } from 'lucide-react';

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  slotsFilled: number;
  totalSlots: number;
};

export default function EventCard({ event }: { event: Event }) {
  const progressValue = (event.slotsFilled / event.totalSlots) * 100;
  const slotsRemaining = event.totalSlots - event.slotsFilled;

  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-5 w-5" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Slots filled</span>
            <span>{slotsRemaining} remaining</span>
          </div>
          <Progress value={progressValue} aria-label={`${event.slotsFilled} of ${event.totalSlots} slots filled`} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={slotsRemaining === 0} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          {slotsRemaining > 0 ? 'Register Now' : 'Fully Booked'}
        </Button>
      </CardFooter>
    </Card>
  );
}
