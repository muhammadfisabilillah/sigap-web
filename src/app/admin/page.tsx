import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { ModuleCard, StatCard } from '@/src/components/dashboard/dashboard-cards';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Dasbor Admin',
};

export default function AdminPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  await connection();
  const user = await requireRole('Admin');

  const [domisiliMenunggu, aduanMenunggu, warga] = await Promise.all([
    db.orm.public.VerifikasiDomisili.where({ status: 'Menunggu' }).all(),
    db.orm.public.Aduan.where({ status: 'MenungguVerifikasi' }).all(),
    db.orm.public.User.where({ role: 'Warga' }).all(),
  ]);

  return (
    <DashboardShell
      user={user}
      title="Dasbor Admin"
      subtitle="Verifikasi domisili warga dan kelola aduan yang masuk ke pemerintah kota."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Domisili menunggu"
          value={domisiliMenunggu.length}
          tone="warning"
          hint="Berkas KTP yang perlu ditinjau."
        />
        <StatCard
          label="Aduan baru"
          value={aduanMenunggu.length}
          tone="warning"
          hint="Aduan berstatus menunggu verifikasi."
        />
        <StatCard label="Total warga" value={warga.length} hint="Akun warga terdaftar." />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ModuleCard
          title="Verifikasi domisili"
          description="Tinjau berkas KTP warga, terima atau tolak pengajuan beserta catatannya."
          href="/admin/verifikasi-domisili"
          cta="Verifikasi sekarang"
        />
        <ModuleCard
          title="Kelola aduan"
          description="Periksa kelayakan aduan, teruskan ke instansi atau petugas kecamatan."
          href="/admin/aduan"
          cta="Kelola aduan"
        />
        <ModuleCard
          title="Data instansi"
          description="Kelola daftar instansi tujuan penerusan aduan."
        />
        <ModuleCard
          title="Laporan & statistik"
          description="Rekap aduan per kategori, kecamatan, dan status penanganan."
        />
      </div>
    </DashboardShell>
  );
}
