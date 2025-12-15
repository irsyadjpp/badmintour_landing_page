import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import EventsSection from '@/components/sections/events-section';
import CommunitySection from '@/components/sections/community-section';
import Footer from '@/components/layout/footer';
import BookingWidget from '@/components/mabar/booking-widget';
import MatchGenerator from '@/components/mabar/match-generator';
import GamificationCard from '@/components/mabar/gamification-card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <EventsSection />
        
        <section className="container py-12 space-y-12">
          <div>
            <h2 className="text-3xl font-black mb-8 text-center">Demo: Mabar Registration</h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
                <BookingWidget 
                  price={35000} 
                  minLevel="Intermediate" 
                  userLevel="Intermediate" 
                  totalSlots={12} 
                  currentParticipants={10} 
                  waitlistCount={0}
                />
                {/* Contoh jika user levelnya kurang */}
                <BookingWidget 
                  price={35000} 
                  minLevel="Advance" 
                  userLevel="Intermediate" 
                  totalSlots={12} 
                  currentParticipants={5} 
                  waitlistCount={0}
                />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black mb-8 text-center">Demo: Admin Match Generator</h2>
            <div className="flex justify-center">
              <MatchGenerator />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-black mb-8 text-center">Demo: Gamification</h2>
            <div className="flex justify-center">
                <div className="max-w-md">
                    <GamificationCard />
                </div>
            </div>
          </div>
        </section>

        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
