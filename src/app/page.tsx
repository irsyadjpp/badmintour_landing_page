import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import EventsSection from '@/components/sections/events-section';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Header />
      <main className="flex-1">
        <div id="hero">
          <HeroSection />
        </div>
        
        <div id="services">
            <FeaturesSection />
        </div>
        
        <div id="schedule">
            <EventsSection />
        </div>
        
      </main>
      <Footer />
    </div>
  );
}
