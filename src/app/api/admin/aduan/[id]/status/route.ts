import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import {
  STATUS_ADUAN_TO_RIWAYAT,
  isStatusAduan,
} from '@/src/lib/aduan/transitions';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (viewer.role !== 'Admin') {
    return NextResponse.json(
      { ok: false, error: 'Hanya Admin yang dapat mengubah status aduan' },
      { status: 403 },
    );
  }

  const { id } = await context.params;
  const aduanId = Number(id);
  if (!Number.isInteger(aduanId) || aduanId <= 0) {
    return NextResponse.json({ ok: false, error: 'ID aduan tidak valid' }, { status: 422 });
  }

  let body: { status?: string; catatan?: string; instansiId?: number | null };
  try {
    body = (await request.json()) as { status?: string; catatan?: string; instansiId?: number | null };
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const status = body.status ?? '';
  const catatan = body.catatan?.trim() ?? '';

  if (!isStatusAduan(status)) {
    return NextResponse.json({ ok: false, error: 'Status aduan tidak valid' }, { status: 422 });
  }
  if (status === 'Ditolak' && catatan.length < 5) {
    return NextResponse.json(
      { ok: false, error: 'Catatan penolakan wajib diisi (minimal 5 karakter)' },
      { status: 422 },
    );
  }

  try {
    const aduan = await db.orm.public.Aduan.first({ id: aduanId });
    if (!aduan) {
      return NextResponse.json({ ok: false, error: 'Aduan tidak ditemukan' }, { status: 404 });
    }
    if (aduan.status === status) {
      return NextResponse.json(
        { ok: false, error: 'Status aduan sudah sama dengan status baru' },
        { status: 409 },
      );
    }
    if (aduan.status === 'Selesai' || aduan.status === 'Ditolak') {
      return NextResponse.json(
        { ok: false, error: 'Aduan ini sudah selesai dan tidak dapat diubah lagi' },
        { status: 409 },
      );
    }

    let instansiId: number | null | undefined;
    if (body.instansiId !== undefined && body.instansiId !== null) {
      instansiId = Number(body.instansiId);
      if (!Number.isInteger(instansiId) || instansiId <= 0) {
        return NextResponse.json({ ok: false, error: 'Instansi tidak valid' }, { status: 422 });
      }
      const instansi = await db.orm.public.Instansi.first({ id: instansiId });
      if (!instansi) {
        return NextResponse.json({ ok: false, error: 'Instansi tidak ditemukan' }, { status: 422 });
      }
    }

    await db.orm.public.Aduan.where({ id: aduanId }).update({
      status,
      ...(instansiId !== undefined ? { instansiId } : {}),
    });

    await db.orm.public.RiwayatStatus.create({
      aduanId,
      status: STATUS_ADUAN_TO_RIWAYAT[status],
      statusAduan: status,
      catatan: catatan || null,
      olehId: viewer.id,
    });

    await db.orm.public.Notifikasi.create({
      userId: aduan.pelaporId,
      aduanId,
      judul: `Status aduan ${aduan.nomorTiket} diperbarui`,
      pesan: catatan
        ? `Status aduan Anda kini: ${status}. Catatan: ${catatan}`
        : `Status aduan Anda kini: ${status}.`,
      dibaca: false,
    });

    return NextResponse.json({ ok: true, message: 'Status aduan diperbarui.' });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
