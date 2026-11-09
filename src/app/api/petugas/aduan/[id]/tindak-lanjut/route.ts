import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Petugas') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Petugas yang dapat mencatat tindak lanjut' },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const aduanId = Number(id);
  if (!Number.isInteger(aduanId) || aduanId <= 0) {
    return NextResponse.json({ ok: false, error: 'ID aduan tidak valid' }, { status: 422 });
  }

  let body: { catatan?: string };
  try {
    body = (await request.json()) as { catatan?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const catatan = body.catatan?.trim() ?? '';
  if (catatan.length < 10) {
    return NextResponse.json(
      { ok: false, error: 'Catatan tindak lanjut minimal 10 karakter' },
      { status: 422 },
    );
  }

  try {
    const aduan = await db.orm.public.Aduan.first({ id: aduanId });
    if (!aduan) {
      return NextResponse.json({ ok: false, error: 'Aduan tidak ditemukan' }, { status: 404 });
    }
    if (aduan.kecamatanId !== viewer.kecamatanId) {
      return NextResponse.json(
        { ok: false, error: 'Aduan ini di luar wilayah kerja Anda' },
        { status: 403 },
      );
    }
    if (aduan.status === 'Selesai' || aduan.status === 'Ditolak') {
      return NextResponse.json(
        { ok: false, error: 'Aduan ini sudah selesai dan tidak dapat ditindaklanjuti lagi' },
        { status: 409 },
      );
    }

    const statusBaru =
      aduan.status === 'MenungguVerifikasi' ? 'Diproses' : 'MenungguTinjauan';

    await db.orm.public.Aduan.where({ id: aduanId }).update({ status: statusBaru });

    await db.orm.public.RiwayatStatus.create({
      aduanId,
      status: 'DitindakLanjuti',
      statusAduan: statusBaru,
      catatan,
      olehId: viewer.id,
    });

    await db.orm.public.Notifikasi.create({
      userId: aduan.pelaporId,
      aduanId,
      judul: `Aduan ${aduan.nomorTiket} sedang ditindaklanjuti`,
      pesan: `Petugas kecamatan mencatat tindak lanjut: ${catatan}`,
      dibaca: false,
    });

    return NextResponse.json({ ok: true, message: 'Tindak lanjut dicatat.' });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
