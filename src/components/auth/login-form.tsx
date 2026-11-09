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
  'w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#183B7E] focus:outline-none focus:ring-2 focus:ring-[#183B7E]/15 disabled:bg-slate-50 disabled:text-slate-400';

const inputErrorClass =
  'w-full rounded-md border border-red-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:bg-slate-50 disabled:text-slate-400';

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
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
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
              className={`${error ? inputErrorClass : inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={isLoading}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#132A50] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d2138] focus:outline-none focus:ring-2 focus:ring-[#132A50]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <SpinnerIcon />
                <span>Memproses...</span>
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{' '}
        <Link
          href="/register"
          className="font-semibold text-[#183B7E] transition-colors hover:text-[#132F66] hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}
