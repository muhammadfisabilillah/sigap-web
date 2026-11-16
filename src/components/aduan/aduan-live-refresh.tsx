'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AduanLiveRefresh({
  aduanId,
  initialStatus,
  intervalMs = 30000,
}: {
  aduanId: number;
  initialStatus: string;
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let currentStatus = initialStatus;

    const cek = async () => {
      try {
        const response = await fetch(`/api/aduan/${aduanId}/status`, { cache: 'no-store' });
        const data = (await response.json().catch(() => null)) as {
          ok?: boolean;
          status?: string;
        } | null;
        if (cancelled || !data?.ok || typeof data.status !== 'string') return;
        if (data.status !== currentStatus) {
          currentStatus = data.status;
          router.refresh();
        }
      } catch {
        // Abaikan kegagalan polling.
      }
    };

    const timer = setInterval(cek, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [aduanId, initialStatus, intervalMs, router]);

  return null;
}
