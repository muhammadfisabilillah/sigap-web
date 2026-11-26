import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import {
  DomisiliForm,
  type PengajuanDomisili,
} from '@/src/components/domisili/domisili-form';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Verifikasi Domisili',
};

export default function DomisiliPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DomisiliDashboard />
    </Suspense>
  );
}

async function DomisiliDashboard() {
  await connection();
  const user = await requireRole('Warga');

  const pengajuan = await db.orm.public.VerifikasiDomisili
    .select('status', 'catatan', 'createdAt')
    .where({ userId: user.id })
    .first();

  const data: PengajuanDomisili = pengajuan
    ? {
        status: pengajuan.status,
        catatan: pengajuan.catatan ?? null,
        diajukanPada: pengajuan.createdAt,
      }
    : null;

  return (
    <DashboardShell
      user={user}
      title="Verifikasi Domisili"
      subtitle="Unggah KTP agar petugas kecamatan dapat memverifikasi domisili Anda."
    >
      <DomisiliForm pengajuan={data} />
    </DashboardShell>
  );
}
