import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              nickname: user.name || "github-user",
              hash_password: "OAUTH_USER",
            },
          });
        }

        token.id_user = existingUser.id_user;
        token.email = existingUser.email;
        token.nickname = existingUser.nickname;

        // OPTIONAL: bikin app JWT kalau masih mau dipakai API lama
        token.appToken = jwt.sign(
          {
            id_user: existingUser.id_user,
            email: existingUser.email,
            nickname: existingUser.nickname,
          },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id_user = token.id_user;
      session.user.nickname = token.nickname;
      session.appToken = token.appToken; // <-- bisa dipakai frontend
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
export const runtime = "nodejs";
