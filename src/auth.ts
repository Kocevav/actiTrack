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

        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.profile_picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("Accounticka ");
        console.log(account); // Debug log
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Sessionicka ");
      console.log(session); // Debug log
      session.accessToken = token.accessToken;
      return session;
    },
  },
} satisfies NextAuthConfig);
