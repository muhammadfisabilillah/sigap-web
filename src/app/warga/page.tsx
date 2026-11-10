import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { ModuleCard, StatCard } from '@/src/components/dashboard/dashboard-cards';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { ActivationTimeline } from '@/src/components/dashboard/activation-timeline';
import { requireRole } from '@/src/lib/auth/guard';
import { db } from '@/src/prisma/db';

export const metadata: Metadata = {
  title: 'Dasbor Warga',
};

export default function WargaPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <WargaDashboard />
    </Suspense>
  );
}

const STATUS_AKUN_LABEL: Record<string, string> = {
  BelumTerverifikasi: 'Belum terverifikasi',
  MenungguVerifikasi: 'Menunggu verifikasi',
  Terverifikasi: 'Terverifikasi',
};

const STATUS_DOMISILI_LABEL: Record<string, string> = {
  Menunggu: 'Menunggu verifikasi',
  Diterima: 'Diterima',
  Ditolak: 'Ditolak',
};

async function WargaDashboard() {
  await connection();
  const user = await requireRole('Warga');

  const [pengajuan, aduanSaya] = await Promise.all([
    db.orm.public.VerifikasiDomisili
      .select('status', 'catatan', 'createdAt')
      .where({ userId: user.id })
      .first(),
    db.orm.public.Aduan.where({ pelaporId: user.id }).all(),
  ]);

  const domisiliLabel = pengajuan
    ? (STATUS_DOMISILI_LABEL[pengajuan.status] ?? pengajuan.status)
    : 'Belum diajukan';

  const isVerified = user.statusAkun === 'Terverifikasi';

  return (
    <DashboardShell
      user={user}
      title={`Selamat datang, ${user.nama.split(' ')[0]}`}
      subtitle="Pantau status akun, verifikasi domisili, dan aduan Anda dari satu tempat."
      cta={
        isVerified
          ? { label: 'Buat Aduan Sekarang', href: '/warga/aduan/baru' }
          : { label: 'Verifikasi Domisili', href: '/domisili' }
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Status akun"
          value={STATUS_AKUN_LABEL[user.statusAkun] ?? user.statusAkun}
          tone={user.statusAkun === 'Terverifikasi' ? 'success' : 'warning'}
          hint="Akun terverifikasi dapat membuat aduan."
        />
        <StatCard
          label="Verifikasi domisili"
          value={domisiliLabel}
          tone={pengajuan?.status === 'Diterima' ? 'success' : 'warning'}
          hint={pengajuan ? 'Berkas KTP sedang/sudah ditinjau.' : 'Unggah KTP untuk memulai.'}
        />
        <StatCard
          label="Aduan saya"
          value={aduanSaya.length}
          hint="Total aduan yang Anda buat."
        />
      </div>

      {pengajuan?.status === 'Ditolak' ? (
        <div className="mt-6 border-l-2 border-red-500 bg-red-50 px-4 py-3">
          <h2 className="text-sm font-semibold text-red-900">Verifikasi domisili ditolak</h2>
          <p className="mt-1 text-sm text-red-800">
            {pengajuan.catatan ?? 'Silakan ajukan ulang dengan berkas KTP yang lebih jelas.'}
          </p>
          <a href="/domisili" className="mt-3 inline-block text-sm font-medium text-brand underline">
            Ajukan ulang
          </a>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">        <ModuleCard
          index={0}
          title={pengajuan ? 'Status verifikasi domisili' : 'Ajukan verifikasi domisili'}
          description={
            pengajuan
              ? 'Lihat status peninjauan berkas KTP Anda dan ajukan ulang bila diperlukan.'
              : 'Unggah foto KTP agar akun Anda dapat diverifikasi oleh petugas kecamatan.'
          }
          href="/domisili"
          cta={pengajuan ? 'Lihat status' : 'Mulai verifikasi'}
        />
        <ModuleCard
          index={1}
          title="Buat aduan baru"
          description="Laporkan masalah di lingkungan Anda lengkap dengan foto dan titik lokasi GPS."
          href="/warga/aduan/baru"
          cta="Buat aduan"
        />
        <ModuleCard
          index={2}
          title="Aduan saya"
          description="Riwayat dan progres penanganan aduan yang pernah Anda kirim."
          href="/warga/aduan"
          cta="Lihat aduan saya"
        />
        <ModuleCard
          index={3}
          title="Laporan publik"
          description="Lihat aduan dari warga Surabaya dan pantau penanganannya."
          href="/warga/laporan-publik"
          cta="Lihat laporan publik"
        />
      </div>

      <div className="mt-8">
        <ActivationTimeline
          steps={[
            { label: 'Daftar akun SIGAP', done: true },
            { label: 'Ajukan verifikasi domisili', done: Boolean(pengajuan) },
            { label: 'Petugas memverifikasi domisili', done: pengajuan?.status === 'Diterima' },
            { label: 'Akun aktif — bisa buat aduan', done: isVerified },
          ]}
        />
      </div>
    </DashboardShell>
  );
}


