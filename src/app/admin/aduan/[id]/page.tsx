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
import { AdminStatusForm } from '@/src/components/aduan/admin-status-form';

export const metadata: Metadata = {
  title: 'Detail Aduan — Admin',
};

export default function AdminDetailAduanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminDetailAduan params={params} />
    </Suspense>
  );
}

async function AdminDetailAduan({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const user = await requireRole('Admin');
  const { id } = await params;
  const aduanId = Number(id);

  const row = Number.isInteger(aduanId)
    ? ((await db.orm.public.Aduan.first({ id: aduanId })) as AduanRow | null)
    : null;

  if (!row) {
    return (
      <DashboardShell user={user} title="Detail Aduan" subtitle="Aduan tidak ditemukan.">
        <p className="text-sm text-muted">Aduan dengan ID tersebut tidak ditemukan.</p>
        <Link href="/admin/aduan" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          Kembali ke daftar aduan
        </Link>
      </DashboardShell>
    );
  }

  const [item] = await enrichAduan([row]);
  const riwayat = await db.orm.public.RiwayatStatus.where({ aduanId }).all();
  const instansiRows = await db.orm.public.Instansi.all();
  const instansi = instansiRows
    .map((r) => ({ id: r.id, nama: r.nama }))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  const isFinal = item.status === 'Selesai' || item.status === 'Ditolak';

  return (
    <DashboardShell
      user={user}
      title={item.judul}
      subtitle={`${item.nomorTiket} · Kec. ${item.kecamatanNama} · ${item.kategoriNama}`}
    >
      <Link href="/admin/aduan" className="mb-5 inline-block text-sm font-medium text-brand hover:underline">
        ← Kembali ke daftar aduan
      </Link>

      <AduanDetailBody
        item={item}
        riwayat={riwayat}
        actionTitle="Ubah status aduan"
        action={
          isFinal ? (
            <p className="text-sm text-muted">
              Aduan ini sudah selesai dan tidak dapat diubah lagi.
            </p>
          ) : (
            <AdminStatusForm aduanId={item.id} instansi={instansi} />
          )
        }
      />
    </DashboardShell>
  );
}
