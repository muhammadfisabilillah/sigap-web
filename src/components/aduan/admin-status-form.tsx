'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type InstansiOption = { id: number; nama: string };

const STATUS_OPTIONS = [
  { value: 'Diproses', label: 'Diproses — aduan layak, sedang dikerjakan' },
  { value: 'DiteruskanKecamatan', label: 'Diteruskan ke kecamatan' },
  { value: 'MenungguTinjauan', label: 'Menunggu tinjauan' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditolak', label: 'Ditolak' },
];

export function AdminStatusForm({
  aduanId,
  instansi,
}: {
  aduanId: number;
  instansi: InstansiOption[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState('Diproses');
  const [catatan, setCatatan] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    if (status === 'Ditolak' && catatan.trim().length < 5) {
      setError('Catatan penolakan wajib diisi (minimal 5 karakter).');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/aduan/${aduanId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          catatan: catatan.trim() || undefined,
          instansiId: instansiId ? Number(instansiId) : undefined,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal memperbarui status. Coba lagi.');
        return;
      }
      setSuccess(data.message ?? 'Status aduan diperbarui.');
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper';

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-3 border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="mb-3 border-l-2 border-brand bg-green-50 px-3 py-2 text-sm text-brand">
          {success}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-ink">
            Status baru
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={isLoading}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="instansiId" className="mb-1.5 block text-sm font-medium text-ink">
            Teruskan ke instansi <span className="font-normal text-muted">(opsional)</span>
          </label>
          <select
            id="instansiId"
            value={instansiId}
            onChange={(event) => setInstansiId(event.target.value)}
            disabled={isLoading || instansi.length === 0}
            className={inputClass}
          >
            <option value="">{instansi.length === 0 ? 'Belum tersedia' : 'Tidak diteruskan ke instansi'}</option>
            {instansi.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium text-ink">
            Catatan untuk warga
          </label>
          <textarea
            id="catatan"
            rows={3}
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder="Contoh: Aduan Anda telah diteruskan ke kecamatan untuk ditindaklanjuti."
            disabled={isLoading}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Memproses...' : 'Simpan status'}
        </button>
      </form>
    </div>
  );
}
