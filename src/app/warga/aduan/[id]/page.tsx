import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';
import { enrichAduan, type AduanRow } from '@/src/lib/aduan/query';
import { AduanDetailBody } from '@/src/components/aduan/aduan-detail-body';

export const metadata: Metadata = {
  title: 'Detail Aduan',
};

export default function DetailAduanPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DetailAduan params={params} />
    </Suspense>
  );
}

async function DetailAduan({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const user = await requireRole('Warga');
  const { id } = await params;
  const aduanId = Number(id);

  const row = Number.isInteger(aduanId)
    ? ((await db.orm.public.Aduan.first({ id: aduanId })) as AduanRow | null)
    : null;

  if (!row) {
    return (
      <DashboardShell user={user} title="Detail Aduan" subtitle="Aduan tidak ditemukan.">
        <p className="text-sm text-muted">Aduan dengan ID tersebut tidak ditemukan.</p>
        <Link href="/warga/aduan" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          Kembali ke Aduan Saya
        </Link>
      </DashboardShell>
    );
  }

  const [item] = await enrichAduan([row]);
  const riwayat = await db.orm.public.RiwayatStatus.where({ aduanId }).all();

  return (
    <DashboardShell
      user={user}
      title={item.judul}
      subtitle={`${item.nomorTiket} · Kec. ${item.kecamatanNama} · ${item.kategoriNama}`}
    >
      <Link href="/warga/aduan" className="mb-5 inline-block text-sm font-medium text-brand hover:underline">
        ← Kembali ke Aduan Saya
      </Link>

      <AduanDetailBody item={item} riwayat={riwayat} />
    </DashboardShell>
  );
}
