'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export type PengajuanDomisili = {
  status: 'Menunggu' | 'Diterima' | 'Ditolak';
  catatan: string | null;
  diajukanPada: string;
} | null;

type DomisiliFormProps = {
  pengajuan: PengajuanDomisili;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 2 * 1024 * 1024;

const STATUS_META: Record<
  string,
  { label: string; badge: string; panel: string; title: string }
> = {
  Menunggu: {
    label: 'Menunggu verifikasi',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    panel: 'border-amber-200 bg-amber-50',
    title: 'text-amber-900',
  },
  Diterima: {
    label: 'Diterima',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    panel: 'border-emerald-200 bg-emerald-50',
    title: 'text-emerald-900',
  },
  Ditolak: {
    label: 'Ditolak',
    badge: 'bg-red-50 text-red-700 border-red-200',
    panel: 'border-red-200 bg-red-50',
    title: 'text-red-900',
  },
};

export function DomisiliForm({ pengajuan }: DomisiliFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const meta = pengajuan ? STATUS_META[pengajuan.status] : null;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccess(null);

    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      event.target.value = '';
      setError('Jenis berkas harus JPG, PNG, atau PDF.');
      return;
    }
    if (selected.size > MAX_SIZE) {
      setFile(null);
      event.target.value = '';
      setError('Ukuran berkas maksimal 2 MB.');
      return;
    }
    if (selected.size === 0) {
      setFile(null);
      event.target.value = '';
      setError('Berkas kosong. Pilih berkas lain.');
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    if (!file) {
      setError('Pilih berkas KTP terlebih dahulu.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/domisili', { method: 'POST', body });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal mengirim berkas. Silakan coba lagi.');
        return;
      }

      setSuccess(data.message ?? 'Pengajuan verifikasi domisili terkirim.');
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Periksa jaringan Anda dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status pengajuan
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {pengajuan
                ? `Diajukan pada ${formatDate(pengajuan.diajukanPada)}`
                : 'Belum ada berkas domisili yang diajukan.'}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              meta ? meta.badge : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            {meta ? meta.label : 'Belum diajukan'}
          </span>
        </div>

        {pengajuan?.status === 'Ditolak' ? (
          <div className={`mt-4 rounded-xl border p-4 ${meta?.panel}`}>
            <h2 className={`text-sm font-semibold ${meta?.title}`}>Pengajuan ditolak</h2>
            <p className="mt-1 text-sm text-red-700">
              {pengajuan.catatan ?? 'Silakan unggah ulang berkas KTP yang lebih jelas.'}
            </p>
          </div>
        ) : null}

        {pengajuan?.status === 'Menunggu' ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Berkas Anda sedang ditinjau oleh petugas. Anda tetap dapat mengunggah ulang berkas
            apabila ada perbaikan.
          </p>
        ) : null}

        {pengajuan?.status === 'Diterima' ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Domisili Anda sudah terverifikasi. Akun akan aktif setelah status akun diperbarui oleh
            petugas.
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          {pengajuan ? 'Unggah ulang berkas KTP' : 'Unggah berkas KTP'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Format JPG, PNG, atau PDF. Ukuran maksimal 2 MB. Pastikan seluruh bagian KTP terbaca
          jelas.
        </p>

        {error ? (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            role="status"
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {success}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-slate-700">
              Berkas KTP
            </label>
            <input
              ref={inputRef}
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {file ? (
              <p className="mt-1.5 text-xs text-slate-500">
                Dipilih: <span className="font-medium text-slate-700">{file.name}</span> (
                {formatSize(file.size)})
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading || !file}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#183B7E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#132F66] focus:outline-none focus:ring-2 focus:ring-[#183B7E]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Mengunggah...' : pengajuan ? 'Kirim ulang pengajuan' : 'Kirim pengajuan'}
          </button>
        </form>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
