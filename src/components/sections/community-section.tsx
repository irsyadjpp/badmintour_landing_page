import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CommunitySection() {
  const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar-'));

  return (
    <section id="community" className="w-full py-16 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Join Our Growing Community
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Connect with over 500+ passionate badminton players in your area.
        </p>

        <div className="mt-8 flex justify-center -space-x-4">
          {avatars.map((avatar, index) => (
            <Avatar key={avatar.id} className="h-16 w-16 border-4 border-background">
              <AvatarImage 
                src={avatar.imageUrl} 
                alt={`Community member ${index + 1}`} 
                data-ai-hint={avatar.imageHint}
              />
              <AvatarFallback>BT</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <div className="mt-10">
          <Button
            size="lg"
            className="h-14 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground transition hover:bg-primary/90 hover:scale-105"
          >
            Become a Member
          </Button>
        </div>
      </div>
    </section>
  );
}
