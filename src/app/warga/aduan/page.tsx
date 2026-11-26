import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanList } from '@/src/components/aduan/aduan-list';
import { requireRole } from '@/src/lib/auth/guard';
import { getAduanSaya } from '@/src/lib/aduan/query';

export const metadata: Metadata = {
  title: 'Aduan Saya',
};

export default function AduanSayaPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AduanSaya />
    </Suspense>
  );
}

async function AduanSaya() {
  await connection();
  const user = await requireRole('Warga');
  const aduan = await getAduanSaya(user.id);

  return (
    <DashboardShell
      user={user}
      title="Aduan Saya"
      subtitle="Semua aduan yang pernah Anda kirim beserta status penanganannya."
    >
      <div className="mb-4 flex justify-end">
        <Link
          href="/warga/aduan/baru"
          className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Buat aduan baru
        </Link>
      </div>
      <AduanList aduan={aduan} emptyMessage="Anda belum membuat aduan apa pun." />
    </DashboardShell>
  );
}
