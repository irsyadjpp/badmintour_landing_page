import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Award, Swords, Users } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    id: 'mabar',
    title: 'Mabar (Social Play)',
    description: 'Find and join casual games. Meet new players, have fun, and enjoy a friendly match. Perfect for all skill levels.',
    icon: <Users className="h-8 w-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'feature-mabar'),
    className: 'md:col-span-2',
  },
  {
    id: 'sparring',
    title: 'Sparring (Competitive)',
    description: 'Challenge yourself against skilled opponents. Improve your strategy and climb the ranks in competitive matches.',
    icon: <Swords className="h-8 w-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'feature-sparring'),
    className: 'md:col-span-1',
  },
  {
    id: 'coaching',
    title: 'Coaching (Training)',
    description: 'Get professional training from certified coaches. Personalized sessions to improve your technique and fitness.',
    icon: <Award className="h-8 w-8 text-primary" />,
    image: PlaceHolderImages.find((img) => img.id === 'feature-coaching'),
    className: 'md:col-span-1',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            What We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to enjoy badminton, from casual play to professional coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className={`overflow-hidden rounded-2xl border-2 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.className}`}
            >
              <CardHeader className="flex-row items-start gap-4 p-6">
                {feature.icon}
                <div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="mt-1 text-base">{feature.description}</CardDescription>
                </div>
              </CardHeader>
              {feature.image && (
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      data-ai-hint={feature.image.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
