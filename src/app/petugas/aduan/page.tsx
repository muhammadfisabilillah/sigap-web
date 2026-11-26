import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanList } from '@/src/components/aduan/aduan-list';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';
import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';

export const metadata: Metadata = {
  title: 'Aduan Wilayah',
};

export default function PetugasAduanPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetugasAduan />
    </Suspense>
  );
}

async function PetugasAduan() {
  await connection();
  const user = await requireRole('Petugas');

  const kecamatan = user.kecamatanId
    ? await db.orm.public.Kecamatan.first({ id: user.kecamatanId })
    : null;

  const rows = user.kecamatanId
    ? ((await db.orm.public.Aduan.where({ kecamatanId: user.kecamatanId }).all()) as AduanRow[])
    : [];
  const aduan = await enrichAduan(rows);

  return (
    <DashboardShell
      user={user}
      title="Aduan Wilayah"
      subtitle={
        kecamatan
          ? `Aduan yang masuk ke Kecamatan ${kecamatan.nama}. Klik aduan untuk mencatat tindak lanjut.`
          : 'Wilayah kerja belum ditetapkan. Hubungi admin untuk penugasan kecamatan.'
      }
    >
      <AduanList
        aduan={aduan}
        basePath="/petugas/aduan"
        emptyMessage="Belum ada aduan di wilayah Anda."
      />
    </DashboardShell>
  );
}
