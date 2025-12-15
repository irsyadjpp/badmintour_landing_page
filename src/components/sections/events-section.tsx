import EventCard from '@/components/event-card';

const events = [
  {
    id: 1,
    title: 'Weekend Smash Fest',
    date: 'Sat, Aug 24',
    time: '10:00 AM - 1:00 PM',
    location: 'Central Badminton Arena',
    slotsFilled: 12,
    totalSlots: 16,
  },
  {
    id: 2,
    title: 'Beginner\'s Clinic',
    date: 'Sun, Aug 25',
    time: '2:00 PM - 4:00 PM',
    location: 'Northside Sports Hall',
    slotsFilled: 5,
    totalSlots: 10,
  },
  {
    id: 3,
    title: 'Advanced Sparring Session',
    date: 'Tue, Aug 27',
    time: '7:00 PM - 9:00 PM',
    location: 'Eastwood Badminton Club',
    slotsFilled: 7,
    totalSlots: 8,
  },
];

export default function EventsSection() {
  return (
    <section id="events" className="w-full bg-card py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Upcoming Events
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Don't miss out! Join an event and start playing.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
