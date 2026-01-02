
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/firebase-admin";
import { logActivity } from "@/lib/audit-logger";
import { getHighestRole } from "@/lib/role-utils";

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
            roles: ["superadmin", "admin", "host", "coach", "member"],
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
                roles: userData.roles || [userData.role || "member"],
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
    async signIn({ user }) {
      const userRef = db.collection("users").doc(user.id);
      const doc = await userRef.get();

      if (doc.exists) {
        const data = doc.data();
        const roles = data?.roles || [data?.role || 'member'];

        // LOGIC HIRARKI TERTINGGI
        // Saat login, paksa active 'role' menjadi yang tertinggi
        const highestRole = getHighestRole(roles);

        await userRef.update({
          role: highestRole, // Set active role
          roles: roles, // Pastikan array roles tersimpan
          lastLogin: new Date().toISOString()
        });

        await logActivity({
          userId: user.id,
          userName: user.name || "No Name",
          role: (user as any).role || "user", // Casting jika typescript complain
          action: 'login',
          entity: 'Auth',
          details: `User logged in`
        });
      }
    }
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
              roles: ["member"],
              status: "active",
              pin: newPin,
              hasSeenPin: false, // Flag untuk modal PIN
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
      // 1. Initial Sign In
      if (user) {
        token.id = user.id;
        // Jika user baru login, kita set defaults sementara
        token.role = (user as any).role;
        token.roles = (user as any).roles || [(user as any).role];
      }

      // 2. Fetch Data Real-time dari DB (PENTING untuk Switch Role)
      // Ini memastikan token selalu sync dengan database saat page reload/session check
      if (token.id) {
        const userDoc = await db.collection("users").doc(token.id as string).get();
        if (userDoc.exists) {
          const userData = userDoc.data();

          // Pastikan field 'roles' ada. Jika tidak, pakai 'role' lama dibungkus array
          const userRoles = userData?.roles || [userData?.role || 'member'];
          const activeRole = userData?.role || 'member';

          token.roles = userRoles;
          token.role = activeRole; // Ini role yang sedang AKTIF
        }
      }

      // 3. Handle Client-side Update (Trigger update session manual)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Active Role
        (session.user as any).roles = token.roles as string[]; // Available Roles
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
