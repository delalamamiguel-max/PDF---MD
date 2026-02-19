import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth-options";

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
