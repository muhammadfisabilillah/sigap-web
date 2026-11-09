'use client';

import Link from 'next/link';
import { useState } from 'react';

export function LupaPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/lupa-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal mengirim permintaan. Coba lagi.');
        return;
      }
      setSuccess(data.message ?? 'Permintaan terkirim.');
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error ? (
        <p role="alert" className="mb-5 border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {success ? (
        <p role="status" className="mb-5 border-l-2 border-brand bg-green-50 px-3.5 py-3 text-sm text-brand">
          {success}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email terdaftar
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="nama@email.com"
            disabled={isLoading}
            className="w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Memproses...' : 'Kirim permintaan reset'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Ingat kata sandi?{' '}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Kembali masuk
        </Link>
      </p>
    </div>
  );
}
