import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import bcrypt from 'bcryptjs';
import { issueSession } from '@/src/lib/auth/session';

/**
 * POST /api/auth/login
 * Payload: { email, password }
 * Memvalidasi kredensial, lalu menerbitkan sesi via issueSession()
 * yang menyimpan opaque token di DB (tabel Session) dan set HTTP-only cookie.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: string = body.email ?? '';
    const password: string = body.password ?? '';

    // --- Validasi input ---
    if (!email.trim() || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi.' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --- Cari user ---
    const user = await db.orm.public.User.first({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah.' },
        { status: 401 },
      );
    }

    // --- Verifikasi password ---
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Email atau password salah.' },
        { status: 401 },
      );
    }

    // --- Terbitkan sesi (simpan ke DB + set HTTP-only cookie) ---
    await issueSession(user.id);

    return NextResponse.json(
      { ok: true, role: user.role },
      { status: 200 },
    );
  } catch (err) {
    console.error('[login] error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
