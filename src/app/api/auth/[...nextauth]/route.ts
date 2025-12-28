import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";

// --- HELPER FUNCTIONS ---

// 1. Generate 6 Digit PIN (Semua angka berbeda)
function generateDistinctPin(): string {
  // Pool angka 0-9
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Fisher-Yates Shuffle (Mengacak posisi array)
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  
  // Ambil 6 angka pertama dan gabungkan jadi string
  return digits.slice(0, 6).join('');
}

// 2. Extract Nickname dari Nama
function extractNickname(fullName: string): string {
  // Regex untuk mencari teks di dalam kurung (...)
  const match = fullName.match(/\(([^)]+)\)/);
  
  if (match && match[1]) {
    // Jika ada kurung, ambil isinya (misal: "Irsyad (Chad)" -> "Chad")
    return match[1].trim(); 
  } else {
    // Jika tidak ada kurung, ambil kata pertama (misal: "Irsyad Jpp" -> "Irsyad")
    return fullName.split(' ')[0];
  }
}

// --- CONFIGURATION ---

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
        const inputPin = credentials?.pin;

        // A. CEK SUPERADMIN HARDCODED (Untuk Dev/Emergency)
        if (inputPin === "113125") {
          return {
            id: "superadmin-master",
            name: "Superadmin",
            email: "superadmin@badmintour.com",
            image: "https://ui-avatars.com/api/?name=Super+Admin&background=ffbe00&color=000",
            role: "superadmin",
            status: "active"
          };
        }

        // B. CEK USER DI DATABASE BERDASARKAN PIN
        if (inputPin) {
          try {
            // Query ke Firestore mencari user dengan PIN tersebut
            const snapshot = await db.collection("users").where("pin", "==", inputPin).limit(1).get();

            if (!snapshot.empty) {
              const userDoc = snapshot.docs[0];
              const userData = userDoc.data();

              // Cek status akun
              if (userData.status !== 'active') {
                throw new Error("AccountInactive");
              }

              // Return object user untuk session
              return {
                id: userDoc.id,
                name: userData.name, // Full Name
                nickname: userData.nickname, // Pastikan ini dikirim
                email: userData.email,
                image: userData.image,
                role: userData.role || "member",
                status: userData.status,
                phoneNumber: userData.phoneNumber,
              };
            }
          } catch (error) {
            console.error("Login PIN Error:", error);
          }
        }

        return null; // Login Gagal
      }
    })
  ],
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        await logActivity({
          userId: user.id,
          userName: user.name || "No Name",
          role: (user as any).role || "user",
          action: 'login',
          entity: 'Auth',
          details: `User logged in via ${account?.provider}`
        });
      } catch (error) {
        console.error("Login log error", error);
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const userRef = db.collection("users").doc(user.id);
          const doc = await userRef.get();

          if (!doc.exists) {
            const newPin = generateDistinctPin();
            const nickname = extractNickname(user.name || "");

            await userRef.set({
              uid: user.id,
              name: user.name,
              nickname: nickname,
              email: user.email,
              image: user.image,
              role: "member",
              status: "active",
              pin: newPin,
              createdAt: new Date().toISOString(),
            });
            await logActivity({
                userId: user.id,
                userName: user.name || "New User",
                role: "member",
                action: 'create',
                entity: 'User',
                details: `User baru mendaftar via ${account.provider}`
            });
            console.log(`[AUTH] New User Created: ${nickname} | PIN: ${newPin}`);
          } else {
            const userData = doc.data();
            if (userData?.status && userData.status !== 'active') {
                return `/login?error=AccountInactive`; 
            }
          }
          return true;
        } catch (error) {
          console.error("Auth Error:", error);
          return false;
        }
      }
      return true; // Allow PIN login flow
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.name) {
          token.name = session.name;
      }

      if (user) {
        token.id = user.id;
        if (user.role) token.role = user.role;
        if (user.nickname) token.nickname = user.nickname;
        if (user.phoneNumber) token.phoneNumber = user.phoneNumber;
      }

      try {
        const uid = token.sub || token.id; 
        if(uid) {
            const userDoc = await db.collection("users").doc(uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                token.role = userData?.role || "member";
                token.status = userData?.status || "active";
                token.nickname = userData?.nickname;
                token.phoneNumber = userData?.phoneNumber || ""; 
            }
        }
      } catch (error) {
          console.error("JWT Error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).status = token.status;
        session.user.nickname = token.nickname as string;
        session.user.phoneNumber = token.phoneNumber as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
