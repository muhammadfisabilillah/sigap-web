import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';
import { KTP_BUCKET, getSignedFileUrl } from '@/src/lib/storage/supabase';
import { formatTanggal } from '@/src/lib/aduan/labels';

export const metadata: Metadata = {
  title: 'Status Pengajuan Domisili',
};

export default function StatusDomisiliPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <StatusDomisili />
    </Suspense>
  );
}

const STATUS_LABEL: Record<string, string> = {
  Menunggu: 'Menunggu verifikasi',
  Diterima: 'Diterima',
  Ditolak: 'Ditolak',
};

async function StatusDomisili() {
  await connection();
  const user = await requireRole('Warga');

  const pengajuan = await db.orm.public.VerifikasiDomisili
    .select('status', 'catatan', 'fileKtpUrl', 'createdAt')
    .where({ userId: user.id })
    .first();

  if (!pengajuan) {
    return (
      <DashboardShell
        user={user}
        title="Status Pengajuan Domisili"
        subtitle="Pantau status verifikasi berkas domisili KTP Kota Surabaya Anda."
      >
        <div className="border border-line bg-card px-5 py-10 text-center">
          <p className="text-sm text-muted">Anda belum mengajukan verifikasi domisili.</p>
          <Link
            href="/domisili"
            className="mt-4 inline-block rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Ajukan verifikasi domisili
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const fileUrl = await getSignedFileUrl(KTP_BUCKET, pengajuan.fileKtpUrl);
  const kecamatan = user.kecamatanId
    ? await db.orm.public.Kecamatan.first({ id: user.kecamatanId })
    : null;

  return (
    <DashboardShell
      user={user}
      title="Status Pengajuan Domisili"
      subtitle="Pantau status verifikasi berkas domisili KTP Kota Surabaya Anda."
    >
      <div className="border border-line bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="text-xs font-medium text-muted">Status pengajuan</p>
            <p className="mt-0.5 text-lg font-semibold text-ink">
              {STATUS_LABEL[pengajuan.status] ?? pengajuan.status}
            </p>
          </div>
          <p className="text-xs text-muted">Diajukan {formatTanggal(pengajuan.createdAt)}</p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted">Nama pemohon</p>
              <p className="mt-1 text-sm text-ink">{user.nama}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Kecamatan</p>
              <p className="mt-1 text-sm text-ink">{kecamatan?.nama ?? '-'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted">Berkas KTP</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
            >
              Lihat berkas yang diunggah
            </a>
            <p className="mt-1 text-xs text-muted">
              Tautan ini hanya berlaku 1 jam dan hanya untuk Anda.
            </p>
          </div>

          {pengajuan.status === 'Ditolak' ? (
            <div className="border-l-2 border-red-500 bg-red-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-red-900">Pengajuan ditolak</h2>
              <p className="mt-1 text-sm text-red-800">
                {pengajuan.catatan ?? 'Silakan unggah ulang berkas KTP yang lebih jelas.'}
              </p>
            </div>
          ) : null}

          {pengajuan.status === 'Menunggu' ? (
            <p className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Berkas Anda sedang ditinjau oleh petugas. Anda tetap dapat mengunggah ulang berkas
              apabila ada perbaikan.
            </p>
          ) : null}

          {pengajuan.status === 'Diterima' ? (
            <p className="border-l-2 border-brand bg-green-50 px-4 py-3 text-sm text-brand">
              Domisili Anda sudah terverifikasi. Akun Anda aktif dan dapat membuat aduan.
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
          <Link
            href="/warga"
            className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
          >
            Kembali ke dasbor
          </Link>
          <Link
            href="/domisili"
            className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
          >
            {pengajuan.status === 'Ditolak' ? 'Pengajuan ulang' : 'Unggah ulang berkas'}
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
