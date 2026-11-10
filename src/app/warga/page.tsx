import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { ModuleCard, StatCard } from '@/src/components/dashboard/dashboard-cards';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
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

  return (
    <DashboardShell
      user={user}
      title={`Selamat datang, ${user.nama.split(' ')[0]}`}
      subtitle="Pantau status akun, verifikasi domisili, dan aduan Anda dari satu tempat."
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

      <div className="mt-8 border border-line bg-card p-5">
        <h2 className="text-sm font-semibold">Langkah mengaktifkan akun</h2>
        <ol className="mt-3 space-y-2.5 text-sm text-muted">
          <Step n={1} done label="Daftar akun SIGAP" />
          <Step n={2} done={Boolean(pengajuan)} label="Ajukan verifikasi domisili (unggah KTP)" />
          <Step
            n={3}
            done={pengajuan?.status === 'Diterima'}
            label="Petugas kecamatan memverifikasi domisili"
          />
          <Step
            n={4}
            done={user.statusAkun === 'Terverifikasi'}
            label="Akun aktif — Anda dapat membuat aduan"
          />
        </ol>
      </div>
    </DashboardShell>
  );
}

function Step({ n, done, label }: { n: number; done: boolean; label: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center text-[11px] font-semibold ${
          done ? 'bg-brand text-white' : 'border border-line text-muted'
        }`}
        aria-hidden="true"
      >
        {done ? '✓' : n}
      </span>
      <span className={done ? 'text-ink' : ''}>{label}</span>
    </li>
  );
}
