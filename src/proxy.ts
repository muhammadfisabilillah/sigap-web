import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "sigap_session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Sementara izinkan halaman admin domisili untuk pengembangan UI.
  // Hapus pengecualian ini setelah integrasi autentikasi selesai.
  if (pathname.startsWith("/admin/domisili")) {
    return NextResponse.next();
  }

  // Halaman lainnya tetap memerlukan cookie sesi.
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/petugas/:path*", "/warga/:path*"],
};
