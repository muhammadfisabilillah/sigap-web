import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';

export async function GET() {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Petugas') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Petugas yang dapat melihat aduan wilayah' },
      { status: 403 },
    );
  }
  if (!viewer.kecamatanId) {
    return NextResponse.json(
      { ok: false, error: 'Wilayah kerja petugas belum ditetapkan' },
      { status: 422 },
    );
  }

  try {
    const rows = (await db.orm.public.Aduan.where({
      kecamatanId: viewer.kecamatanId,
    }).all()) as AduanRow[];
    return NextResponse.json({ ok: true, aduan: await enrichAduan(rows) });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
