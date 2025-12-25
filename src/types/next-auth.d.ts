import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      nickname?: string; // Tambahan field nickname
      status?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    nickname?: string; // Tambahan field nickname
    status?: string;
    pin?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    nickname?: string; // Tambahan field nickname
    status?: string;
  }
}
