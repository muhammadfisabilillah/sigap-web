import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { hashPassword } from '@/src/lib/auth/password';
import { issueSession } from '@/src/lib/auth/session';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RegisterBody = {
  nama?: string;
  email?: string;
  password?: string;
  noHp?: string;
  kecamatanId?: number;
};

export async function POST(request: Request) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const nama = body.nama?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const errors: string[] = [];
  if (!nama || nama.length < 2) errors.push('Nama minimal 2 karakter');
  if (!email || !EMAIL_RE.test(email)) errors.push('Format email tidak valid');
  if (!password || password.length < 8) errors.push('Password minimal 8 karakter');
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors.join('; ') }, { status: 422 });
  }

  const existing = await db.orm.public.User.where((u) => u.email.eq(email!)).first();
  if (existing) {
    return NextResponse.json({ ok: false, error: 'Email sudah terdaftar' }, { status: 409 });
  }

  let kecamatanId: number | undefined;
  if (body.kecamatanId !== undefined) {
    const kecamatan = await db.orm.public.Kecamatan.first({ id: body.kecamatanId });
    if (!kecamatan) {
      return NextResponse.json({ ok: false, error: 'Kecamatan tidak ditemukan' }, { status: 422 });
    }
    kecamatanId = body.kecamatanId;
  }

  await db.orm.public.User.create({
    nama: nama!,
    email: email!,
    passwordHash: hashPassword(password!),
    role: 'Warga',
    statusAkun: 'BelumTerverifikasi',
    noHp: body.noHp?.trim() || null,
    kecamatanId: kecamatanId ?? null,
  });

  await issueSession((await db.orm.public.User.where((u) => u.email.eq(email!)).first())!.id);

  return NextResponse.json(
    { ok: true, message: 'Registrasi berhasil. Silakan ajukan verifikasi domisili.' },
    { status: 201 },
  );
}
