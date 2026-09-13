import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

const PUBLIC_PATHS = new Set(['/login', '/api/auth/login']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return handleUnauthenticatedRequest(request);
  }

  try {
    const user = await verifySessionToken(token);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-medinv-user', JSON.stringify(user));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (error) {
    console.error('JWT Verification Error:', error);

    return handleUnauthenticatedRequest(request, true);
  }
}

function handleUnauthenticatedRequest(request: NextRequest, clearCookie = false) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
    if (clearCookie) {
      response.cookies.delete(SESSION_COOKIE_NAME);
    }
    return response;
  }

  const response = NextResponse.redirect(new URL('/login', request.url));
  if (clearCookie) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }
  return response;
}

// Specify the paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page itself)
     * - api/auth/login (the login API)
     */
    '/((?!api/auth/login|_next/static|_next/image|favicon.ico|login|scenery/|third-party-notices.txt|placeholder|grid.svg|image.png).*)',
  ],
};
