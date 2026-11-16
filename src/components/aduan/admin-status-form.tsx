'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAksiAdmin, type StatusAduan } from '@/src/lib/aduan/transitions';

type InstansiOption = { id: number; nama: string };

export function AdminStatusForm({
  aduanId,
  currentStatus,
  instansi,
}: {
  aduanId: number;
  currentStatus: string;
  instansi: InstansiOption[];
}) {
  const router = useRouter();
  const aksi = getAksiAdmin(currentStatus);
  const [status, setStatus] = useState<StatusAduan | ''>(aksi[0]?.value ?? '');
  const [catatan, setCatatan] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const aksiAktif = aksi.find((item) => item.value === status);

  if (aksi.length === 0 || !status) {
    return (
      <p className="text-sm text-muted">
        {currentStatus === 'DiteruskanKecamatan'
          ? 'Aduan sedang ditangani petugas kecamatan. Anda dapat menetapkan status selesai setelah petugas mengirim hasil tinjauan.'
          : 'Tidak ada tindakan Admin yang tersedia untuk status aduan saat ini.'}
      </p>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !status) return;
    if (aksiAktif?.butuhCatatan && catatan.trim().length < 5) {
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
            Tindakan selanjutnya
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusAduan)}
            disabled={isLoading}
            className={inputClass}
          >
            {aksi.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            Status berubah berurutan. Hanya tindakan berikutnya yang tersedia.
          </p>
        </div>

        {aksiAktif?.butuhInstansi ? (
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
              <option value="">
                {instansi.length === 0 ? 'Belum tersedia' : 'Tidak diteruskan ke instansi'}
              </option>
              {instansi.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium text-ink">
            Catatan untuk warga
            {aksiAktif?.butuhCatatan ? (
              <span className="font-normal text-red-700"> (wajib)</span>
            ) : (
              <span className="font-normal text-muted"> (opsional)</span>
            )}
          </label>
          <textarea
            id="catatan"
            rows={3}
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder={
              aksiAktif?.butuhCatatan
                ? 'Jelaskan alasan penolakan dengan jelas.'
                : 'Contoh: Aduan Anda telah diteruskan ke kecamatan untuk ditindaklanjuti.'
            }
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
