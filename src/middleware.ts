import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role ?? null;
  const pathname = nextUrl.pathname;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname === "/onboarding/role";

  if (isLoggedIn && isAuthRoute) {
    const destination = role ? "/dashboard" : "/onboarding/role";
    return NextResponse.redirect(new URL(destination, nextUrl));
  }

  if (isLoggedIn && !role && isDashboard) {
    return NextResponse.redirect(new URL("/onboarding/role", nextUrl));
  }

  if (isLoggedIn && role && isOnboarding) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && (isDashboard || isOnboarding)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/onboarding/role"],
};
