import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // 1. Google Provider (Otomatis jadi Member)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // 2. PIN Provider (Otomatis jadi Superadmin)
    CredentialsProvider({
      name: "PIN",
      credentials: {
        pin: { label: "PIN", type: "password" }
      },
      async authorize(credentials) {
        // Logika Validasi PIN Superadmin
        if (credentials?.pin === "113125") {
          return {
            id: "superadmin",
            name: "Superadmin",
            email: "admin@badmintour.com",
            role: "superadmin", // Set Role Disini
            image: "https://ui-avatars.com/api/?name=Super+Admin&background=ffbe00&color=000"
          };
        }
        return null; // Login Gagal
      }
    })
  ],
  callbacks: {
    // Masukkan role ke dalam Token JWT
    async jwt({ token, user, account }) {
      if (user) {
        // Jika login pakai Google (account.type === 'oauth'), set role member
        if (account?.provider === 'google') {
            token.role = 'member';
        } else {
            // Jika login pakai PIN (Credentials), ambil role dari object user di atas
            token.role = user.role;
        }
      }
      return token;
    },
    // Teruskan role dari Token ke Session agar bisa dibaca di frontend
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Halaman login custom kita
  }
});

export { handler as GET, handler as POST };
