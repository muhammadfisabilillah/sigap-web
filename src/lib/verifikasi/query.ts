import { db } from '@/src/prisma/db';
import type { SessionUser } from '@/src/lib/auth/session';
import { KTP_BUCKET, getSignedFileUrl } from '@/src/lib/storage/supabase';

export type PengajuanItem = {
  id: number;
  userId: number;
  nama: string;
  email: string;
  kecamatanNama: string;
  fileKtpUrl: string;
  status: string;
  catatan: string | null;
  createdAt: string;
};

export async function getPengajuanDomisili(
  viewer: SessionUser,
  statusFilter?: string,
): Promise<PengajuanItem[]> {
  const [pengajuanList, userList, kecamatanList] = await Promise.all([
    db.orm.public.VerifikasiDomisili.all(),
    db.orm.public.User.all(),
    db.orm.public.Kecamatan.all(),
  ]);

  const userMap = new Map(userList.map((u) => [u.id, u]));
  const kecamatanMap = new Map(kecamatanList.map((k) => [k.id, k.nama]));

  const filtered = pengajuanList
    .filter((p) => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (viewer.role === 'Petugas') {
        const owner = userMap.get(p.userId);
        return owner?.kecamatanId === viewer.kecamatanId;
      }
      return true;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return Promise.all(
    filtered.map(async (p) => {
      const owner = userMap.get(p.userId);
      return {
        id: p.id,
        userId: p.userId,
        nama: owner?.nama ?? '-',
        email: owner?.email ?? '-',
        kecamatanNama: owner?.kecamatanId
          ? (kecamatanMap.get(owner.kecamatanId) ?? '-')
          : '-',
        fileKtpUrl: await getSignedFileUrl(KTP_BUCKET, p.fileKtpUrl),
        status: p.status,
        catatan: p.catatan ?? null,
        createdAt: p.createdAt,
      };
    }),
  );
}
