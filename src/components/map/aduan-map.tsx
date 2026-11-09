'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapPoint = {
  id: number;
  latitude: number;
  longitude: number;
  judul: string;
  nomorTiket: string;
  kecamatanNama: string;
  status?: string;
  href?: string;
};

const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

export function AduanMap({
  points,
  height = 320,
  className = '',
  onPick,
}: {
  points: MapPoint[];
  height?: number;
  className?: string;
  onPick?: (latitude: number, longitude: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
        const map = L.map(containerRef.current, { scrollWheelZoom: false });
        mapRef.current = map;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
        map.on('focus', () => map.scrollWheelZoom.enable());
        map.on('blur', () => map.scrollWheelZoom.disable());
        map.on('click', (event: { latlng: { lat: number; lng: number } }) => {
          onPickRef.current?.(event.latlng.lat, event.latlng.lng);
        });
      }

      const map = mapRef.current;
      map.eachLayer((layer) => {
        if ((layer as { _url?: string })._url) return;
        map.removeLayer(layer);
      });

      const valid = points.filter(
        (p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude),
      );

      if (valid.length === 0) {
        map.setView(SURABAYA_CENTER, 11);
        return;
      }

      const icon = L.divIcon({
        className: 'sigap-map-dot',
        html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#0f3d2e;border:3px solid #ffffff;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -8],
      });

      for (const point of valid) {
        const popup = `<strong>${escapeHtml(point.judul)}</strong><br/>${escapeHtml(point.nomorTiket)} · Kec. ${escapeHtml(point.kecamatanNama)}${point.href ? `<br/><a href="${point.href}">Lihat detail</a>` : ''}`;
        L.marker([point.latitude, point.longitude], { icon })
          .addTo(map)
          .bindPopup(popup);
      }

      if (valid.length === 1) {
        map.setView([valid[0].latitude, valid[0].longitude], 14);
      } else {
        const bounds = L.latLngBounds(
          valid.map((p) => [p.latitude, p.longitude] as [number, number]),
        );
        map.fitBounds(bounds.pad(0.15));
      }
    }

    init().catch(() => {
      // Peta tidak tersedia (mis. Leaflet gagal dimuat) — halaman tetap berjalan.
    });

    return () => {
      cancelled = true;
    };
  }, [points]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`z-0 w-full border border-line ${className}`}
      aria-label="Peta lokasi aduan"
    />
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
