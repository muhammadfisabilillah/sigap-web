'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Option = { id: number; nama: string };

export function ProfilForm({
  kecamatan,
  initialKecamatanId,
  initialNoHp,
  initialNik,
}: {
  kecamatan: Option[];
  initialKecamatanId: number | null;
  initialNoHp: string;
  initialNik: string;
}) {
  const router = useRouter();
  const [kecamatanId, setKecamatanId] = useState(
    initialKecamatanId ? String(initialKecamatanId) : '',
  );
  const [noHp, setNoHp] = useState(initialNoHp);
  const [nik, setNik] = useState(initialNik);
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
      const response = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kecamatanId: kecamatanId ? Number(kecamatanId) : null,
          noHp: noHp.trim(),
          nik: nik.trim(),
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string }
        | null;
      if (!response.ok || !data?.ok) {
        setError(data?.error ?? 'Gagal menyimpan profil. Coba lagi.');
        return;
      }
      setSuccess(data.message ?? 'Profil diperbarui.');
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper';

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="mb-4 border-l-2 border-brand bg-green-50 px-3.5 py-3 text-sm text-brand">
          {success}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="kecamatanId" className="mb-1.5 block text-sm font-medium text-ink">
            Kecamatan
          </label>
          <select
            id="kecamatanId"
            value={kecamatanId}
            onChange={(event) => setKecamatanId(event.target.value)}
            disabled={isLoading || kecamatan.length === 0}
            className={inputClass}
          >
            <option value="">{kecamatan.length === 0 ? 'Belum tersedia' : 'Pilih kecamatan'}</option>
            {kecamatan.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            Kecamatan tercatat untuk keperluan verifikasi domisili Anda. Pastikan sesuai KTP —
            petugas akan memvalidasinya.
          </p>
        </div>

        <div>
          <label htmlFor="nik" className="mb-1.5 block text-sm font-medium text-ink">
            NIK (16 digit)
          </label>
          <input
            id="nik"
            type="text"
            inputMode="numeric"
            maxLength={16}
            value={nik}
            onChange={(event) => setNik(event.target.value.replace(/\D/g, '').slice(0, 16))}
            placeholder="Contoh: 3578012345670001"
            disabled={isLoading}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">
            Nomor Induk Kependudukan sesuai KTP. Nanti akan otomatis terbaca saat Anda upload KTP.
          </p>
        </div>

        <div>
          <label htmlFor="noHp" className="mb-1.5 block text-sm font-medium text-ink">
            Nomor HP <span className="font-normal text-muted">(opsional)</span>
          </label>
          <input
            id="noHp"
            type="tel"
            value={noHp}
            onChange={(event) => setNoHp(event.target.value)}
            placeholder="08xxxxxxxxxx"
            disabled={isLoading}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Memproses...' : 'Simpan profil'}
        </button>
      </form>
    </div>
  );
}
