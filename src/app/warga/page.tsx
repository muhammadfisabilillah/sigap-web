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
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-900">Verifikasi domisili ditolak</h2>
          <p className="mt-1 text-sm text-red-700">
            {pengajuan.catatan ?? 'Silakan ajukan ulang dengan berkas KTP yang lebih jelas.'}
          </p>
          <a
            href="/domisili"
            className="mt-3 inline-flex rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
          >
            Ajukan ulang
          </a>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ModuleCard
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
          title="Buat aduan baru"
          description="Laporkan masalah di lingkungan Anda lengkap dengan foto dan titik lokasi GPS."
        />
        <ModuleCard
          title="Aduan saya"
          description="Riwayat dan progres penanganan aduan yang pernah Anda kirim."
        />
        <ModuleCard
          title="Laporan publik"
          description="Dukung aduan warga sekecamatan dengan upvote dan pantau yang mendesak."
        />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Langkah mengaktifkan akun</h2>
        <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
          <Step done label="Daftar akun SIGAP" />
          <Step done={Boolean(pengajuan)} label="Ajukan verifikasi domisili (unggah KTP)" />
          <Step
            done={pengajuan?.status === 'Diterima'}
            label="Petugas kecamatan memverifikasi domisili"
          />
          <Step
            done={user.statusAkun === 'Terverifikasi'}
            label="Akun aktif — Anda dapat membuat aduan"
          />
        </ol>
      </div>
    </DashboardShell>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
        }`}
        aria-hidden="true"
      >
        {done ? '✓' : '•'}
      </span>
      <span className={done ? 'text-slate-700' : 'text-slate-500'}>{label}</span>
    </li>
  );
}
