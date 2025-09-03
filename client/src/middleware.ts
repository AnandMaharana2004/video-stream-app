import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Define an array of public routes that don't require authentication.
const publicRoutes = ["/", "/sign-in", "/sign-up", "/forgot-password"];

// Define an array of private routes that require authentication.
const privateRoutes = ["/videos", "/videos/[videoid]", "/upload"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Check if the user is trying to access a public route.
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Check if the user is trying to access a private route.
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);

  // Case 1: If the user is logged in and trying to access a public route,
  // redirect them to a private route (e.g., /videos).
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/videos", nextUrl));
  }

  // Case 2: If the user is NOT logged in and trying to access a private route,
  // redirect them to the sign-in page.
  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  // If none of the above conditions are met, continue with the request.
  // This allows authorized users to access private routes and
  // unauthorized users to access public routes.
  return NextResponse.next();
});

// Configure the middleware to run on specific paths to improve performance.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};