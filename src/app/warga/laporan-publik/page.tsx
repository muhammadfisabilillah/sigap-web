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

export default function LaporanPublikPage({
  searchParams,
}: {
  searchParams: Promise<{ urut?: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LaporanPublik searchParams={searchParams} />
    </Suspense>
  );
}

async function LaporanPublik({
  searchParams,
}: {
  searchParams: Promise<{ urut?: string }>;
}) {
  await connection();
  const user = await requireRole('Warga');
  const { urut } = await searchParams;
  const byUpvote = urut === 'dukungan';

  const semua = await getAduanPublik();
  const aduan = byUpvote
    ? semua.slice().sort((a, b) => b.totalUpvote - a.totalUpvote)
    : semua;

  return (
    <DashboardShell
      user={user}
      title="Laporan Publik"
      subtitle="Aduan dari warga Surabaya. Dukung aduan penting di kecamatan Anda agar diprioritaskan."
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Link
            href="/warga/laporan-publik"
            className={`rounded-md border px-3 py-1.5 text-sm ${
              !byUpvote
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-card text-muted hover:text-ink'
            }`}
          >
            Terbaru
          </Link>
          <Link
            href="/warga/laporan-publik?urut=dukungan"
            className={`rounded-md border px-3 py-1.5 text-sm ${
              byUpvote
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-card text-muted hover:text-ink'
            }`}
          >
            Paling banyak dukungan
          </Link>
        </div>
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
