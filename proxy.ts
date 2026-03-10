import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const protectedRoutes = ['/profile', '/admin/dashboard', '/orders', '/help'];

export default function proxy(req: NextRequest) {
  // 1. Read the Better Auth cookie
  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  const isOnProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );
  const isOnAuthRoute = req.nextUrl.pathname.startsWith('/auth');

  // --- THE CALLBACK LOGIC ---

  // 2. Redirect unauthenticated users and SET the callback
  if (isOnProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.nextUrl);

    // Grab where they were trying to go, and attach it as '?callback=/profile'
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);

    return NextResponse.redirect(signInUrl);
  }

  // 3. Redirect authenticated users and READ the callback
  if (isOnAuthRoute && isLoggedIn) {
    // If they have a callback in the URL, send them there. Otherwise, default to /profile.
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/profile';

    return NextResponse.redirect(new URL(callbackUrl, req.nextUrl));
  }

  // 4. Let all other requests proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|robots.txt|sitemap.xml).*)',
  ],
};
