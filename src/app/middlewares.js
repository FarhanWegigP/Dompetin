import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = verifyJwt(token);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard") || pathname.startsWith("/transaction") || pathname.startsWith("/loandebt") || pathname.startsWith("/billvault");

  // If visiting protected route and not logged in
  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/transaction/:path*", "/loandebt/:path*", "/billvault/:path*", "/login", "/register"],
};
