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
import { PetugasTindakLanjutForm } from '@/src/components/aduan/petugas-tindak-lanjut-form';

export const metadata: Metadata = {
  title: 'Detail Aduan — Petugas',
};

export default function PetugasDetailAduanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetugasDetailAduan params={params} />
    </Suspense>
  );
}

async function PetugasDetailAduan({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const user = await requireRole('Petugas');
  const { id } = await params;
  const aduanId = Number(id);

  const row = Number.isInteger(aduanId)
    ? ((await db.orm.public.Aduan.first({ id: aduanId })) as AduanRow | null)
    : null;

  if (!row) {
    return (
      <DashboardShell user={user} title="Detail Aduan" subtitle="Aduan tidak ditemukan.">
        <p className="text-sm text-muted">Aduan dengan ID tersebut tidak ditemukan.</p>
        <Link href="/petugas/aduan" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          Kembali ke aduan wilayah
        </Link>
      </DashboardShell>
    );
  }

  if (row.kecamatanId !== user.kecamatanId) {
    return (
      <DashboardShell user={user} title="Detail Aduan" subtitle="Di luar wilayah kerja.">
        <p className="text-sm text-muted">
          Aduan ini di luar wilayah kerja Anda dan tidak dapat dibuka.
        </p>
        <Link href="/petugas/aduan" className="mt-3 inline-block text-sm font-medium text-brand hover:underline">
          Kembali ke aduan wilayah
        </Link>
      </DashboardShell>
    );
  }

  const [item] = await enrichAduan([row]);
  const riwayat = await db.orm.public.RiwayatStatus.where({ aduanId }).all();
  const isFinal = item.status === 'Selesai' || item.status === 'Ditolak';

  return (
    <DashboardShell
      user={user}
      title={item.judul}
      subtitle={`${item.nomorTiket} · Kec. ${item.kecamatanNama} · ${item.kategoriNama}`}
    >
      <Link href="/petugas/aduan" className="mb-5 inline-block text-sm font-medium text-brand hover:underline">
        ← Kembali ke aduan wilayah
      </Link>

      <AduanDetailBody
        item={item}
        riwayat={riwayat}
        actionTitle="Catat tindak lanjut"
        action={
          isFinal ? (
            <p className="text-sm text-muted">
              Aduan ini sudah selesai dan tidak dapat ditindaklanjuti lagi.
            </p>
          ) : (
            <PetugasTindakLanjutForm aduanId={item.id} />
          )
        }
      />
    </DashboardShell>
  );
}
