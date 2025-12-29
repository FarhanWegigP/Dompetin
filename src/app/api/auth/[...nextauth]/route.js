import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // 🔥 INI KUNCI UTAMA
    async signIn({ user, profile }) {
      const email =
        user.email ||
        profile?.email ||
        (Array.isArray(profile?.emails)
          ? profile.emails.find(e => e.primary)?.email
          : null);

      if (!email) return false;

      const nickname = email.split("@")[0];

      let existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email,
            nickname,
            hash_password: "OAUTH_USER",
          },
        });
      }

      // 👉 BUAT JWT APLIKASI (auth_token)
      const appToken = jwt.sign(
        {
          id_user: existingUser.id_user,
          email: existingUser.email,
          nickname: existingUser.nickname,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      cookies().set("auth_token", appToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id_user = user.id;
        token.email = user.email;
        token.nickname = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id_user = token.id_user;
      session.user.email = token.email;
      session.user.nickname = token.nickname;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
export const runtime = "nodejs";
