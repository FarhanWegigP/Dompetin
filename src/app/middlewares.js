import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isDashboardPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/transaction") ||
    pathname.startsWith("/loandebt") ||
    pathname.startsWith("/billvault");

  // 🔒 Protected route
  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔁 Sudah login tapi buka login/register
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transaction/:path*",
    "/loandebt/:path*",
    "/billvault/:path*",
    "/login",
    "/register",
  ],
};
