
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function is the primary gatekeeper for authentication.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the session token from cookies.
  const sessionToken = request.cookies.get('firebase-auth-session')?.value;

  // Define routes that are considered "public" and do not require authentication.
  const publicRoutes = ['/login', '/signup'];
  
  // The root path '/' should be accessible to allow the client-side redirect logic to run.
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  const isPublicRoute = publicRoutes.includes(pathname);

  // If the user has a session token and is trying to access a public auth page (like login/signup),
  // redirect them to the dashboard.
  if (sessionToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user does NOT have a session token and is trying to access any page
  // that is NOT a public route, redirect them to the login page.
  if (!sessionToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

// The 'matcher' configuration specifies which paths this middleware will run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - logo.svg, manifest.json, sw.js (PWA assets and public files)
     */
    '/((?!_next/static|_next/image|logo.svg|manifest.json|sw.js|favicon.ico).*)',
  ],
};
