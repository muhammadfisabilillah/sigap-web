import { NextResponse } from 'next/server';

type NominatimPayload = {
  display_name?: string;
  address?: Record<string, string>;
  error?: string;
};

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const latRaw = params.get('lat');
  const lngRaw = params.get('lng');
  const latitude = Number(latRaw);
  const longitude = Number(lngRaw);

  if (
    latRaw === null ||
    lngRaw === null ||
    latRaw.trim() === '' ||
    lngRaw.trim() === '' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      { ok: false, error: 'Koordinat lat/lng tidak valid.' },
      { status: 422 },
    );
  }

  // zoom=18 agar hierarki alamat Indonesia (kelurahan → kecamatan → kota) muncul lengkap
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(latitude));
  url.searchParams.set('lon', String(longitude));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('accept-language', 'id');

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          process.env['NOMINATIM_USER_AGENT'] ??
          'SIGAP/1.0 (PWA pengaduan masyarakat Surabaya)',
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: 'Layanan geocoding sedang tidak tersedia.' },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as NominatimPayload;
    if (payload.error) {
      return NextResponse.json(
        { ok: false, error: 'Lokasi tidak ditemukan oleh layanan geocoding.' },
        { status: 404 },
      );
    }

    const address = payload.address ?? {};
    const displayName = typeof payload.display_name === 'string' ? payload.display_name.trim() : '';

    // Kumpulkan semua kandidat nama wilayah dengan prioritas:
    // 1) city_district  2) municipality  3) suburb  4) county  5) town  6) village
    // 7) semua pecahan display_name yang sudah di-trim
    const seen = new Set<string>();
    const candidates: string[] = [];

    function addCandidate(value: unknown) {
      const v = typeof value === 'string' ? value.trim() : '';
      if (v && !seen.has(v)) {
        seen.add(v);
        candidates.push(v);
      }
    }

    addCandidate(address['city_district']);
    addCandidate(address['municipality']);
    addCandidate(address['suburb']);
    addCandidate(address['county']);
    addCandidate(address['town']);
    addCandidate(address['village']);

    // Tambahkan semua pecahan display_name
    for (const part of displayName.split(',')) {
      addCandidate(part);
    }

    // detectedLabel: nama wilayah yang paling representatif untuk ditampilkan ke user
    const detectedLabel =
      (address['city_district'] ??
        address['municipality'] ??
        address['suburb'] ??
        address['county'] ??
        address['town'] ??
        address['village'] ??
        displayName.split(',')[0] ??
        '').trim();

    return NextResponse.json({
      ok: true,
      candidates,
      detectedLabel,
      displayName,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Gagal menghubungi layanan geocoding.' },
      { status: 504 },
    );
  }
}
