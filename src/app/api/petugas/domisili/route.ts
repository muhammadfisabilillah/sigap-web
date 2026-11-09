import { NextResponse } from 'next/server';
import { getSessionUser } from '@/src/lib/auth/session';
import {
  getPengajuanByKecamatanPetugas,
  getPetugasKecamatanInfo,
  verifikasiPengajuanOlehPetugas,
} from '@/src/services/petugas-domisili';

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Harus login terlebih dahulu' },
      { status: 401 },
    );
  }

  if (user.role !== 'Petugas' && user.role !== 'Admin') {
    return NextResponse.json(
      { ok: false, error: 'Akses hanya untuk Petugas Kecamatan' },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status') || undefined;
  const searchParam = searchParams.get('search') || undefined;
  const overrideKecamatanId = searchParams.get('kecamatanId');

  // Petugas secara mutlak difilter berdasarkan kecamatan tugasnya
  let kecamatanId = user.kecamatanId;

  // Khusus admin, dapat melakukan inspeksi filter kecamatan via query param
  if (user.role === 'Admin' && overrideKecamatanId) {
    const parsed = parseInt(overrideKecamatanId, 10);
    if (!isNaN(parsed) && parsed > 0) {
      kecamatanId = parsed;
    }
  }

  if (!kecamatanId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Akun petugas belum memiliki penugasan wilayah kecamatan.',
      },
      { status: 400 },
    );
  }

  try {
    const petugasInfo = await getPetugasKecamatanInfo(user.id);
    const result = await getPengajuanByKecamatanPetugas(kecamatanId, {
      status: statusParam,
      search: searchParam,
    });

    return NextResponse.json({
      ok: true,
      petugas: petugasInfo || {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        kecamatanId: kecamatanId,
        kecamatanNama: result.kecamatanNama,
      },
      kecamatan: {
        id: kecamatanId,
        nama: result.kecamatanNama,
      },
      statistik: result.statistik,
      pengajuan: result.pengajuan,
    });
  } catch (error) {
    console.error('Gagal memproses filter pengajuan kecamatan petugas:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Terjadi kesalahan server saat memfilter pengajuan.',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Harus login terlebih dahulu' },
      { status: 401 },
    );
  }

  if (user.role !== 'Petugas' && user.role !== 'Admin') {
    return NextResponse.json(
      { ok: false, error: 'Akses hanya untuk Petugas Kecamatan' },
      { status: 403 },
    );
  }

  let body: { pengajuanId?: number; status?: string; catatan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Format data JSON tidak valid' },
      { status: 400 },
    );
  }

  const { pengajuanId, status, catatan } = body;

  if (!pengajuanId || typeof pengajuanId !== 'number') {
    return NextResponse.json(
      { ok: false, error: 'ID pengajuan wajib diisi' },
      { status: 422 },
    );
  }

  if (status !== 'Diterima' && status !== 'Ditolak') {
    return NextResponse.json(
      { ok: false, error: 'Status harus bernilai Diterima atau Ditolak' },
      { status: 422 },
    );
  }

  const kecamatanId = user.kecamatanId;
  if (!kecamatanId) {
    return NextResponse.json(
      { ok: false, error: 'Petugas belum terdaftar pada wilayah kecamatan' },
      { status: 400 },
    );
  }

  const hasil = await verifikasiPengajuanOlehPetugas({
    pengajuanId,
    petugasUserId: user.id,
    petugasKecamatanId: kecamatanId,
    status: status as 'Diterima' | 'Ditolak',
    catatan,
  });

  if (!hasil.ok) {
    return NextResponse.json(
      { ok: false, error: hasil.error },
      { status: hasil.error?.includes('Akses ditolak') ? 403 : 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: hasil.message,
  });
}

// Support POST juga untuk kemudahan client compatibility
export async function POST(request: Request) {
  return PATCH(request);
}
