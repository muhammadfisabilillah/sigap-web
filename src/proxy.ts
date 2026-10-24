import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'sigap_session';

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/petugas/:path*', '/warga/:path*'],
};
