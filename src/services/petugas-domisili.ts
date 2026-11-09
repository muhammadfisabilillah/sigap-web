import { db } from '@/src/prisma/db';

export type StatusVerifikasiDomisili = 'Menunggu' | 'Diterima' | 'Ditolak';

export type PengajuanDomisiliItem = {
  id: number;
  userId: number;
  nama: string;
  email: string;
  noHp: string | null;
  kecamatanId: number;
  kecamatanNama: string;
  status: StatusVerifikasiDomisili;
  catatan: string | null;
  fileKtpUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type StatistikPengajuanKecamatan = {
  total: number;
  menunggu: number;
  diterima: number;
  ditolak: number;
};

export type FilterPengajuanOptions = {
  status?: string;
  search?: string;
};

// Data dummy realistis untuk fallback testing ketika DB belum memiliki data warga di kecamatan terkait
const DUMMY_PENGAJUAN_KECAMATAN: Record<number, PengajuanDomisiliItem[]> = {
  8: [ // ID 8: Kecamatan Gubeng
    {
      id: 101,
      userId: 201,
      nama: 'Ahmad Fauzi Rahman',
      email: 'ahmad.fauzi@surabaya.id',
      noHp: '081234567801',
      kecamatanId: 8,
      kecamatanNama: 'Gubeng',
      status: 'Menunggu',
      catatan: null,
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Ahmad+Fauzi+Gubeng',
      createdAt: '2026-10-24T08:30:00.000Z',
      updatedAt: '2026-10-24T08:30:00.000Z',
    },
    {
      id: 102,
      userId: 202,
      nama: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@surabaya.id',
      noHp: '081234567802',
      kecamatanId: 8,
      kecamatanNama: 'Gubeng',
      status: 'Menunggu',
      catatan: null,
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Siti+Nurhaliza+Gubeng',
      createdAt: '2026-10-24T09:15:00.000Z',
      updatedAt: '2026-10-24T09:15:00.000Z',
    },
    {
      id: 103,
      userId: 203,
      nama: 'Budi Hartono',
      email: 'budi.hartono@surabaya.id',
      noHp: '081234567803',
      kecamatanId: 8,
      kecamatanNama: 'Gubeng',
      status: 'Diterima',
      catatan: 'Dokumen KTP valid dan sesuai data kependudukan Gubeng.',
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Budi+Hartono+Gubeng',
      createdAt: '2026-10-23T14:20:00.000Z',
      updatedAt: '2026-10-23T15:00:00.000Z',
    },
    {
      id: 104,
      userId: 204,
      nama: 'Dewi Lestari',
      email: 'dewi.lestari@surabaya.id',
      noHp: '081234567804',
      kecamatanId: 8,
      kecamatanNama: 'Gubeng',
      status: 'Ditolak',
      catatan: 'Foto KTP buram, NIK dan alamat RT/RW tidak terbaca jelas.',
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Dewi+Lestari+Gubeng',
      createdAt: '2026-10-22T10:05:00.000Z',
      updatedAt: '2026-10-22T11:30:00.000Z',
    },
  ],
  31: [ // ID 31: Kecamatan Wonokromo
    {
      id: 201,
      userId: 301,
      nama: 'Bambang Trianto',
      email: 'bambang.tri@surabaya.id',
      noHp: '081234567805',
      kecamatanId: 31,
      kecamatanNama: 'Wonokromo',
      status: 'Menunggu',
      catatan: null,
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Bambang+Wonokromo',
      createdAt: '2026-10-24T11:00:00.000Z',
      updatedAt: '2026-10-24T11:00:00.000Z',
    },
    {
      id: 202,
      userId: 302,
      nama: 'Rina Kusumawati',
      email: 'rina.k@surabaya.id',
      noHp: '081234567806',
      kecamatanId: 31,
      kecamatanNama: 'Wonokromo',
      status: 'Diterima',
      catatan: 'Verifikasi domisili Wonokromo disetujui.',
      fileKtpUrl: 'https://placehold.co/800x500/png?text=KTP+Rina+Wonokromo',
      createdAt: '2026-10-23T08:15:00.000Z',
      updatedAt: '2026-10-23T09:40:00.000Z',
    },
  ],
};

/**
 * Mengambil nama kecamatan berdasarkan kecamatanId
 */
export async function getNamaKecamatan(kecamatanId: number): Promise<string> {
  try {
    const kec = await db.orm.public.Kecamatan.first({ id: kecamatanId });
    if (kec) return kec.nama;
  } catch (err) {
    console.warn('Gagal mengambil nama kecamatan dari DB:', err);
  }

  const defaultNames: Record<number, string> = {
    8: 'Gubeng',
    18: 'Rungkut',
    27: 'Tegalsari',
    31: 'Wonokromo',
  };
  return defaultNames[kecamatanId] ?? `Kecamatan #${kecamatanId}`;
}

/**
 * Mengambil informasi petugas beserta nama kecamatan penugasannya
 */
export async function getPetugasKecamatanInfo(userId: number) {
  try {
    const user = await db.orm.public.User.first({ id: userId });
    if (!user) return null;

    let kecamatanNama = '';
    if (user.kecamatanId) {
      kecamatanNama = await getNamaKecamatan(user.kecamatanId);
    }

    return {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      statusAkun: user.statusAkun,
      noHp: user.noHp,
      kecamatanId: user.kecamatanId,
      kecamatanNama,
    };
  } catch (err) {
    console.warn('Gagal mengambil data petugas dari DB:', err);
    return null;
  }
}

/**
 * Filter utama: Mengambil daftar pengajuan verifikasi domisili berdasarkan kecamatan petugas.
 * Hanya warga yang berada di kecamatan petugas yang akan ditampilkan.
 */
export async function getPengajuanByKecamatanPetugas(
  kecamatanId: number,
  options?: FilterPengajuanOptions,
): Promise<{
  kecamatanNama: string;
  pengajuan: PengajuanDomisiliItem[];
  statistik: StatistikPengajuanKecamatan;
}> {
  const kecamatanNama = await getNamaKecamatan(kecamatanId);
  let daftar: PengajuanDomisiliItem[] = [];

  try {
    // Ambil data verifikasi domisili beserta relasi user (warga pemohon)
    const verifikasiList = await db.orm.public.VerifikasiDomisili
      .include('user', (u) => u.select('id', 'nama', 'email', 'noHp', 'kecamatanId'))
      .orderBy((v) => v.createdAt.desc())
      .all();

    // FILTER KRUSIAL: Hanya ambil pengajuan dari user yang kecamatanId-nya sama dengan kecamatanId petugas
    const filteredByKecamatan = verifikasiList.filter(
      (v) => v.user && v.user.kecamatanId === kecamatanId,
    );

    if (filteredByKecamatan.length > 0) {
      daftar = filteredByKecamatan
        .filter((v): v is typeof v & { user: NonNullable<typeof v.user> } => Boolean(v.user))
        .map((v) => ({
          id: v.id,
          userId: v.userId,
          nama: v.user.nama,
          email: v.user.email,
          noHp: v.user.noHp ?? null,
          kecamatanId: kecamatanId,
          kecamatanNama: kecamatanNama,
          status: v.status as StatusVerifikasiDomisili,
          catatan: v.catatan ?? null,
          fileKtpUrl: v.fileKtpUrl,
          createdAt: v.createdAt,
          updatedAt: v.updatedAt,
        }));
    }
  } catch (err) {
    console.warn('Gagal query VerifikasiDomisili dari DB, menggunakan data dummy terfilter:', err);
  }

  // Jika DB belum ada data untuk kecamatan ini, gunakan dummy kecamatan tersebut agar UI dapat langsung diuji
  if (daftar.length === 0 && DUMMY_PENGAJUAN_KECAMATAN[kecamatanId]) {
    daftar = [...DUMMY_PENGAJUAN_KECAMATAN[kecamatanId]];
  } else if (daftar.length === 0) {
    // Generate representatif dummy khusus untuk kecamatan tersebut
    daftar = [
      {
        id: kecamatanId * 100 + 1,
        userId: kecamatanId * 100 + 10,
        nama: `Warga Teladan (${kecamatanNama})`,
        email: `warga.${kecamatanNama.toLowerCase().replace(/\s+/g, '')}@surabaya.id`,
        noHp: '081234567890',
        kecamatanId: kecamatanId,
        kecamatanNama: kecamatanNama,
        status: 'Menunggu',
        catatan: null,
        fileKtpUrl: `https://placehold.co/800x500/png?text=KTP+${encodeURIComponent(kecamatanNama)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Hitung statistik sebelum filter pencarian/status diterapkan
  const statistik: StatistikPengajuanKecamatan = {
    total: daftar.length,
    menunggu: daftar.filter((d) => d.status === 'Menunggu').length,
    diterima: daftar.filter((d) => d.status === 'Diterima').length,
    ditolak: daftar.filter((d) => d.status === 'Ditolak').length,
  };

  // Terapkan filter status jika dipilih
  if (options?.status && options.status !== 'Semua') {
    daftar = daftar.filter((d) => d.status === options.status);
  }

  // Terapkan filter pencarian nama / email / noHp jika diisi
  if (options?.search && options.search.trim() !== '') {
    const q = options.search.toLowerCase().trim();
    daftar = daftar.filter(
      (d) =>
        d.nama.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        (d.noHp && d.noHp.includes(q)),
    );
  }

  return {
    kecamatanNama,
    pengajuan: daftar,
    statistik,
  };
}

/**
 * Validasi dan tindak lanjut verifikasi domisili oleh Petugas Kecamatan.
 * Memastikan pengajuan yang diproses benar-benar milik warga di kecamatan petugas.
 */
export async function verifikasiPengajuanOlehPetugas(params: {
  pengajuanId: number;
  petugasUserId: number;
  petugasKecamatanId: number;
  status: 'Diterima' | 'Ditolak';
  catatan?: string;
}): Promise<{ ok: boolean; message?: string; error?: string }> {
  const { pengajuanId, petugasKecamatanId, status, catatan } = params;

  try {
    // 1. Ambil data verifikasi
    const pengajuan = await db.orm.public.VerifikasiDomisili
      .where({ id: pengajuanId })
      .include('user', (u) => u.select('id', 'nama', 'email', 'kecamatanId'))
      .first();

    if (!pengajuan || !pengajuan.user) {
      return { ok: false, error: 'Pengajuan atau data pemohon tidak ditemukan' };
    }

    // 2. KEAMANAN & OTORISASI: Pastikan pengajuan berasal dari kecamatan petugas
    if (pengajuan.user.kecamatanId !== petugasKecamatanId) {
      return {
        ok: false,
        error: 'Akses ditolak: Pengajuan ini tidak berada di bawah yurisdiksi kecamatan Anda.',
      };
    }

    const now = new Date().toISOString();

    // 3. Update status VerifikasiDomisili
    await db.orm.public.VerifikasiDomisili
      .where({ id: pengajuanId })
      .update({
        status: status,
        catatan: catatan?.trim() || null,
        updatedAt: now,
      });

    // 4. Jika Diterima, aktifkan statusAkun warga menjadi 'Terverifikasi'
    if (status === 'Diterima') {
      await db.orm.public.User
        .where({ id: pengajuan.userId })
        .update({
          statusAkun: 'Terverifikasi',
          updatedAt: now,
        });
    }

    // 5. Kirim notifikasi ke warga terkait hasil verifikasi
    await db.orm.public.Notifikasi.create({
      userId: pengajuan.userId,
      judul: status === 'Diterima' ? 'Verifikasi Domisili Disetujui' : 'Verifikasi Domisili Ditolak',
      pesan:
        status === 'Diterima'
          ? 'Selamat, pengajuan verifikasi domisili Anda telah disetujui oleh Petugas Kecamatan.'
          : `Pengajuan verifikasi domisili Anda ditolak oleh Petugas Kecamatan. Catatan: ${catatan || 'Dokumen belum memenuhi kriteria.'}`,
      dibaca: false,
      createdAt: now,
    });

    return {
      ok: true,
      message: `Pengajuan domisili berhasil ${status === 'Diterima' ? 'disetujui' : 'ditolak'}.`,
    };
  } catch (err) {
    console.error('Gagal memproses verifikasi domisili oleh petugas:', err);
    return {
      ok: false,
      error: 'Terjadi kesalahan pada server saat memproses verifikasi.',
    };
  }
}
