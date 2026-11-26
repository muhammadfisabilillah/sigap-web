import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { VerifikasiList } from '@/src/components/verifikasi/verifikasi-list';
import { requireRole } from '@/src/lib/auth/guard';
import { getPengajuanDomisili } from '@/src/lib/verifikasi/query';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Verifikasi Domisili Wilayah',
};

export default function PetugasVerifikasiPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetugasVerifikasi />
    </Suspense>
  );
}

async function PetugasVerifikasi() {
  await connection();
  const user = await requireRole('Petugas');

  const kecamatan = user.kecamatanId
    ? await db.orm.public.Kecamatan.first({ id: user.kecamatanId })
    : null;

  const pengajuan = await getPengajuanDomisili(user);
  const menunggu = pengajuan.filter((p) => p.status === 'Menunggu');
  const selesai = pengajuan.filter((p) => p.status !== 'Menunggu');

  return (
    <DashboardShell
      user={user}
      title="Verifikasi Domisili Wilayah"
      subtitle={
        kecamatan
          ? `Hanya pengajuan warga Kecamatan ${kecamatan.nama} yang tampil di sini.`
          : 'Wilayah kerja belum ditetapkan. Hubungi admin untuk penugasan kecamatan.'
      }
    >
      <h2 className="mb-3 text-sm font-semibold text-ink">
        Menunggu verifikasi ({menunggu.length})
      </h2>
      <VerifikasiList pengajuan={menunggu} />

      {selesai.length > 0 ? (
        <>
          <h2 className="mb-3 mt-8 text-sm font-semibold text-ink">
            Sudah diproses ({selesai.length})
          </h2>
          <VerifikasiList pengajuan={selesai} />
        </>
      ) : null}
    </DashboardShell>
  );
}
