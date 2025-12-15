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
        <HeroSection />
        
        <div id="services">
            <FeaturesSection />
        </div>
        
        <div id="schedule">
            <EventsSection />
        </div>
        
        <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="container px-4 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Udah Siap Cari Keringat?</h2>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-primary-foreground/90 font-medium">
                    Jangan cuma scrolling, ayo turun ke lapangan! Jadi member sekarang buat dapat harga mabar spesial, track statistik menang-kalah kamu, dan cari lawan sepadan.
                </p>
                 <a href="/login" className="inline-block bg-accent text-accent-foreground px-10 py-5 rounded-full text-xl font-bold hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,190,0,0.6)] transition-all shadow-xl">
                    Join Member (Gratis)
                </a>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
