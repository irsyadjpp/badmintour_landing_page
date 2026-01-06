'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageNext from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  LayoutDashboard,
  Image,
  PartyPopper,
  Megaphone,
  LogOut,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import RoleSwitcher from './role-switcher';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/social-admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Moments',
    href: '/social-admin/moments',
    icon: Image
  },
  {
    title: 'Story Generator',
    href: '/social-admin/story-generator',
    icon: PartyPopper
  },
  {
    title: 'Announcements',
    href: '/social-admin/announcements',
    icon: Megaphone
  }
];

export default function SocialAdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [profile, setProfile] = useState({
    name: '',
    image: '',
    role: 'Social Admin'
  });

  useEffect(() => {
    if (session?.user?.id) {
      const unsub = onSnapshot(doc(db, "users", session.user.id), (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setProfile({
            name: data.name || session.user?.name || 'Admin',
            image: data.image || data.photoURL || session.user?.image || '',
            role: 'Social Admin'
          });
        }
      });
      return () => unsub();
    }
  }, [session]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <aside className="fixed top-4 bottom-4 left-4 z-50 w-20 flex flex-col items-center py-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-2xl text-white transition-all duration-300 hover:bg-black/30 hover:border-white/20">

        <div className="p-3 mb-6 rounded-2xl bg-[#ca1f3d]/80 text-white shadow-[0_0_15px_rgba(202,31,61,0.5)] flex items-center justify-center">
          <ImageNext src="/images/logo-light.png" alt="Badmintour Logo" width={24} height={24} className="w-6 h-6 object-contain" />
        </div>

        <nav className="flex-1 flex flex-col gap-4 w-full items-center justify-center">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} title={item.title}>
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative group",
                  isActive
                    ? "bg-[#ffbe00] text-black shadow-[0_0_20px_rgba(255,190,0,0.4)] scale-110"
                    : "text-white/40 hover:bg-white/10 hover:text-white hover:scale-105"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5",
                    isActive && "fill-current"
                  )} />
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-transparent w-full mt-auto space-y-2">
          <Button
            variant="ghost"
            title="Sign Out"
            className="w-full h-12 justify-center text-red-500 hover:text-white hover:bg-[#ca1f3d] transition-all duration-300 gap-3 rounded-2xl font-bold group text-xs"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      </aside>

      {/* FLOATING ROLE SWITCHER (TOP RIGHT) */}
      <div className="fixed top-8 right-6 z-50">
        <RoleSwitcher />
      </div>
    </>
  );
}
