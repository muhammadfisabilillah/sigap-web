'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { formatWaktuRelatif } from '@/src/lib/notifikasi/time';

type NotifikasiItem = {
  id: number;
  aduanId: number | null;
  judul: string;
  pesan: string;
  dibaca: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifikasiItem[]>([]);
  const [belumDibaca, setBelumDibaca] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const muat = () => {
      fetch('/api/notifikasi', { cache: 'no-store' })
        .then((response) => response.json())
        .then(
          (data: {
            ok?: boolean;
            notifikasi?: NotifikasiItem[];
            belumDibaca?: number;
          } | null) => {
            if (cancelled || !data?.ok || !Array.isArray(data.notifikasi)) return;
            setItems(data.notifikasi);
            setBelumDibaca(data.belumDibaca ?? 0);
          },
        )
        .catch(() => {
          // Lonceng tetap diam bila gagal memuat.
        });
    };

    muat();
    const timer = setInterval(muat, 20000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function onClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function tandaiDibaca(id: number) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, dibaca: true } : item)));
    setBelumDibaca((prev) => Math.max(0, prev - 1));
    try {
      await fetch('/api/notifikasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aksi: 'tandai_satuan', id }),
      });
    } catch {
      // Abaikan — status lokal sudah diperbarui.
    }
  }

  async function tandaiSemuaDibaca() {
    setItems((prev) => prev.map((item) => ({ ...item, dibaca: true })));
    setBelumDibaca(0);
    try {
      await fetch('/api/notifikasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aksi: 'tandai_semua' }),
      });
    } catch {
      // Abaikan — status lokal sudah diperbarui.
    }
  }

  async function bukaNotifikasi(item: NotifikasiItem) {
    await tandaiDibaca(item.id);
    setOpen(false);
    if (item.aduanId) {
      router.push(`/warga/aduan/${item.aduanId}`);
    }
  }

  const preview = items.slice(0, 5);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifikasi"
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-brand/40 hover:text-ink"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {belumDibaca > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {belumDibaca > 9 ? '9+' : belumDibaca}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-card shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifikasi</p>
            {belumDibaca > 0 ? (
              <button
                type="button"
                onClick={tandaiSemuaDibaca}
                className="text-xs font-medium text-brand hover:underline"
              >
                Tandai semua dibaca
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {preview.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">Belum ada notifikasi.</p>
            ) : (
              <ul className="divide-y divide-line">
                {preview.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => bukaNotifikasi(item)}
                      className={`block w-full px-4 py-3 text-left transition-colors hover:bg-brand-soft/50 ${
                        item.dibaca ? 'bg-card' : 'bg-brand-soft/40'
                      }`}
                    >
                      <span className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            item.dibaca ? 'bg-line' : 'bg-brand'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {item.judul}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-xs text-muted">
                            {item.pesan}
                          </span>
                          <span className="mt-1 block text-[11px] text-muted/80">
                            {formatWaktuRelatif(item.createdAt)}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-line px-4 py-2.5">
            <Link
              href="/notifikasi"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-medium text-brand hover:underline"
            >
              Lihat semua notifikasi
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
