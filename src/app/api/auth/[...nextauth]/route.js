import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email", // ⬅️ PENTING
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        // ambil email PALING AMAN
        const email =
          user.email ||
          profile?.email ||
          (Array.isArray(profile?.emails)
            ? profile.emails.find(e => e.primary)?.email
            : null);
    
        if (!email) {
          throw new Error("Email not available from GitHub");
        }
    
        // nickname dari email
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
    
        token.id_user = existingUser.id_user;
        token.email = existingUser.email;
        token.nickname = existingUser.nickname;
      }
    
      return token;
    },
      

    async session({ session, token }) {
      session.user.id_user = token.id_user;
      session.user.email = token.email;
      session.user.nickname = token.nickname;
      return session;
    }    
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
export const runtime = "nodejs";
