import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  const { id } = await context.params;
  const aduanId = Number(id);
  if (!Number.isInteger(aduanId) || aduanId <= 0) {
    return NextResponse.json({ ok: false, error: 'ID aduan tidak valid' }, { status: 422 });
  }

  try {
    const aduan = await db.orm.public.Aduan.first({ id: aduanId });
    if (!aduan) {
      return NextResponse.json({ ok: false, error: 'Aduan tidak ditemukan' }, { status: 404 });
    }

    const bolehLihat =
      viewer.role === 'Admin' ||
      (viewer.role === 'Petugas' && viewer.kecamatanId === aduan.kecamatanId) ||
      (viewer.role === 'Warga' && viewer.id === aduan.pelaporId);

    if (!bolehLihat) {
      return NextResponse.json({ ok: false, error: 'Akses ditolak' }, { status: 403 });
    }

    return NextResponse.json({ ok: true, status: aduan.status });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
