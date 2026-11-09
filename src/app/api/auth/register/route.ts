import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/register
 * Payload: { nama, email, password, noHp? }
 * Membuat user baru dengan password di-hash menggunakan bcrypt.
 * Returns 201 { ok: true } saat berhasil.
 * Returns 409 jika email sudah terdaftar.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nama: string = body.nama ?? '';
    const email: string = body.email ?? '';
    const password: string = body.password ?? '';
    const noHp: string | undefined = body.noHp ?? undefined;

    // --- Validasi input ---
    if (!nama.trim() || !email.trim() || !password) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi.' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --- Cek duplikat email ---
    const existing = await db.orm.public.User.first({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 409 },
      );
    }

    // --- Hash password & simpan user ---
    const passwordHash = await bcrypt.hash(password, 10);
    await db.orm.public.User.create({
      nama: nama.trim(),
      email: normalizedEmail,
      passwordHash,
      noHp: noHp?.trim() || undefined,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[register] error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
