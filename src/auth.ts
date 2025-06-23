import NextAuth, { NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Strava from "next-auth/providers/strava";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
  interface Account {
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  debug: true,
  providers: [
    Strava({
      clientId: process.env.AUTH_STRAVA_ID,
      clientSecret: process.env.AUTH_STRAVA_SECRET,
      authorization: {
        params: {
          scope: "activity:read_all,activity:write,profile:read_all",
        },
      },
      profile(profile) {
        console.log("Profilot");
        console.log(profile); // Debug log
        console.log(profile.firstname)

        return {
          id: profile.id,
          name: profile.firstname && profile.lastname
          ? `${profile.firstname} ${profile.lastname}`
          : profile.username ?? profile.email ?? "Unknown",
          email: profile.email ?? `${profile.username}@strava.actitrack.local`,
          image: profile.profile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        console.log("Accounticka ");
        console.log(account); // Debug log
        token.accessToken = account.access_token;
      }
      if (user?.name) {
        console.log("JWT USER", user);
        token.name = user.name;
  }
      return token;
    },
    async session({ session, token }) {
      console.log("Sessionicka ");

      console.log(session); // Debug log
      session.accessToken = token.accessToken;
       if (token.name) {
        session.user.name = token.name as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig);
