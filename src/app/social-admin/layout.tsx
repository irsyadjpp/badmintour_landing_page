'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SocialAdminSidebar from "@/components/layout/social-admin-sidebar";

export default function SocialAdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffbe00]" />
      </div>
    );
  }

  // Allow 'social_admin', 'admin', or 'superadmin' to access this area
  const allowedRoles = ['active_admin', 'admin', 'superadmin', 'social_admin'];
  // Check if session exists and role is allowed. 
  // Note: 'active_admin' might be a typo in your system, double check role names.
  // Assuming standard roles: 'admin', 'superadmin', 'social_admin'.

  if (!session || !['admin', 'superadmin', 'social_admin'].includes(session.user.role)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white font-sans flex flex-col antialiased selection:bg-[#ffbe00] selection:text-black overflow-x-hidden">

      <SocialAdminSidebar />

      {/* Background Ambience (Red/Gold for Social) */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ca1f3d]/5 via-transparent to-transparent pointer-events-none z-0"></div>

      <main className="flex-1 w-full pl-6 md:pl-28 pr-6 py-8 relative z-10">
        <div className="max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
