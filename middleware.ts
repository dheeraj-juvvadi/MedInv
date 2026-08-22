import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING ?? '');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!JWT_SECRET_STRING) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Authentication is not configured' }, { status: 503 });
    }
    return NextResponse.redirect(new URL('/login?error=auth-unconfigured', request.url));
  }

  const publicPaths = ['/login', '/api/auth/login', '/api/dashboard', '/database-explorer'];
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing-session', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login?error=session-expired', request.url));
    response.cookies.delete('authToken');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api/auth/login|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
