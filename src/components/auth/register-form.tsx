'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type KecamatanOption = {
  id: number;
  nama: string;
};

type RegisterResponse = {
  ok?: boolean;
  error?: string;
};

type RegisterFormProps = {
  kecamatan: KecamatanOption[];
};

const baseInputClass =
  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400';

function inputClass(hasError: boolean) {
  return `${baseInputClass} ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-slate-300 focus:border-[#183B7E] focus:ring-[#183B7E]/20'
  }`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ kecamatan }: RegisterFormProps) {
  const router = useRouter();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [kecamatanId, setKecamatanId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    const cleanNama = nama.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanNama.length < 2) {
      setError('Nama minimal 2 karakter.');
      return;
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Format email tidak valid.');
      return;
    }
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: cleanNama,
          email: cleanEmail,
          noHp: noHp.trim() || undefined,
          kecamatanId: kecamatanId ? Number(kecamatanId) : undefined,
          password,
        }),
      });

      const data = (await response.json().catch(() => null)) as RegisterResponse | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Pendaftaran gagal. Silakan coba lagi.');
        return;
      }

      router.replace('/domisili');
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
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
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
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nama lengkap
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            autoComplete="name"
            required
            value={nama}
            onChange={(event) => {
              setNama(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Sesuai KTP"
            disabled={isLoading}
            className={inputClass(false)}
          />
        </div>

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
            className={inputClass(false)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="noHp" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nomor HP <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <input
              id="noHp"
              name="noHp"
              type="tel"
              autoComplete="tel"
              value={noHp}
              onChange={(event) => setNoHp(event.target.value)}
              placeholder="08xxxxxxxxxx"
              disabled={isLoading}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label
              htmlFor="kecamatanId"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Kecamatan <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <select
              id="kecamatanId"
              name="kecamatanId"
              value={kecamatanId}
              onChange={(event) => setKecamatanId(event.target.value)}
              disabled={isLoading || kecamatan.length === 0}
              className={inputClass(false)}
            >
              <option value="">
                {kecamatan.length === 0 ? 'Belum tersedia' : 'Pilih kecamatan'}
              </option>
              {kecamatan.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              placeholder="Minimal 8 karakter"
              disabled={isLoading}
              className={`${inputClass(false)} pr-11`}
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Konfirmasi kata sandi
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Ulangi kata sandi"
            disabled={isLoading}
            className={inputClass(false)}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#183B7E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#132F66] focus:outline-none focus:ring-2 focus:ring-[#183B7E]/40 focus:ring-offset-2 active:bg-[#0F2652] disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
          >
            {isLoading ? (
              <>
                <SpinnerIcon />
                <span>Memproses...</span>
              </>
            ) : (
              'Daftar'
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#183B7E] transition-colors hover:text-[#132F66] hover:underline"
        >
          Masuk
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
