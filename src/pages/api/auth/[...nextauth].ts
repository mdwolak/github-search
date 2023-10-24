import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Session } from "next-auth";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import type { UserRole } from "@prisma/client";

import { env } from "~/env/server.mjs";
import { ErrorCode } from "~/lib/errorCodes";
import { prisma } from "~/server/db";
import { authorize } from "~/server/services/auth.service";

const providers: Provider[] = [
  DiscordProvider({
    clientId: env.DISCORD_CLIENT_ID,
    clientSecret: env.DISCORD_CLIENT_SECRET,
  }),

  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    //allowDangerousEmailAccountLinking: true //https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option
  }),
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email Address", type: "email" },
      password: { label: "Password", type: "password" },
    },

    //Validates credentials and returns user object or null
    async authorize(credentials) {
      if (!credentials) {
        throw new Error(ErrorCode.EmailAndPasswordAreRequired);
      }

      //Return user object which will be stored in JWT token
      return (await authorize({
        email: credentials.email,
        password: credentials.password,
      })) as never;
      //Progresses to SignIn callback. More: https://next-auth.js.org/providers/credentials#example---username--password
    },
  }),
];

export const authOptions: NextAuthOptions = {
  //https://next-auth.js.org/configuration/callbacks
  callbacks: {
    //the callback is called with all args (incl. account, profile, isNewUser ) when a JSON Web Token is created (when a user signs in)
    //after that is it called when session is accessed (all args except token are then undefined, so you only pass-through the token)
    jwt: ({ token, user }) => {
      // console.log("jwt");
      // console.log("user", user);
      // console.log("token", token);
      // console.log("profile", profile);
      // console.log("account", account);
      // console.log("isNewUser", isNewUser);
      //user object holds information extracted from the profile and is only passed the first time this callback is called (after the user signs in)
      if (user) {
        return {
          ...token,
          id: Number(user.id),
          role: user.role,
          orgId: user.orgId,
        };
      }
      return token;
    },
    //the callback is called whenever session is accessed (by the client or in the API route) and ONLY if client has been authenticated
    //the desired session object must be recreated every time
    //the user property in the session arg is always passed with mere name, email & image (DefaultSession["user"])
    session({ session, token }): Session {
      // console.log("session", session);
      // console.log("token", token);

      //use data from JWT token to set session user
      session.user = {
        ...session.user,
        id: token.id as number,
        role: token.role as UserRole,
        orgId: token.orgId as number,
      };
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    // error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
