import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "PIN",
      credentials: { pin: { label: "PIN", type: "password" } },
      async authorize(credentials) {
        if (credentials?.pin === "113125") {
          return {
            id: "superadmin-master",
            name: "Superadmin",
            email: "superadmin@badmintour.com",
            image: "https://ui-avatars.com/api/?name=Super+Admin&background=ffbe00&color=000",
            role: "superadmin" 
          };
        }
        return null; 
      }
    })
  ],
  callbacks: {
    // A. Saat User Sign In (Google)
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const userRef = db.collection("users").doc(user.id);
          const doc = await userRef.get();

          if (!doc.exists) {
            // User BARU: Buat data & set status active
            await userRef.set({
              uid: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: "member",
              status: "active", // Default active
              createdAt: new Date().toISOString(),
            });
          } else {
            // User LAMA: Cek Status
            const userData = doc.data();
            
            // LOGIC UTAMA: Jika status tidak active, tolak login
            if (userData?.status && userData.status !== 'active') {
                // Return URL khusus untuk redirect ke halaman error/aktivasi
                // NextAuth akan melempar user ke URL ini
                return `/login?error=AccountInactive`; 
            }
          }
          return true;
        } catch (error) {
          console.error("Auth Error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Update session real-time jika ada perubahan di client
      if (trigger === "update" && session?.name) {
          token.name = session.name;
      }

      if (user) {
        token.id = user.id;
        if (user.role) token.role = user.role;
      }

      // Fetch Role & Status Terbaru
      if (!token.role || !token.status) { 
         try {
            const uid = token.sub || token.id; 
            if(uid) {
                const userDoc = await db.collection("users").doc(uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    token.role = userData?.role || "member";
                    token.status = userData?.status || "active";
                    
                    // Force logout via token jika status berubah jadi inactive di tengah jalan
                    if(token.status !== 'active') {
                        // Tidak bisa force logout direct disini, tapi bisa kita handle di middleware atau client
                    }
                }
            }
         } catch (error) {
             console.error("JWT Error:", error);
         }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Tambahkan status ke session agar bisa dibaca client
        (session.user as any).status = token.status; 
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect error kembali ke login page untuk kita handle custom
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
