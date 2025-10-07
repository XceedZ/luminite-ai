import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/assets') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // No locale-based redirects; proceed as-is
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
