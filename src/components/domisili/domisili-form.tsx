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

const STATUS_META: Record<string, { label: string }> = {
  Menunggu: { label: 'Menunggu verifikasi' },
  Diterima: { label: 'Diterima' },
  Ditolak: { label: 'Ditolak' },
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
      <div className="border border-line bg-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium text-muted">Status pengajuan</p>
            <p className="mt-1 text-sm text-muted">
              {pengajuan
                ? `Diajukan pada ${formatDate(pengajuan.diajukanPada)}`
                : 'Belum ada berkas domisili yang diajukan.'}
            </p>
          </div>
          <p className="text-sm font-semibold text-ink">{meta ? meta.label : 'Belum diajukan'}</p>
        </div>

        {pengajuan?.status === 'Ditolak' ? (
          <div className="mt-4 border-l-2 border-red-500 bg-red-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-red-900">Pengajuan ditolak</h2>
            <p className="mt-1 text-sm text-red-800">
              {pengajuan.catatan ?? 'Silakan unggah ulang berkas KTP yang lebih jelas.'}
            </p>
          </div>
        ) : null}

        {pengajuan?.status === 'Menunggu' ? (
          <p className="mt-4 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Berkas Anda sedang ditinjau oleh petugas. Anda tetap dapat mengunggah ulang berkas
            apabila ada perbaikan.
          </p>
        ) : null}

        {pengajuan?.status === 'Diterima' ? (
          <p className="mt-4 border-l-2 border-brand bg-green-50 px-4 py-3 text-sm text-brand">
            Domisili Anda sudah terverifikasi. Akun akan aktif setelah status akun diperbarui oleh
            petugas.
          </p>
        ) : null}
      </div>

      <div className="border border-line bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">
          {pengajuan ? 'Unggah ulang berkas KTP' : 'Unggah berkas KTP'}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Format JPG, PNG, atau PDF. Ukuran maksimal 2 MB. Pastikan seluruh bagian KTP terbaca
          jelas.
        </p>

        {error ? (
          <p
            role="alert"
            aria-live="polite"
            className="mt-4 border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        ) : null}

        {success ? (
          <p
            role="status"
            className="mt-4 border-l-2 border-brand bg-green-50 px-3.5 py-3 text-sm text-brand"
          >
            {success}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-ink">
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
              className="block w-full cursor-pointer rounded-md border border-line bg-white text-sm text-muted file:mr-4 file:cursor-pointer file:border-0 file:bg-paper file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            />
            {file ? (
              <p className="mt-1.5 text-xs text-muted">
                Dipilih: <span className="font-medium text-ink">{file.name}</span> (
                {formatSize(file.size)})
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading || !file}
            className="inline-flex cursor-pointer items-center justify-center rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
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
