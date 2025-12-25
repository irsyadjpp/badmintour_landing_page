import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google Provider (Login Member/Host)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // 2. PIN Provider (Login Superadmin Darurat)
    CredentialsProvider({
      name: "PIN",
      credentials: {
        pin: { label: "PIN", type: "password" }
      },
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
          // Referensi ke dokumen user di Firestore
          const userRef = db.collection("users").doc(user.id);
          const doc = await userRef.get();

          if (!doc.exists) {
            // Jika user belum ada, buat data baru dengan role 'member'
            await userRef.set({
              uid: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: "member", // Default role
              createdAt: new Date().toISOString(),
              status: "active"
            });
            console.log(`[AUTH] New user created: ${user.email}`);
          }
          return true;
        } catch (error) {
          console.error("[AUTH] Error saving to Firestore:", error);
          return false; // Tolak login jika database error
        }
      }
      return true; // Allow PIN login
    },

    // B. Membuat Token JWT
    async jwt({ token, user }) {
      // 1. Initial Sign In
      if (user) {
        token.id = user.id;
        // Jika login PIN, role sudah ada di object user
        if (user.role === 'superadmin') {
            token.role = 'superadmin';
        }
      }

      // 2. Fetch Role Terbaru dari Firestore (PENTING)
      // Ini memastikan role user selalu sinkron dengan database
      if (!token.role || token.role !== 'superadmin') { 
         try {
            const uid = token.sub || token.id; 
            if(uid) {
                const userDoc = await db.collection("users").doc(uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    token.role = userData?.role || "member";
                }
            }
         } catch (error) {
             console.error("[AUTH] Error fetching role:", error);
         }
      }

      return token;
    },

    // C. Meneruskan data ke Session (Client Side)
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
