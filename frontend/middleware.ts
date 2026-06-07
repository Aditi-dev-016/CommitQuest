import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/quests') ||
    pathname.startsWith('/repositories') ||
    pathname.startsWith('/guilds') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/academy') ||
    pathname.startsWith('/onboarding');

  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/quests/:path*',
    '/repositories/:path*',
    '/guilds/:path*',
    '/profile/:path*',
    '/academy/:path*',
    '/onboarding/:path*',
    '/login',
  ],
};
