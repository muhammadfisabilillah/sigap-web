import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Format email tidak valid' }, { status: 422 });
  }

  // Selalu balas sukses generik agar tidak membocorkan apakah email terdaftar.
  // Pengiriman email reset belum diintegrasikan — permintaan dicatat di log server
  // dan pengguna diarahkan menghubungi admin untuk reset manual.
  try {
    const user = await db.orm.public.User.where((u) => u.email.eq(email)).first();
    if (user) {
      console.log(
        '[lupa-password] Permintaan reset untuk user',
        user.id,
        user.email,
        '— perlu reset manual oleh admin (email belum terintegrasi).',
      );
    }
  } catch (error) {
    console.error('POST /api/auth/lupa-password gagal:', error);
  }

  return NextResponse.json({
    ok: true,
    message:
      'Jika email terdaftar, panduan reset kata sandi akan dikirim. Jika tidak menerima dalam 1x24 jam, hubungi admin SIGAP untuk reset manual.',
  });
}
