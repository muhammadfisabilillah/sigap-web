import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanList } from '@/src/components/aduan/aduan-list';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';
import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';
import { STATUS_ADUAN_LABEL } from '@/src/lib/aduan/labels';

export const metadata: Metadata = {
  title: 'Kelola Aduan',
};

const FILTERS = [
  { value: '', label: 'Semua status' },
  { value: 'MenungguVerifikasi', label: 'Menunggu verifikasi' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'DiteruskanKecamatan', label: 'Diteruskan ke kecamatan' },
  { value: 'MenungguTinjauan', label: 'Menunggu tinjauan' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditolak', label: 'Ditolak' },
];

export default function AdminAduanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminAduan searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminAduan({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  const user = await requireRole('Admin');
  const { status } = await searchParams;

  const rows = (await db.orm.public.Aduan.all()) as AduanRow[];
  const filtered = status ? rows.filter((r) => r.status === status) : rows;
  const aduan = await enrichAduan(filtered);

  return (
    <DashboardShell
      user={user}
      title="Kelola Aduan"
      subtitle="Periksa aduan masuk, ubah status, dan teruskan ke kecamatan atau instansi."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = (status ?? '') === filter.value;
          const href = filter.value ? `/admin/aduan?status=${filter.value}` : '/admin/aduan';
          return (
            <a
              key={filter.value || 'semua'}
              href={href}
              className={`rounded-md border px-3 py-1.5 text-sm ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-card text-muted hover:text-ink'
              }`}
            >
              {filter.label}
            </a>
          );
        })}
      </div>

      <p className="mb-3 text-sm text-muted">
        {aduan.length} aduan
        {status ? ` dengan status ${STATUS_ADUAN_LABEL[status] ?? status}` : ''}.
      </p>

      <AduanList
        aduan={aduan}
        basePath="/admin/aduan"
        emptyMessage="Tidak ada aduan dengan filter ini."
      />
    </DashboardShell>
  );
}
