import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/; // Regex untuk file publik (e.g., .css, .js)

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Lewati file publik, API, dan rute Next.js internal
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/assets') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Tentukan bahasa dari URL
  const lang = pathname.split('/')[1];

  // Jika URL hanya "/en" atau "/id" (tanpa sub-path),
  // redirect ke rute dashboard
  if (lang === 'en' || lang === 'id') {
    // Periksa apakah path hanya terdiri dari bahasa saja
    if (pathname === `/${lang}` || pathname === `/${lang}/`) {
      return NextResponse.redirect(new URL(`/${lang}/dashboard`, request.url));
    }
  }

  // Lanjutkan ke rute yang diminta jika tidak ada redirect
  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan rute mana yang akan diproses oleh middleware
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
