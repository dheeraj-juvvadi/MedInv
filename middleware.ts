import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Using 'jose' for JWT verification in Edge runtime

// IMPORTANT: Use the same secret key as in the login API, stored securely (e.g., environment variable)
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "YOUR_VERY_SECRET_KEY_REPLACE_ME"; // Replace with env var
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/api/auth/login",
    "/api/dashboard",
    "/database-explorer",
  ]; // Add other public paths/APIs if needed

  // Check if the current path is public
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname === "/api/auth/login"
  ) {
    return NextResponse.next(); // Allow access to public paths
  }

  // Get the token from the cookies
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // No token found, redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token
    // Using 'jose' library as 'jsonwebtoken' might not be fully compatible with Edge runtime
    await jwtVerify(token, JWT_SECRET);

    // Token is valid, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // Token verification failed (invalid or expired)
    console.error("JWT Verification Error:", error);

    // Redirect to login, potentially clearing the invalid cookie
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("authToken"); // Clear the invalid token cookie
    return response;
  }
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled specifically above)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     */
    "/((?!api/auth/login|_next/static|_next/image|favicon.ico|login|scenery/|third-party-notices.txt|placeholder|grid.svg|image.png).*)",
  ],
};
