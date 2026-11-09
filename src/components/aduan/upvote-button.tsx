'use client';

import { useEffect, useState } from 'react';

export function UpvoteButton({
  aduanId,
  initialTotal,
  compact = false,
}: {
  aduanId: number;
  initialTotal: number;
  compact?: boolean;
}) {
  const [total, setTotal] = useState(initialTotal);
  const [sudahUpvote, setSudahUpvote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/aduan/${aduanId}/upvote`)
      .then((response) => response.json())
      .then((data: { ok?: boolean; sudahUpvote?: boolean; totalUpvote?: number }) => {
        if (cancelled || !data?.ok) return;
        setSudahUpvote(Boolean(data.sudahUpvote));
        if (typeof data.totalUpvote === 'number') setTotal(data.totalUpvote);
      })
      .catch(() => {
        // Status upvote tidak diketahui — tombol tetap bisa diklik.
      });
    return () => {
      cancelled = true;
    };
  }, [aduanId]);

  async function handleToggle() {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/aduan/${aduanId}/upvote`, { method: 'POST' });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; sudahUpvote?: boolean; totalUpvote?: number }
        | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal memproses dukungan. Coba lagi.');
        return;
      }
      setSudahUpvote(Boolean(data.sudahUpvote));
      if (typeof data.totalUpvote === 'number') setTotal(data.totalUpvote);
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-pressed={sudahUpvote}
        className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${
          sudahUpvote
            ? 'border-brand bg-brand text-white'
            : 'border-line bg-card text-muted hover:border-brand/40 hover:text-ink'
        }`}
      >
        {isLoading ? 'Memproses...' : sudahUpvote ? 'Didukung' : 'Dukung'} · {total}
      </button>
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
      {!compact && !error ? (
        <span className="text-xs text-muted">
          {sudahUpvote ? 'Anda mendukung aduan ini.' : 'Dukung aduan penting di kecamatan Anda.'}
        </span>
      ) : null}
    </span>
  );
}
