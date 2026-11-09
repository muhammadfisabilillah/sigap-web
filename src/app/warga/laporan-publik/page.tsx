import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanList } from '@/src/components/aduan/aduan-list';
import { AduanMap } from '@/src/components/map/aduan-map';
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
      <section className="mb-6 border border-line bg-card p-4 sm:p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink">Peta aduan</h2>
        <p className="mb-3 text-xs text-muted">
          Titik-titik aduan warga Surabaya. Klik titik untuk melihat ringkasannya.
        </p>
        <AduanMap
          points={aduan.map((item) => ({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            judul: item.judul,
            nomorTiket: item.nomorTiket,
            kecamatanNama: item.kecamatanNama,
            href: `/warga/aduan/${item.id}`,
          }))}
          height={320}
        />
      </section>

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
