import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanList } from '@/src/components/aduan/aduan-list';
import { requireRole } from '@/src/lib/auth/guard';
import { getAduanPublik } from '@/src/lib/aduan/query';

export const metadata: Metadata = {
  title: 'Laporan Publik',
};

export default function LaporanPublikPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LaporanPublik />
    </Suspense>
  );
}

async function LaporanPublik() {
  await connection();
  const user = await requireRole('Warga');
  const aduan = await getAduanPublik();

  return (
    <DashboardShell
      user={user}
      title="Laporan Publik"
      subtitle="Aduan dari warga Surabaya. Klik aduan untuk melihat detail dan riwayat penanganannya."
    >
      <div className="mb-4 flex justify-end">
        <Link
          href="/warga/aduan/baru"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Buat aduan baru
        </Link>
      </div>
      <AduanList aduan={aduan} emptyMessage="Belum ada laporan publik." />
    </DashboardShell>
  );
}
