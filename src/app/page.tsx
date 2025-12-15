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
        {/* ID 'services' digunakan untuk navigasi scroll */}
        <div id="services">
            <FeaturesSection />
        </div>
        {/* ID 'schedule' digunakan untuk navigasi scroll */}
        <div id="schedule">
            <EventsSection />
        </div>
        
        {/* CTA Section Pengganti Community Section yang lebih 'To The Point' */}
        <section className="py-24 bg-primary text-primary-foreground text-center">
            <div className="container px-4">
                <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase">Siap Masuk Lapangan?</h2>
                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary-foreground/90 font-medium">
                    Jangan cuma jadi penonton. Daftar member sekarang, dapatkan harga khusus member, lacak statistik permainanmu, dan temukan lawan sepadan.
                </p>
                 {/* Link ke Login/Register */}
                 <a href="/login" className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl">
                    Gabung Komunitas (Gratis)
                </a>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
