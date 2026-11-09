'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type Option = { id: number; nama: string };

type AduanFormProps = {
  kategori: Option[];
  kecamatan: Option[];
  defaultKecamatanId: number | null;
};

const MAX_PHOTOS = 3;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

export function AduanForm({ kategori, kecamatan, defaultKecamatanId }: AduanFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [kecamatanId, setKecamatanId] = useState(
    defaultKecamatanId ? String(defaultKecamatanId) : '',
  );
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > MAX_PHOTOS) {
      event.target.value = '';
      setError(`Foto maksimal ${MAX_PHOTOS} berkas.`);
      return;
    }
    for (const file of selected) {
      if (!PHOTO_TYPES.includes(file.type)) {
        event.target.value = '';
        setError('Foto harus JPG, PNG, atau WebP.');
        return;
      }
      if (file.size > MAX_SIZE) {
        event.target.value = '';
        setError('Ukuran tiap foto maksimal 5 MB.');
        return;
      }
      if (file.size === 0) {
        event.target.value = '';
        setError('Ada berkas kosong. Pilih foto lain.');
        return;
      }
    }
    setFiles(selected);
  }

  function handleLocate() {
    if (!('geolocation' in navigator)) {
      setError('Perangkat Anda tidak mendukung deteksi lokasi. Isi koordinat secara manual.');
      return;
    }
    setIsLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setError(
          'Tidak dapat membaca lokasi. Pastikan izin lokasi diberikan, atau isi koordinat secara manual.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    if (judul.trim().length < 5) {
      setError('Judul minimal 5 karakter.');
      return;
    }
    if (deskripsi.trim().length < 10) {
      setError('Deskripsi minimal 10 karakter.');
      return;
    }
    if (!kategoriId) {
      setError('Pilih kategori aduan.');
      return;
    }
    if (!kecamatanId) {
      setError('Pilih kecamatan.');
      return;
    }
    if (!latitude || !longitude) {
      setError('Lokasi aduan wajib diisi. Gunakan tombol ambil lokasi atau isi manual.');
      return;
    }
    if (files.length === 0) {
      setError('Lampirkan minimal 1 foto aduan.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const body = new FormData();
      body.append('judul', judul.trim());
      body.append('deskripsi', deskripsi.trim());
      body.append('kategoriId', kategoriId);
      body.append('kecamatanId', kecamatanId);
      body.append('latitude', latitude);
      body.append('longitude', longitude);
      for (const file of files) body.append('foto', file);

      const response = await fetch('/api/aduan', { method: 'POST', body });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; message?: string; aduan?: { id: number } }
        | null;

      if (!response.ok || !data?.ok) {
        setError(
          data?.error ??
            `Gagal mengirim aduan (kode ${response.status}). Coba lagi, atau lihat pesan error di terminal server.`,
        );
        return;
      }

      setSuccess(data.message ?? 'Aduan berhasil dikirim.');
      router.push(data.aduan?.id ? `/warga/aduan/${data.aduan.id}` : '/warga/aduan');
      router.refresh();
    } catch {
      setError('Koneksi ke server gagal. Periksa jaringan Anda dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 disabled:bg-paper disabled:text-muted';

  return (
    <div className="space-y-4">
      {error ? (
        <p
          role="alert"
          aria-live="polite"
          className="border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          role="status"
          className="border-l-2 border-brand bg-green-50 px-3.5 py-3 text-sm text-brand"
        >
          {success}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="judul" className="mb-1.5 block text-sm font-medium text-ink">
            Judul aduan
          </label>
          <input
            id="judul"
            name="judul"
            type="text"
            required
            value={judul}
            onChange={(event) => setJudul(event.target.value)}
            placeholder="Contoh: Jalan berlubang di depan gang"
            disabled={isLoading}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="deskripsi" className="mb-1.5 block text-sm font-medium text-ink">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            required
            rows={5}
            value={deskripsi}
            onChange={(event) => setDeskripsi(event.target.value)}
            placeholder="Ceritakan kejadiannya: kapan, di mana, dan dampaknya untuk warga."
            disabled={isLoading}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">Minimal 10 karakter.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kategoriId" className="mb-1.5 block text-sm font-medium text-ink">
              Kategori
            </label>
            <select
              id="kategoriId"
              name="kategoriId"
              required
              value={kategoriId}
              onChange={(event) => setKategoriId(event.target.value)}
              disabled={isLoading || kategori.length === 0}
              className={inputClass}
            >
              <option value="">{kategori.length === 0 ? 'Belum tersedia' : 'Pilih kategori'}</option>
              {kategori.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="kecamatanId" className="mb-1.5 block text-sm font-medium text-ink">
              Kecamatan
            </label>
            <select
              id="kecamatanId"
              name="kecamatanId"
              required
              value={kecamatanId}
              onChange={(event) => setKecamatanId(event.target.value)}
              disabled={isLoading || kecamatan.length === 0}
              className={inputClass}
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

        <fieldset className="border border-line bg-card p-4">
          <legend className="px-1 text-sm font-medium text-ink">Lokasi aduan</legend>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLocate}
              disabled={isLoading || isLocating}
              className="cursor-pointer rounded-md border border-brand px-3.5 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLocating ? 'Membaca lokasi...' : 'Ambil lokasi saya'}
            </button>
            {latitude && longitude ? (
              <a
                href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-brand hover:underline"
              >
                Lihat di peta
              </a>
            ) : (
              <span className="text-xs text-muted">Izin lokasi akan diminta browser.</span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="latitude" className="mb-1.5 block text-sm font-medium text-ink">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                inputMode="decimal"
                required
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="Contoh: -7.2575"
                disabled={isLoading}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="longitude" className="mb-1.5 block text-sm font-medium text-ink">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                inputMode="decimal"
                required
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="Contoh: 112.7521"
                disabled={isLoading}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="foto" className="mb-1.5 block text-sm font-medium text-ink">
            Foto bukti
          </label>
          <input
            ref={fileInputRef}
            id="foto"
            name="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFilesChange}
            disabled={isLoading}
            className="block w-full cursor-pointer rounded-md border border-line bg-white text-sm text-muted file:mr-4 file:cursor-pointer file:border-0 file:bg-paper file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="mt-1 text-xs text-muted">
            JPG, PNG, atau WebP. Maksimal {MAX_PHOTOS} foto, tiap foto maksimal 5 MB.
          </p>
          {files.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {files.map((file) => (
                <li key={`${file.name}-${file.size}`}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6"
        >
          {isLoading ? 'Mengirim aduan...' : 'Kirim aduan'}
        </button>
      </form>
    </div>
  );
}
