import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import {
  isStorageConfigured,
  uploadKtp,
  validateKtpFile,
} from '@/src/lib/storage/supabase';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  if (user.role !== 'Warga') {
    return NextResponse.json({ ok: false, error: 'Hanya warga yang dapat mengajukan verifikasi domisili' }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Data form tidak valid' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File) || Array.from(formData.getAll('file')).length > 1) {
    return NextResponse.json({ ok: false, error: 'Lampirkan tepat satu berkas KTP' }, { status: 422 });
  }

  const validated = await validateKtpFile(file);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, error: validated.error }, { status: 422 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Konfigurasi penyimpanan (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY) belum diisi di server' },
      { status: 503 },
    );
  }
  const fileUrl = await uploadKtp(user.id, validated.buffer, validated.contentType);
  if (!fileUrl) {
    return NextResponse.json({ ok: false, error: 'Gagal menyimpan berkas. Coba lagi.' }, { status: 502 });
  }

  await db.orm.public.VerifikasiDomisili.upsert({
    create: { userId: user.id, fileKtpUrl: fileUrl, status: 'Menunggu' },
    update: { fileKtpUrl: fileUrl, status: 'Menunggu', catatan: null },
  });

  return NextResponse.json({ ok: true, message: 'Pengajuan verifikasi domisili terkirim' }, { status: 201 });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }
  const pengajuan = await db.orm.public.VerifikasiDomisili
    .select('status', 'catatan', 'fileKtpUrl', 'createdAt')
    .where({ userId: user.id })
    .first();
  if (!pengajuan) {
    return NextResponse.json({ ok: true, pengajuan: null });
  }
  return NextResponse.json({
    ok: true,
    pengajuan: {
      status: pengajuan.status,
      catatan: pengajuan.catatan ?? null,
      fileUrl: pengajuan.fileKtpUrl,
      diajukanPada: pengajuan.createdAt,
    },
  });
}
