import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { ModuleCard, StatCard } from '@/src/components/dashboard/dashboard-cards';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { requireRole } from '@/src/lib/auth/guard';
import { getPengajuanDomisili } from '@/src/lib/verifikasi/query';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Dasbor Petugas',
};

export default function PetugasPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PetugasDashboard />
    </Suspense>
  );
}

const STATUS_AKTIF = new Set(['DiteruskanKecamatan', 'MenungguTinjauan']);

async function PetugasDashboard() {
  await connection();
  const user = await requireRole('Petugas');

  const kecamatan = user.kecamatanId
    ? await db.orm.public.Kecamatan.first({ id: user.kecamatanId })
    : null;

  const aduanWilayah = user.kecamatanId
    ? await db.orm.public.Aduan.where({ kecamatanId: user.kecamatanId }).all()
    : [];

  const aduanAktif = aduanWilayah.filter((aduan) => STATUS_AKTIF.has(aduan.status));
  const domisiliMenunggu = user.kecamatanId
    ? (await getPengajuanDomisili(user, 'Menunggu')).length
    : 0;

  return (
    <DashboardShell
      user={user}
      title="Dasbor Petugas Kecamatan"
      subtitle={
        kecamatan
          ? `Wilayah kerja: Kecamatan ${kecamatan.nama}.`
          : 'Wilayah kerja belum ditetapkan. Hubungi admin untuk penugasan kecamatan.'
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Aduan wilayah"
          value={aduanWilayah.length}
          hint={kecamatan ? `Kecamatan ${kecamatan.nama}` : 'Belum ada wilayah'}
        />
        <StatCard
          label="Perlu tindak lanjut"
          value={aduanAktif.length}
          tone="warning"
          hint="Aduan yang diteruskan ke kecamatan."
        />
        <StatCard
          label="Verifikasi domisili"
          value={domisiliMenunggu}
          hint="Pengajuan warga wilayah Anda yang menunggu."
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ModuleCard
          index={0}
          title="Aduan wilayah"
          description="Lihat aduan yang masuk ke kecamatan Anda dan perbarui progres penanganan lapangan."
          href="/petugas/aduan"
          cta="Lihat aduan wilayah"
        />
        <ModuleCard
          index={1}
          title="Validasi domisili"
          description="Validasi kebenaran domisili warga di wilayah kecamatan Anda."
          href="/petugas/verifikasi-domisili"
          cta="Verifikasi sekarang"
        />
        <ModuleCard
          index={2}
          title="Riwayat tindak lanjut"
          description="Jejak perubahan status aduan yang Anda tangani. Tersedia di detail tiap aduan."
        />
        <ModuleCard
          index={3}
          title="Notifikasi"
          description="Pemberitahuan aduan baru yang diteruskan ke wilayah Anda."
        />
      </div>
    </DashboardShell>
  );
}
