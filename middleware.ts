import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/_next') || path.startsWith('/api') || path === '/') {
    return NextResponse.next();
  }
  const session = request.cookies.get('__session');
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/studio/:path*'],
};