import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { ProfilForm } from '@/src/components/profil/profil-form';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Profil Saya',
};

const STATUS_META: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  BelumTerverifikasi: {
    label: 'Belum terverifikasi',
    badgeClass: 'border-amber-300 bg-amber-50 text-amber-800',
    dotClass: 'bg-amber-500',
  },
  MenungguVerifikasi: {
    label: 'Menunggu verifikasi',
    badgeClass: 'border-sky-300 bg-sky-50 text-sky-800',
    dotClass: 'bg-sky-500',
  },
  Terverifikasi: {
    label: 'Terverifikasi',
    badgeClass: 'border-brand/40 bg-brand-soft text-brand',
    dotClass: 'bg-brand',
  },
};

export default function ProfilPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Profil />
    </Suspense>
  );
}


async function Profil() {
  await connection();
  const user = await requireRole('Warga');

  const [kecamatanRows, freshUser] = await Promise.all([
    db.orm.public.Kecamatan.all(),
    db.orm.public.User.first({ id: user.id }),
  ]);

  const kecamatan = kecamatanRows
    .map((row) => ({ id: row.id, nama: row.nama }))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  const kecamatanNama = kecamatan.find(
    (item) => item.id === (freshUser?.kecamatanId ?? user.kecamatanId),
  )?.nama;

  const statusMeta = STATUS_META[user.statusAkun] ?? STATUS_META.BelumTerverifikasi;

  return (
    <DashboardShell
      user={user}
      title="Profil Saya"
      subtitle="Kelola identitas dan kecamatan Anda."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Identitas */}
        <section className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm lg:col-span-2">
          <div className="relative h-36">
            <Image
              src="/images/Surabaya.jpg"
              alt="Ikon Kota Surabaya"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[50%_50%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08192b]/90 via-[#08192b]/30 to-transparent" />
          </div>

          <div className="-mt-8 p-5 sm:p-6">
            <h2 className="mt-0 text-xl font-bold leading-tight text-ink">{user.nama}</h2>
            <p className="mt-0.5 text-sm text-muted">{user.email}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium text-muted">
                Warga
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${statusMeta.badgeClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                {statusMeta.label}
              </span>
            </div>

            <dl className="mt-5 w-full space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">NIK</dt>
                <dd className="font-mono font-medium text-ink">
                  {freshUser?.nik?.trim() || 'Belum diisi'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Kecamatan</dt>
                <dd className="font-medium text-ink">
                  {kecamatanNama ?? 'Belum diatur'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Nomor HP</dt>
                <dd className="font-medium text-ink">
                  {freshUser?.noHp?.trim() || 'Belum diisi'}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Form edit */}
        <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6 lg:col-span-3">
          <h2 className="text-base font-bold text-ink">Edit profil</h2>
          <p className="mt-1 text-sm text-muted">
            Pastikan kecamatan sesuai KTP Anda — petugas akan memvalidasinya saat verifikasi.
          </p>
          <div className="mt-5">
            <ProfilForm
              kecamatan={kecamatan}
              initialKecamatanId={freshUser?.kecamatanId ?? user.kecamatanId ?? null}
              initialNoHp={freshUser?.noHp ?? ''}
              initialNik={freshUser?.nik ?? ''}
            />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
