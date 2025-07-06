import NextAuth, { NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Strava from "next-auth/providers/strava";
import Credentials from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    userId: string;
  }
  interface Account {
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    id: string;
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
          id: String(profile.id),
          name: profile.firstname + " " + profile.lastname,
          email: profile.email,
          image: profile.profile_picture,
          isStrava: true,
        };
      },
    }),
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        let user = null;

        user = await db.user.findFirst({
          where: {
            email: {
              equals: credentials.email,
            },
          },
        });

        console.log(user);
        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id!;
      }
      if (user?.name) {
        console.log("JWT USER", user);
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userId = token.id;

      console.log("Sessionicka ");
      console.log(session); // Debug log
      return session;
    },
  },
} satisfies NextAuthConfig);
