import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { getPengajuanDomisili } from '@/src/lib/verifikasi/query';

export async function GET(request: Request) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Admin' && viewer.role !== 'Petugas') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Admin dan Petugas yang dapat melihat pengajuan domisili' },
      { status: 403 },
    );
  }

  const status = new URL(request.url).searchParams.get('status') ?? undefined;

  try {
    const pengajuan = await getPengajuanDomisili(viewer, status);
    return NextResponse.json({ ok: true, pengajuan });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}

type VerifyBody = {
  id?: number;
  aksi?: 'Diterima' | 'Ditolak';
  catatan?: string;
};

export async function POST(request: Request) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Admin' && viewer.role !== 'Petugas') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Admin dan Petugas yang dapat memverifikasi domisili' },
      { status: 403 },
    );
  }

  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const id = Number(body.id);
  const aksi = body.aksi;
  const catatan = body.catatan?.trim() ?? '';

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: 'ID pengajuan tidak valid' }, { status: 422 });
  }
  if (aksi !== 'Diterima' && aksi !== 'Ditolak') {
    return NextResponse.json(
      { ok: false, error: 'Aksi harus Diterima atau Ditolak' },
      { status: 422 },
    );
  }
  if (aksi === 'Ditolak' && catatan.length < 5) {
    return NextResponse.json(
      { ok: false, error: 'Catatan penolakan wajib diisi (minimal 5 karakter)' },
      { status: 422 },
    );
  }

  try {
    const pengajuan = await db.orm.public.VerifikasiDomisili.first({ id });
    if (!pengajuan) {
      return NextResponse.json({ ok: false, error: 'Pengajuan tidak ditemukan' }, { status: 404 });
    }

    const owner = await db.orm.public.User.first({ id: pengajuan.userId });
    if (!owner) {
      return NextResponse.json({ ok: false, error: 'Pemohon tidak ditemukan' }, { status: 404 });
    }

    if (viewer.role === 'Petugas' && owner.kecamatanId !== viewer.kecamatanId) {
      return NextResponse.json(
        { ok: false, error: 'Anda hanya dapat memverifikasi warga di kecamatan Anda' },
        { status: 403 },
      );
    }

    if (pengajuan.status !== 'Menunggu') {
      return NextResponse.json(
        { ok: false, error: 'Pengajuan ini sudah diproses sebelumnya' },
        { status: 409 },
      );
    }

    await db.orm.public.VerifikasiDomisili.where({ id }).update({
      status: aksi,
      catatan: catatan || null,
    });

    if (aksi === 'Diterima') {
      await db.orm.public.User.where({ id: owner.id }).update({
        statusAkun: 'Terverifikasi',
      });
    }

    await db.orm.public.Notifikasi.create({
      userId: owner.id,
      aduanId: null,
      judul:
        aksi === 'Diterima'
          ? 'Verifikasi domisili diterima'
          : 'Verifikasi domisili ditolak',
      pesan:
        aksi === 'Diterima'
          ? 'Domisili Anda sudah terverifikasi. Akun Anda kini aktif dan dapat membuat aduan.'
          : `Pengajuan domisili Anda ditolak. ${catatan}`,
      dibaca: false,
    });

    return NextResponse.json({
      ok: true,
      message:
        aksi === 'Diterima'
          ? 'Pengajuan domisili diterima dan akun warga diaktifkan.'
          : 'Pengajuan domisili ditolak.',
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
