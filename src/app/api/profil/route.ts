import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (user.role !== 'Warga') {
    return NextResponse.json(
      { ok: false, error: 'Hanya warga yang dapat mengubah profilnya' },
      { status: 403 },
    );
  }

  let body: { kecamatanId?: number | null; noHp?: string };
  try {
    body = (await request.json()) as { kecamatanId?: number | null; noHp?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  try {
    if (body.kecamatanId !== undefined) {
      if (body.kecamatanId !== null) {
        const kecamatanId = Number(body.kecamatanId);
        if (!Number.isInteger(kecamatanId) || kecamatanId <= 0) {
          return NextResponse.json({ ok: false, error: 'Kecamatan tidak valid' }, { status: 422 });
        }
        const kecamatan = await db.orm.public.Kecamatan.first({ id: kecamatanId });
        if (!kecamatan) {
          return NextResponse.json({ ok: false, error: 'Kecamatan tidak ditemukan' }, { status: 422 });
        }
      }
      await db.orm.public.User.where({ id: user.id }).update({
        kecamatanId: body.kecamatanId ?? null,
      });
    }

    if (body.noHp !== undefined) {
      await db.orm.public.User.where({ id: user.id }).update({
        noHp: body.noHp.trim() || null,
      });
    }

    return NextResponse.json({ ok: true, message: 'Profil diperbarui.' });
  } catch (error) {
    console.error('PATCH /api/profil gagal:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
