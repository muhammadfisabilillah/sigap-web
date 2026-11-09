'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="cursor-pointer text-sm font-medium text-muted hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? 'Keluar...' : 'Keluar'}
    </button>
  );
}
