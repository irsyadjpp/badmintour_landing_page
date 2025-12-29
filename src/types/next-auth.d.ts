
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // Role Aktif
      roles: string[]; // Array Role
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    roles: string[];
  }
}
