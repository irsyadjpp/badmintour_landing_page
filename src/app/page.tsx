import Header from '@/components/layout/header';
import HeroSection from '@/components/sections/hero-section';
import FeaturesSection from '@/components/sections/features-section';
import EventsSection from '@/components/sections/events-section';
import CommunitySection from '@/components/sections/community-section';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <EventsSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
}
