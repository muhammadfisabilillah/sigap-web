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
  'w-full rounded-md border px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:outline-none focus:ring-2 disabled:bg-paper disabled:text-muted';

function inputClass(hasError: boolean) {
  return `${baseInputClass} ${
    hasError
      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
      : 'border-line focus:border-brand focus:ring-brand/15'
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
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-ink">
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
            className={inputClass(false)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="noHp" className="mb-1.5 block text-sm font-medium text-ink">
              Nomor HP <span className="font-normal text-muted">(opsional)</span>
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
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Kecamatan <span className="font-normal text-muted">(opsional)</span>
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
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
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
              className={`${inputClass(false)} pr-20`}
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-ink"
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
            className="flex w-full cursor-pointer items-center justify-center rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand transition-colors hover:text-brand-hover hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}

