import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import { createUser, getUserByEmail, getUserById } from "@/lib/queries";

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
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      token.name = user.name;
      token.email = user.email;

      return token;
    },
    async session({ token, session }) {
      if (!session.user) return session;

      if (token.email) {
        session.user.email = token.email;
      }

      session.user.name = token.name;

      return session;
    },
    async signIn({ profile }) {
      if (!profile?.email) return false;

      const existingUser = await getUserByEmail(profile.email);
      if (existingUser) return true;

      if (!existingUser) {
        await createUser({
          email: profile.email,
          name: profile.name,
        });
        return true;
      }
      return false;
    },
  },
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
});
