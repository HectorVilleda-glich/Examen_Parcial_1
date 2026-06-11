import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role ?? null;
  const pathname = nextUrl.pathname;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isOnboarding = pathname.startsWith("/onboarding");
  const isDashboard = pathname.startsWith("/dashboard");
  const isProjects = pathname.startsWith("/projects");
  const isApiAuth = pathname.startsWith("/api/auth");

  if (isApiAuth) return NextResponse.next();

  if (isLoggedIn && isAuthRoute) {
    const destination = role ? "/dashboard" : "/onboarding/role";
    return NextResponse.redirect(new URL(destination, nextUrl));
  }

  if (isLoggedIn && !role && !isOnboarding) {
    return NextResponse.redirect(new URL("/onboarding/role", nextUrl));
  }

  if (isLoggedIn && role && isOnboarding) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isLoggedIn && (isDashboard || isOnboarding || isProjects)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && role) {
    if (pathname === "/projects/new" && role !== "CLIENTE") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/onboarding/:path*",
    "/projects/:path*",
  ],
};
