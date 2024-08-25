import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = nextUrl.pathname === '/';
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isAuthRoute = nextUrl.pathname === '/sign-in';

  if (isApiAuthRoute) return;

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    return Response.redirect(new URL('/sign-in', nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
