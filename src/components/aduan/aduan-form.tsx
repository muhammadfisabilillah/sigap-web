'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { AduanMap } from '@/src/components/map/aduan-map';

type Option = { id: number; nama: string };

type AduanFormProps = {
  kategori: Option[];
  kecamatan: Option[];
  instansi: Option[];
  defaultKecamatanId: number | null;
};

const MAX_PHOTOS = 3;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

type ReverseGeocodeResponse = {
  ok?: boolean;
  candidates?: string[];
  detectedLabel?: string;
  displayName?: string;
  error?: string;
};

// Centroid 31 kecamatan Surabaya untuk fallback Haversine
const KECAMATAN_CENTROIDS: { nama: string; lat: number; lng: number }[] = [
  { nama: 'Asemrowo', lat: -7.2371, lng: 112.6872 },
  { nama: 'Benowo', lat: -7.2548, lng: 112.6367 },
  { nama: 'Bubutan', lat: -7.2458, lng: 112.7281 },
  { nama: 'Bulak', lat: -7.2167, lng: 112.7917 },
  { nama: 'Dukuh Pakis', lat: -7.2871, lng: 112.7076 },
  { nama: 'Gayungan', lat: -7.3372, lng: 112.7295 },
  { nama: 'Genteng', lat: -7.2578, lng: 112.7375 },
  { nama: 'Gubeng', lat: -7.2706, lng: 112.7572 },
  { nama: 'Gunung Anyar', lat: -7.3519, lng: 112.8019 },
  { nama: 'Jambangan', lat: -7.3444, lng: 112.7044 },
  { nama: 'Karang Pilang', lat: -7.3425, lng: 112.6797 },
  { nama: 'Kenjeran', lat: -7.2186, lng: 112.7769 },
  { nama: 'Krembangan', lat: -7.2283, lng: 112.7272 },
  { nama: 'Lakarsantri', lat: -7.3131, lng: 112.6481 },
  { nama: 'Mulyorejo', lat: -7.2644, lng: 112.7853 },
  { nama: 'Pabean Cantikan', lat: -7.2228, lng: 112.7375 },
  { nama: 'Pakal', lat: -7.2572, lng: 112.6181 },
  { nama: 'Rungkut', lat: -7.3231, lng: 112.7819 },
  { nama: 'Sambikerep', lat: -7.2794, lng: 112.6567 },
  { nama: 'Sawahan', lat: -7.2878, lng: 112.7236 },
  { nama: 'Semampir', lat: -7.2311, lng: 112.7558 },
  { nama: 'Simokerto', lat: -7.2456, lng: 112.7483 },
  { nama: 'Sukolilo', lat: -7.2919, lng: 112.7961 },
  { nama: 'Sukomanunggal', lat: -7.2706, lng: 112.6967 },
  { nama: 'Tambaksari', lat: -7.2522, lng: 112.7675 },
  { nama: 'Tandes', lat: -7.2619, lng: 112.6719 },
  { nama: 'Tegalsari', lat: -7.2756, lng: 112.7347 },
  { nama: 'Tenggilis Mejoyo', lat: -7.3317, lng: 112.7636 },
  { nama: 'Wiyung', lat: -7.3156, lng: 112.6908 },
  { nama: 'Wonocolo', lat: -7.3331, lng: 112.7378 },
  { nama: 'Wonokromo', lat: -7.3053, lng: 112.7336 },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Normalisasi nama kecamatan: hapus awalan, huruf kecil, hapus tanda baca. */
function normalisasiNamaKecamatan(nama: string): string {
  return nama
    .replace(/^(?:kecamatan|kec)\.?\s*/i, '')
    .trim()
    .toLocaleLowerCase('id')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Versi tanpa spasi — untuk mendeteksi "Karangpilang" ↔ "Karang Pilang". */
function tanpaSpasi(nama: string): string {
  return normalisasiNamaKecamatan(nama).replace(/\s/g, '');
}

function pesanGeolocationError(error: GeolocationPositionError): string {
  switch (error.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Izin lokasi ditolak. Aktifkan izin lokasi di browser, atau isi koordinat secara manual.';
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Lokasi tidak tersedia dari perangkat. Coba lagi, atau isi koordinat secara manual.';
    case GeolocationPositionError.TIMEOUT:
      return 'Deteksi lokasi memakan waktu terlalu lama. Coba lagi, atau isi koordinat secara manual.';
    default:
      return 'Tidak dapat membaca lokasi. Coba lagi, atau isi koordinat secara manual.';
  }
}

export function AduanForm({ kategori, kecamatan, instansi, defaultKecamatanId }: AduanFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geocodeRequestRef = useRef(0);

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [kecamatanId, setKecamatanId] = useState(
    defaultKecamatanId ? String(defaultKecamatanId) : '',
  );
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);
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

  async function syncKecamatan(lat: number, lng: number) {
    const requestId = ++geocodeRequestRef.current;
    setIsGeocoding(true);
    setLocationInfo(null);

    try {
      const url = `/api/geocode/reverse?lat=${encodeURIComponent(lat.toFixed(6))}&lng=${encodeURIComponent(lng.toFixed(6))}`;
      const response = await fetch(url, { cache: 'no-store' });
      const data = (await response.json().catch(() => null)) as ReverseGeocodeResponse | null;

      if (requestId !== geocodeRequestRef.current) return;

      if (!response.ok || !data?.ok) {
        setKecamatanId('');
        setLocationInfo(
          'Gagal mendeteksi kecamatan dari koordinat. Silakan pilih kecamatan secara manual.',
        );
        return;
      }

      const candidates = data.candidates ?? [];
      const detectedLabel = (data.detectedLabel ?? '').trim();

      // Coba cocokkan setiap kandidat ke opsi dropdown kecamatan
      let matched: Option | undefined;
      for (const candidate of candidates) {
        const kunci = normalisasiNamaKecamatan(candidate);
        const kunciTanpaSpasi = tanpaSpasi(candidate);
        const found = kecamatan.find((item) => {
          const itemNorm = normalisasiNamaKecamatan(item.nama);
          const itemTanpaSpasi = tanpaSpasi(item.nama);
          return itemNorm === kunci || itemTanpaSpasi === kunciTanpaSpasi;
        });
        if (found) {
          matched = found;
          break;
        }
      }

      if (matched) {
        setKecamatanId(String(matched.id));
        setLocationInfo(`Kecamatan terdeteksi: ${matched.nama}.`);
        return;
      }

      // Fallback Haversine: cari kecamatan Surabaya terdekat berdasarkan koordinat
      let nearest: { nama: string; dist: number } | null = null;
      for (const centroid of KECAMATAN_CENTROIDS) {
        const dist = haversineKm(lat, lng, centroid.lat, centroid.lng);
        if (!nearest || dist < nearest.dist) {
          nearest = { nama: centroid.nama, dist };
        }
      }

      if (nearest) {
        // Cocokkan nama centroid ke opsi dropdown
        const nearestMatch = kecamatan.find((item) => {
          const itemTanpaSpasi = tanpaSpasi(item.nama);
          const nearestTanpaSpasi = tanpaSpasi(nearest!.nama);
          return (
            normalisasiNamaKecamatan(item.nama) === normalisasiNamaKecamatan(nearest!.nama) ||
            itemTanpaSpasi === nearestTanpaSpasi
          );
        });

        if (nearestMatch) {
          setKecamatanId(String(nearestMatch.id));
          const areaLabel = detectedLabel || 'area ini';
          setLocationInfo(
            `Area ${areaLabel} — kecamatan otomatis diarahkan ke ${nearestMatch.nama}, silakan ubah jika perlu.`,
          );
          return;
        }
      }

      // Tidak ada yang cocok sama sekali
      setKecamatanId('');
      setLocationInfo(
        detectedLabel
          ? `Lokasi terdeteksi di ${detectedLabel}, tidak termasuk kecamatan terdaftar. Silakan pilih kecamatan secara manual.`
          : 'Kecamatan tidak terdeteksi dari koordinat. Silakan pilih kecamatan secara manual.',
      );
    } catch {
      if (requestId !== geocodeRequestRef.current) return;
      setKecamatanId('');
      setLocationInfo(
        'Gagal mendeteksi kecamatan dari koordinat. Silakan pilih kecamatan secara manual.',
      );
    } finally {
      if (requestId === geocodeRequestRef.current) setIsGeocoding(false);
    }
  }

  function handleLocate() {
    if (!('geolocation' in navigator)) {
      setError('Perangkat Anda tidak mendukung deteksi lokasi. Isi koordinat secara manual.');
      return;
    }
    setIsLocating(true);
    setError(null);
    setLocationInfo(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        try {
          await syncKecamatan(lat, lng);
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        setIsLocating(false);
        setError(pesanGeolocationError(geoError));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
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
      if (instansiId) body.append('instansiId', instansiId);
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
            <label htmlFor="instansiId" className="mb-1.5 block text-sm font-medium text-ink">
              Instansi (opsional)
            </label>
            <select
              id="instansiId"
              name="instansiId"
              value={instansiId}
              onChange={(event) => setInstansiId(event.target.value)}
              disabled={isLoading || instansi.length === 0}
              className={inputClass}
            >
              <option value="">{instansi.length === 0 ? 'Belum tersedia' : 'Pilih instansi'}</option>
              {instansi.map((item) => (
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
              disabled={isLoading || isLocating || isGeocoding}
              className="cursor-pointer rounded-md border border-brand px-3.5 py-2 text-sm font-medium text-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLocating ? 'Mendeteksi lokasi...' : 'Ambil lokasi saya'}
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

          {isGeocoding ? (
            <p role="status" className="mt-3 text-xs text-brand">
              Mendeteksi kecamatan dari koordinat...
            </p>
          ) : locationInfo ? (
            <p role="status" className="mt-3 text-xs text-muted">
              {locationInfo}
            </p>
          ) : null}

          <div className="mt-4">
            <p className="mb-1.5 text-sm font-medium text-ink">Pilih di peta</p>
            <p className="mb-2 text-xs text-muted">
              Klik di peta untuk mengisi koordinat, atau gunakan tombol ambil lokasi di atas.
            </p>
            <AduanMap
              points={
                latitude && longitude
                  ? [
                      {
                        id: 0,
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                        judul: 'Lokasi aduan',
                        nomorTiket: '-',
                        kecamatanNama: '-',
                      },
                    ]
                  : []
              }
              height={240}
              onPick={(lat, lng) => {
                setLatitude(lat.toFixed(6));
                setLongitude(lng.toFixed(6));
                setError(null);
                void syncKecamatan(lat, lng);
              }}
            />
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