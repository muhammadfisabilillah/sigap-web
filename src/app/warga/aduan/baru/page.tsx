import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { AduanForm } from '@/src/components/aduan/aduan-form';
import { requireRole, getVerifiedWarga } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Buat Aduan Baru',
};

export default function BuatAduanPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <BuatAduan />
    </Suspense>
  );
}

async function BuatAduan() {
  await connection();
  const user = await requireRole('Warga');
  const verified = await getVerifiedWarga();

  if (!verified) {
    return (
      <DashboardShell
        user={user}
        title="Buat Aduan Baru"
        subtitle="Akun Anda perlu terverifikasi sebelum dapat membuat aduan."
      >
        <div className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Akun Anda belum terverifikasi. Selesaikan verifikasi domisili terlebih dahulu, lalu
          kembali ke halaman ini.
        </div>
        <Link
          href="/domisili"
          className="mt-4 inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Ke verifikasi domisili
        </Link>
      </DashboardShell>
    );
  }

  const [kategoriRows, kecamatanRows] = await Promise.all([
    db.orm.public.Kategori.all(),
    db.orm.public.Kecamatan.all(),
  ]);

  const kategori = kategoriRows
    .map((row) => ({ id: row.id, nama: row.nama }))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  const kecamatan = kecamatanRows
    .map((row) => ({ id: row.id, nama: row.nama }))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  return (
    <DashboardShell
      user={user}
      title="Buat Aduan Baru"
      subtitle="Ceritakan persoalan di lingkungan Anda. Petugas akan menindaklanjuti laporan ini."
    >
      <div className="border border-line bg-card p-5 sm:p-6">
        <AduanForm
          kategori={kategori}
          kecamatan={kecamatan}
          defaultKecamatanId={user.kecamatanId ?? null}
        />
      </div>
    </DashboardShell>
  );
}
