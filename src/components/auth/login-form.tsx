'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { homePathForRole } from '@/src/lib/auth/roles';

type LoginResponse = {
  ok?: boolean;
  error?: string;
  user?: { role?: string } | null;
};

const inputClass =
  'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper disabled:text-muted';

const inputErrorClass =
  'w-full rounded-md border border-red-300 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:bg-paper disabled:text-muted';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Tidak dapat masuk. Silakan coba lagi.');
        return;
      }

      const role = data.user?.role ?? 'Warga';
      router.replace(homePathForRole(role));
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Periksa jaringan Anda dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error ? (
        <p
          role="alert"
          aria-live="polite"
          className="mb-5 border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
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
            className={error ? inputErrorClass : inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
            Kata sandi
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              disabled={isLoading}
              className={`${error ? inputErrorClass : inputClass} pr-20`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isLoading}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute inset-y-0 right-0 cursor-pointer px-3.5 text-xs font-medium text-muted hover:text-ink focus:outline-none"
            >
              {showPassword ? 'Sembunyi' : 'Lihat'}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
