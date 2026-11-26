import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';

export async function GET(request: Request) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Admin') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Admin yang dapat mengelola aduan' },
      { status: 403 },
    );
  }

  const status = new URL(request.url).searchParams.get('status') ?? undefined;

  try {
    const rows = (await db.orm.public.Aduan.all()) as AduanRow[];
    const filtered = status ? rows.filter((r) => r.status === status) : rows;
    return NextResponse.json({ ok: true, aduan: await enrichAduan(filtered) });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
