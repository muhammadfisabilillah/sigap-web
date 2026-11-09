import type { Metadata } from 'next';
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

const STATUS_AKUN_LABEL: Record<string, string> = {
  BelumTerverifikasi: 'Belum terverifikasi',
  MenungguVerifikasi: 'Menunggu verifikasi',
  Terverifikasi: 'Terverifikasi',
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

  return (
    <DashboardShell
      user={user}
      title="Profil Saya"
      subtitle="Lengkapi kecamatan agar Anda dapat mendukung aduan warga di wilayah Anda."
    >
      <div className="max-w-xl border border-line bg-card p-5 sm:p-6">
        <dl className="mb-6 grid grid-cols-1 gap-4 border-b border-line pb-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted">Nama</dt>
            <dd className="mt-1 text-sm text-ink">{user.nama}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Email</dt>
            <dd className="mt-1 text-sm text-ink">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Peran</dt>
            <dd className="mt-1 text-sm text-ink">Warga</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Status akun</dt>
            <dd className="mt-1 text-sm text-ink">
              {STATUS_AKUN_LABEL[user.statusAkun] ?? user.statusAkun}
            </dd>
          </div>
        </dl>

        <ProfilForm
          kecamatan={kecamatan}
          initialKecamatanId={freshUser?.kecamatanId ?? user.kecamatanId ?? null}
          initialNoHp={freshUser?.noHp ?? ''}
        />
      </div>
    </DashboardShell>
  );
}
