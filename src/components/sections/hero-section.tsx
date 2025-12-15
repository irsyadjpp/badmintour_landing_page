import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-player');

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="container px-4">
          <h1 className="font-headline text-5xl font-black uppercase md:text-7xl lg:text-8xl">
            Level Up Your Game
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
            Join the most vibrant badminton community. Find games, sparring partners, and professional coaches.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="h-14 rounded-full bg-accent px-10 text-lg font-bold text-accent-foreground transition hover:bg-accent/90 hover:scale-105"
            >
              Join a Game
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
