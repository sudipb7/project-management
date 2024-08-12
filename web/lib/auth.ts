import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import { api, getUserByEmail } from "@/lib/api";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Github({ allowDangerousEmailAccountLinking: true }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (!token.sub) return token;
      if (!profile?.email) return token;

      const user = await getUserByEmail(profile.email);
      if (!user) return token;

      token.userId = user.id;
      token.name = user.name;
      token.email = user.email;

      return token;
    },
    async session({ token, session }) {
      if (!session.user) return session;

      if (token.email) {
        session.user.email = token.email;
      }

      session.user.userId = token.userId as string;
      session.user.name = token.name;

      return session;
    },
    async signIn({ profile }) {
      if (!profile?.email) return false;

      const existingUser = await getUserByEmail(profile.email);
      if (existingUser) return true;

      if (!existingUser) {
        try {
          await api.post("/users", {
            email: profile.email,
            name: profile.name,
          });
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    },
  },
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
});
