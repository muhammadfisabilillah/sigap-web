'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PetugasTindakLanjutForm({ aduanId }: { aduanId: number }) {
  const router = useRouter();
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    if (catatan.trim().length < 10) {
      setError('Catatan tindak lanjut minimal 10 karakter.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/petugas/aduan/${aduanId}/tindak-lanjut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catatan: catatan.trim() }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal mencatat tindak lanjut. Coba lagi.');
        return;
      }
      setSuccess(data.message ?? 'Tindak lanjut dicatat.');
      setCatatan('');
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

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
          <label htmlFor="catatan" className="mb-1.5 block text-sm font-medium text-ink">
            Catatan tindak lanjut di lapangan
          </label>
          <textarea
            id="catatan"
            rows={4}
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder="Contoh: Tim sudah turun ke lokasi, lubang ditandai dan menunggu jadwal perbaikan."
            disabled={isLoading}
            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper"
          />
          <p className="mt-1 text-xs text-muted">Minimal 10 karakter. Warga akan menerima notifikasi.</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Memproses...' : 'Catat tindak lanjut'}
        </button>
      </form>
    </div>
  );
}
