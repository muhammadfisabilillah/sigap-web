'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function VerifikasiActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<'idle' | 'tolak'>('idle');
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(aksi: 'Diterima' | 'Ditolak') {
    if (isLoading) return;
    if (aksi === 'Ditolak' && catatan.trim().length < 5) {
      setError('Tulis alasan penolakan (minimal 5 karakter).');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/verifikasi-domisili', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, aksi, catatan: catatan.trim() || undefined }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal memverifikasi. Coba lagi.');
        return;
      }
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  if (status !== 'Menunggu') {
    return <p className="text-xs text-muted">Pengajuan ini sudah diproses.</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      {error ? (
        <p role="alert" className="border-l-2 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {mode === 'tolak' ? (
        <div>
          <label htmlFor={`catatan-${id}`} className="mb-1.5 block text-sm font-medium text-ink">
            Alasan penolakan
          </label>
          <textarea
            id={`catatan-${id}`}
            rows={3}
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder="Contoh: Foto KTP tidak terbaca jelas."
            disabled={isLoading}
            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => submit('Ditolak')}
              disabled={isLoading}
              className="cursor-pointer rounded-md border border-red-300 px-3.5 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Memproses...' : 'Tolak pengajuan'}
            </button>
            <button
              type="button"
              onClick={() => setMode('idle')}
              disabled={isLoading}
              className="cursor-pointer rounded-md border border-line px-3.5 py-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-60"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => submit('Diterima')}
            disabled={isLoading}
            className="cursor-pointer rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Terima'}
          </button>
          <button
            type="button"
            onClick={() => setMode('tolak')}
            disabled={isLoading}
            className="cursor-pointer rounded-md border border-line px-3.5 py-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-60"
          >
            Tolak
          </button>
        </div>
      )}
    </div>
  );
}
