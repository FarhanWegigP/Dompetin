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
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user }) {
      // cari user berdasarkan email
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email.toLowerCase() },
      });

      // kalau belum ada → CREATE (REGISTER VIA GITHUB)
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            email: user.email.toLowerCase(),
            nickname: user.name || "github-user",
            hash_password: "OAUTH_USER", // placeholder for OAuth users (no actual password)
          },
        });
      }

      // generate JWT PUNYA APP KAMU
      const token = jwt.sign(
        {
          id_user: existingUser.id_user,
          email: existingUser.email,
          nickname: existingUser.nickname,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // set cookie auth_token (dipakai API lama)
      cookies().set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return true;
    },
  },
});

export { handler as GET, handler as POST };
