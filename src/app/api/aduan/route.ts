import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { getVerifiedWarga } from '@/src/lib/auth/guard';
import { generateNomorTiket } from '@/src/lib/aduan/ticket';
import {
  isStorageConfigured,
  uploadAduanPhoto,
  validateAduanPhoto,
  MAX_ADUAN_PHOTOS,
} from '@/src/lib/storage/supabase';

import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  const scope = new URL(request.url).searchParams.get('scope') ?? 'mine';

  try {
    const rows =
      scope === 'public'
        ? await db.orm.public.Aduan.all()
        : await db.orm.public.Aduan.where({ pelaporId: user.id }).all();

    return NextResponse.json({ ok: true, aduan: await enrichAduan(rows as AduanRow[]) });
  } catch (error) {
    console.error('GET /api/aduan gagal:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getVerifiedWarga();
  if (!user) {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Harus login terlebih dahulu' }, { status: 401 });
    }
    return NextResponse.json(
      { ok: false, error: 'Akun Anda belum terverifikasi. Selesaikan verifikasi domisili dulu.' },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Data form tidak valid' }, { status: 400 });
  }

  const judul = String(formData.get('judul') ?? '').trim();
  const deskripsi = String(formData.get('deskripsi') ?? '').trim();
  const kategoriId = Number(formData.get('kategoriId'));
  const kecamatanId = Number(formData.get('kecamatanId'));
  const latitude = Number(formData.get('latitude'));
  const longitude = Number(formData.get('longitude'));
  const files = formData.getAll('foto').filter((f): f is File => f instanceof File);

  const errors: string[] = [];
  if (judul.length < 5) errors.push('Judul minimal 5 karakter');
  if (judul.length > 120) errors.push('Judul maksimal 120 karakter');
  if (deskripsi.length < 10) errors.push('Deskripsi minimal 10 karakter');
  if (!Number.isInteger(kategoriId) || kategoriId <= 0) errors.push('Kategori wajib dipilih');
  if (!Number.isInteger(kecamatanId) || kecamatanId <= 0) errors.push('Kecamatan wajib dipilih');
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.push('Latitude tidak valid. Ambil lokasi atau isi manual.');
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors.push('Longitude tidak valid. Ambil lokasi atau isi manual.');
  }
  if (files.length === 0) errors.push('Lampirkan minimal 1 foto aduan');
  if (files.length > MAX_ADUAN_PHOTOS) {
    errors.push(`Foto maksimal ${MAX_ADUAN_PHOTOS} berkas`);
  }
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, error: errors.join('; ') }, { status: 422 });
  }

  const validated: { buffer: Buffer; contentType: string }[] = [];
  for (const file of files) {
    const result = await validateAduanPhoto(file);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 422 });
    }
    validated.push({ buffer: result.buffer, contentType: result.contentType });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Konfigurasi penyimpanan (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY) belum diisi di server' },
      { status: 503 },
    );
  }

  let kategori: { id: number } | null = null;
  let kecamatan: { id: number } | null = null;
  try {
    kategori = await db.orm.public.Kategori.first({ id: kategoriId });
    kecamatan = await db.orm.public.Kecamatan.first({ id: kecamatanId });
  } catch (error) {
    console.error('POST /api/aduan gagal cek kategori/kecamatan:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
  if (!kategori) {
    return NextResponse.json({ ok: false, error: 'Kategori tidak ditemukan' }, { status: 422 });
  }
  if (!kecamatan) {
    return NextResponse.json({ ok: false, error: 'Kecamatan tidak ditemukan' }, { status: 422 });
  }

  const fotoUrls: string[] = [];
  try {
    for (const item of validated) {
      const url = await uploadAduanPhoto(user.id, item.buffer, item.contentType);
      if (!url) {
        return NextResponse.json({ ok: false, error: 'Gagal menyimpan foto. Coba lagi.' }, { status: 502 });
      }
      fotoUrls.push(url);
    }
  } catch (error) {
    console.error('POST /api/aduan gagal upload foto:', error);
    return NextResponse.json(
      { ok: false, error: 'Gagal menyimpan foto ke penyimpanan. Coba lagi.' },
      { status: 502 },
    );
  }

  try {
    let nomorTiket = generateNomorTiket();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await db.orm.public.Aduan.where((a) => a.nomorTiket.eq(nomorTiket)).first();
      if (!existing) break;
      nomorTiket = generateNomorTiket();
    }

    await db.orm.public.Aduan.create({
      nomorTiket,
      pelaporId: user.id,
      kategoriId,
      kecamatanId,
      judul,
      deskripsi,
      latitude,
      longitude,
      status: 'MenungguVerifikasi',
      totalUpvote: 0,
    });

    const created = await db.orm.public.Aduan.where((a) => a.nomorTiket.eq(nomorTiket)).first();
    if (!created) {
      return NextResponse.json({ ok: false, error: 'Gagal membuat aduan. Coba lagi.' }, { status: 500 });
    }

    for (const url of fotoUrls) {
      await db.orm.public.FotoAduan.create({ aduanId: created.id, url });
    }

    await db.orm.public.RiwayatStatus.create({
      aduanId: created.id,
      status: 'Dibuat',
      statusAduan: 'MenungguVerifikasi',
      catatan: 'Aduan dibuat oleh warga.',
      olehId: user.id,
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Aduan berhasil dikirim.',
        aduan: { id: created.id, nomorTiket: created.nomorTiket, status: created.status },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/aduan gagal simpan:', error);
    return NextResponse.json(
      { ok: false, error: 'Layanan database sedang tidak tersedia. Coba beberapa saat lagi.' },
      { status: 503 },
    );
  }
}
