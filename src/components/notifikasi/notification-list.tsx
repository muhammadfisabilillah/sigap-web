'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { NotifikasiItem } from '@/src/lib/notifikasi/query';
import { formatWaktuRelatif } from '@/src/lib/notifikasi/time';

function pathDetailAduan(role: string, aduanId: number): string {
  if (role === 'Admin') return `/admin/aduan/${aduanId}`;
  if (role === 'Petugas') return `/petugas/aduan/${aduanId}`;
  return `/warga/aduan/${aduanId}`;
}

export function NotificationList({
  initialNotifikasi,
  initialBelumDibaca,
  role,
}: {
  initialNotifikasi: NotifikasiItem[];
  initialBelumDibaca: number;
  role: string;
}) {
  const [items, setItems] = useState<NotifikasiItem[]>(initialNotifikasi);
  const [belumDibaca, setBelumDibaca] = useState(initialBelumDibaca);
  const [loading, setLoading] = useState(false);

  const muat = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifikasi', { cache: 'no-store' });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        notifikasi?: NotifikasiItem[];
        belumDibaca?: number;
      } | null;
      if (data?.ok && Array.isArray(data.notifikasi)) {
        setItems(data.notifikasi);
        setBelumDibaca(data.belumDibaca ?? 0);
      }
    } catch {
      // Biarkan data lama tampil.
    } finally {
      setLoading(false);
    }
  }, []);

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
      // Abaikan.
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
      // Abaikan.
    }
  }

  return (
    <div className="border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">
            {belumDibaca > 0
              ? `${belumDibaca} notifikasi belum dibaca`
              : 'Semua notifikasi sudah dibaca'}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Pemberitahuan perubahan status aduan dan verifikasi domisili Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={muat}
            disabled={loading}
            className="rounded-md border border-line px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-ink disabled:opacity-60"
          >
            {loading ? 'Memuat...' : 'Muat ulang'}
          </button>
          {belumDibaca > 0 ? (
            <button
              type="button"
              onClick={tandaiSemuaDibaca}
              className="rounded-md bg-brand px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Tandai semua dibaca
            </button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-muted">
          Belum ada notifikasi. Notifikasi akan muncul saat aduan atau pengajuan domisili Anda
          diperbarui.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li
              key={item.id}
              className={`px-5 py-4 ${item.dibaca ? 'bg-card' : 'bg-brand-soft/30'}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    item.dibaca ? 'bg-line' : 'bg-brand'
                  }`}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm ${
                        item.dibaca ? 'font-medium text-ink' : 'font-semibold text-ink'
                      }`}
                    >
                      {item.judul}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted" suppressHydrationWarning>
                      {formatWaktuRelatif(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.pesan}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    {item.aduanId ? (
                      <Link
                        href={pathDetailAduan(role, item.aduanId)}
                        className="text-xs font-medium text-brand hover:underline"
                      >
                        Lihat detail aduan
                      </Link>
                    ) : null}
                    {!item.dibaca ? (
                      <button
                        type="button"
                        onClick={() => tandaiDibaca(item.id)}
                        className="text-xs font-medium text-muted hover:text-ink hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
