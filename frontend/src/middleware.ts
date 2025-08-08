
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes
const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password"];
// This will match /blog/any-slug but not /blog, /blog/new, etc.
const blogSlugRegex = /^\/blog\/[^\/]+$/;

// Protected routes (add sub-paths as needed)
const protectedRoutes = [
  "/feed",
  "/upload",
];

// Helper to determine if a path is a protected route
function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Helper to determine if a path is a public route
function isPublicRoute(pathname: string) {
  if (publicRoutes.includes(pathname)) return true;
  // Allow /blog/[slug], but not /blog, /blog/new, etc.
  if (blogSlugRegex.test(pathname)) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth session cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (sessionToken) {
    // Logged in: block access to public auth pages (except /blog/[slug])
    if (publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
    // Allow /blog/[slug]
    if (blogSlugRegex.test(pathname)) {
      return NextResponse.next();
    }
    // Allow access to protected routes
    if (isProtectedRoute(pathname)) {
      return NextResponse.next();
    }
    // Block all else (e.g. /, /sign-in, /sign-up etc.)
    return NextResponse.redirect(new URL("/feed", request.url));
  } else {
    // Not logged in: block access to protected routes
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", request.url); // Redirect back after login
      return NextResponse.redirect(loginUrl);
    }
    // Allow public routes and /blog/[slug]
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }
    // Block everything else
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/feed/:path*",
    "/upload"
  ],
};
