"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

// ============================================================================
// Types
// ============================================================================
interface GeoCoords {
  latitude: string;
  longitude: string;
  accuracy: number | null;
}

const SURABAYA_CENTER: [number, number] = [-7.2575, 112.7521];

// ============================================================================
// FormLaporan Component (SCRUM-87: Integrasi Geolocation API & Peta Leaflet)
// ============================================================================
export function FormLaporan() {
  // --- Form Field States ---
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamatDetail, setAlamatDetail] = useState("");
  const [fotoBukti, setFotoBukti] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // --- Geolocation States (Task SCRUM-87) ---
  const [coords, setCoords] = useState<GeoCoords>({
    latitude: "",
    longitude: "",
    accuracy: null,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoSuccess, setGeoSuccess] = useState(false);

  // --- Leaflet Map References ---
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerInstanceRef = useRef<LeafletMarker | null>(null);

  // --- Submit State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /**
   * Helper function untuk memindahkan marker dan pan peta
   */
  const updateMapPosition = useCallback(async (lat: number, lng: number, shouldFlyTo: boolean) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = (await import("leaflet")).default;

    // Pastikan ukuran peta ter-update
    map.invalidateSize();

    // Custom Icon Marker SIGAP (Pin biru elegan dengan radar halo)
    const customIcon = L.divIcon({
      className: "sigap-custom-pin",
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
          <span style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background-color: rgba(30, 58, 138, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; width: 24px; height: 24px; background-color: #1e3a8a; border-radius: 9999px; border: 3px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 9999px;"></div>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });

    if (markerInstanceRef.current) {
      markerInstanceRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      // Event ketika marker digeser (dragend)
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setCoords({
          latitude: pos.lat.toFixed(6),
          longitude: pos.lng.toFixed(6),
          accuracy: null,
        });
        setGeoSuccess(true);
      });

      marker.bindPopup("<strong>Titik Lokasi Aduan</strong><br/>Geser titik ini jika perlu penyesuaian.");
      markerInstanceRef.current = marker;
    }

    if (shouldFlyTo) {
      map.flyTo([lat, lng], 16, { duration: 1.2 });
    }
  }, []);

  /**
   * Fungsi meminta izin lokasi dan mendapatkan GPS secara manual (klik tombol)
   */
  const handleGetLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError(
        "Perangkat atau peramban Anda tidak mendukung Geolocation API."
      );
      setGeoSuccess(false);
      return;
    }

    setIsLocating(true);
    setGeoError(null);
    setGeoSuccess(false);

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const accuracy = Math.round(position.coords.accuracy);

        setCoords({
          latitude: lat,
          longitude: lng,
          accuracy: accuracy,
        });

        setIsLocating(false);
        setGeoSuccess(true);
        setGeoError(null);

        // Update posisi marker di peta
        updateMapPosition(Number(lat), Number(lng), true);
      },
      (error: GeolocationPositionError) => {
        setIsLocating(false);
        setGeoSuccess(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(
              "Izin akses lokasi ditolak oleh pengguna. Mohon izinkan akses GPS di pengaturan browser."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(
              "Informasi lokasi tidak tersedia. Pastikan sinyal GPS atau koneksi internet Anda aktif."
            );
            break;
          case error.TIMEOUT:
            setGeoError(
              "Waktu permintaan lokasi habis (timeout). Silakan klik 'Deteksi Ulang' atau tentukan titik langsung di peta."
            );
            break;
          default:
            setGeoError(
              error.message ||
                "Gagal mendeteksi lokasi saat ini. Silakan coba kembali."
            );
            break;
        }
      },
      geoOptions
    );
  }, [updateMapPosition]);

  /**
   * Auto-request Geolocation saat halaman pertama kali dibuka
   */
  useEffect(() => {
    let cancelled = false;

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (cancelled) return;
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const accuracy = Math.round(position.coords.accuracy);

          setCoords({
            latitude: lat,
            longitude: lng,
            accuracy: accuracy,
          });
          setGeoSuccess(true);
          setGeoError(null);

          updateMapPosition(Number(lat), Number(lng), true);
        },
        () => {
          // Jika tidak disetujui pada auto-prompt, tetap biarkan form siap untuk interaksi klik manual
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    return () => {
      cancelled = true;
    };
  }, [updateMapPosition]);

  /**
   * Inisialisasi Peta Leaflet interaktif
   */
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!mapContainerRef.current) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const initialLat = coords.latitude ? Number(coords.latitude) : SURABAYA_CENTER[0];
        const initialLng = coords.longitude ? Number(coords.longitude) : SURABAYA_CENTER[1];
        const initialZoom = coords.latitude ? 16 : 12;

        const map = L.map(mapContainerRef.current, {
          scrollWheelZoom: false,
          zoomControl: true,
        }).setView([initialLat, initialLng], initialZoom);

        mapInstanceRef.current = map;

        // Tile layer OpenStreetMap (Format URL resmi /{z}/{x}/{y}.png)
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Paksa hitung ulang ukuran container agar tile langsung ter-render (tidak abu-abu)
        setTimeout(() => {
          map.invalidateSize();
        }, 150);
        setTimeout(() => {
          map.invalidateSize();
        }, 500);

        map.on("focus", () => map.scrollWheelZoom.enable());
        map.on("blur", () => map.scrollWheelZoom.disable());

        // Event Klik pada peta untuk memilih atau menggeser titik lokasi
        map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          const lat = e.latlng.lat.toFixed(6);
          const lng = e.latlng.lng.toFixed(6);

          setCoords((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            accuracy: null,
          }));
          setGeoSuccess(true);
          setGeoError(null);

          updateMapPosition(Number(lat), Number(lng), false);
        });
      } else {
        // Jika peta sudah ada, pastikan ukuran ter-update
        mapInstanceRef.current.invalidateSize();
      }

      // Jika sudah ada koordinat, pasang marker
      if (coords.latitude && coords.longitude) {
        updateMapPosition(Number(coords.latitude), Number(coords.longitude), false);
      }
    }

    initMap().catch(() => {
      // Fallback jika leaflet gagal dimuat
    });

    return () => {
      cancelled = true;
    };
  }, [coords.latitude, coords.longitude, updateMapPosition]);

  /**
   * Handle Upload Foto Bukti
   */
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoBukti(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handle Submit Form
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!judul.trim()) {
      setSubmitMessage({ type: "error", text: "Judul laporan wajib diisi." });
      return;
    }
    if (!kategori) {
      setSubmitMessage({ type: "error", text: "Silakan pilih kategori aduan." });
      return;
    }
    if (!deskripsi.trim()) {
      setSubmitMessage({ type: "error", text: "Deskripsi permasalahan wajib diisi." });
      return;
    }
    if (!coords.latitude || !coords.longitude) {
      setGeoError("Koordinat GPS belum terdeteksi. Silakan klik 'Deteksi Lokasi GPS' atau tentukan titik di peta.");
      setSubmitMessage({ type: "error", text: "Lokasi kejadian wajib ditentukan pada peta." });
      return;
    }

    setIsSubmitting(true);

    // Payload tersimpan di state untuk dikirim ke API (SCRUM-90)
    const payload = {
      judul,
      kategori,
      deskripsi,
      alamatDetail,
      latitude: Number(coords.latitude),
      longitude: Number(coords.longitude),
      accuracy: coords.accuracy,
    };

    console.log("Payload siap dikirim ke API (SCRUM-90):", payload);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: "success",
        text: "Laporan dan koordinat lokasi GPS Anda berhasil dikirim ke sistem SIGAP!",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Notifikasi Status Submit */}
      {submitMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3.5 rounded-xl p-4 text-sm font-medium animate-fadeIn ${
            submitMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {submitMessage.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <div>
            <p className="font-semibold">{submitMessage.type === "success" ? "Berhasil!" : "Perhatian:"}</p>
            <p className="mt-0.5 text-xs sm:text-sm opacity-90">{submitMessage.text}</p>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* BAGIAN 1: INFORMASI ADUAN                                          */}
      {/* =================================================================== */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#183B7E] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-slate-900">Rincian Laporan</h2>
        </div>

        {/* 1.1 Judul Laporan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="judul" className="block text-sm font-semibold text-slate-800">
              Judul Laporan <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">{judul.length}/100</span>
          </div>
          <input
            id="judul"
            name="judul"
            type="text"
            required
            maxLength={100}
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Contoh: Aspal berlubang membahayakan pengendara di Jl. Ahmad Yani"
            className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs"
          />
        </div>

        {/* 1.2 Kategori Aduan */}
        <div>
          <label htmlFor="kategori" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Kategori Aduan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="kategori"
              name="kategori"
              required
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white/95 px-4 py-2.5 text-sm text-slate-900 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs pr-10 cursor-pointer"
            >
              <option value="">-- Pilih Jenis Permasalahan --</option>
              <option value="infrastruktur">🛣️ Jalan, Jembatan &amp; Fasilitas Umum</option>
              <option value="kebersihan">🗑️ Sampah Liar, Kebersihan &amp; Lingkungan</option>
              <option value="penerangan">💡 Penerangan Jalan Umum (PJU) Mati</option>
              <option value="drainase">🌊 Saluran Air, Gorong-gorong &amp; Genangan</option>
              <option value="pohon">🌳 Pohon Rindang / Bahaya Tumbang</option>
              <option value="ketertiban">📢 Ketertiban Umum &amp; Gangguan Fasos</option>
              <option value="lainnya">📌 Kategori Lainnya</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 1.3 Deskripsi Masalah */}
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Deskripsi Kejadian <span className="text-red-500">*</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            required
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Jelaskan detail situasi: titik spesifik kerusakan, perkiraan ukuran, sejak kapan terjadi, dan potensi dampak bahaya bagi warga..."
            className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs leading-relaxed"
          />
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN 2: INTEGRASI GEOLOCATION & PETA KECIL (SCRUM-87)            */}
      {/* =================================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#183B7E] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Titik Lokasi Kejadian (GPS &amp; Peta)
                <span className="text-red-500">*</span>
              </h2>
            </div>
          </div>

          {/* Status Badge GPS */}
          <div>
            {isLocating ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Mencari Sinyal GPS...
              </span>
            ) : coords.latitude && coords.longitude ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                GPS Terhubung &amp; Terkunci
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                GPS Belum Aktif
              </span>
            )}
          </div>
        </div>

        {/* Card Peta & Kontrol Geolocation */}
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-slate-50/90 via-blue-50/40 to-indigo-50/30 p-4 sm:p-6 space-y-4 shadow-sm">
          {/* Action Bar di atas peta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lokasi diambil otomatis dari sensor perangkat. Anda juga dapat <strong>klik langsung pada peta</strong> atau <strong>menggeser pin</strong> untuk menyesuaikan titik secara presisi.
              </p>
            </div>

            {/* Tombol Ambil Ulang GPS */}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#183B7E] hover:bg-[#132F66] active:bg-[#0F2652] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#183B7E]/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
            >
              {isLocating ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  <span>Mendeteksi Lokasi...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="7" />
                    <line x1="12" y1="2" x2="12" y2="5" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="5" y2="12" />
                    <line x1="19" y1="12" x2="22" y2="12" />
                  </svg>
                  <span>Gunakan Lokasi Saat Ini</span>
                </>
              )}
            </button>
          </div>

          {/* Banner Pesan Error GPS jika ada */}
          {geoError && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-3.5 text-xs sm:text-sm text-red-700 animate-fadeIn"
            >
              <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <span className="font-semibold block">Akses Lokasi GPS Terkendala:</span>
                <p className="mt-0.5 leading-relaxed">{geoError}</p>
                <p className="mt-1 text-[11px] text-red-600/80 font-medium">
                  Tips: Anda tetap dapat menentukan lokasi dengan mengetuk langsung pada peta di bawah ini.
                </p>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* PETA KECIL LEAFLET INTERAKTIF                                   */}
          {/* =============================================================== */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
            {/* Style inline untuk memastikan tile gambar Leaflet tidak terpotong CSS global */}
            <style>{`
              .leaflet-tile {
                max-width: none !important;
                max-height: none !important;
              }
              .leaflet-container img {
                max-width: none !important;
              }
            `}</style>

            {/* Overlay Indikator Loading Saat Mencari Posisi (Non-blocking pill) */}
            {isLocating && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 select-none animate-bounce">
                <svg className="w-3.5 h-3.5 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Mengunci Koordinat Satelit GPS...</span>
              </div>
            )}

            {/* Container Peta Leaflet */}
            <div
              ref={mapContainerRef}
              className="w-full h-72 sm:h-80 relative"
              style={{ minHeight: "280px" }}
              aria-label="Peta interaktif penentuan lokasi aduan"
            />

            {/* Petunjuk Mini di Sudut Bawah Peta */}
            <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-md border border-slate-200/90 pointer-events-none flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Klik peta atau geser pin untuk set lokasi</span>
            </div>
          </div>

          {/* Tampilan Koordinat Lintang & Bujur (Read-Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Latitude */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="latitude" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Latitude (Lintang)
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-600 border border-slate-300/60 select-none">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Read Only
                </span>
              </div>
              <input
                id="latitude"
                name="latitude"
                type="text"
                readOnly
                value={coords.latitude}
                placeholder="Belum terdeteksi"
                className="w-full rounded-xl border border-slate-300 bg-slate-100/90 px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans cursor-default select-all focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-xs"
              />
            </div>

            {/* Longitude */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="longitude" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Longitude (Bujur)
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-600 border border-slate-300/60 select-none">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Read Only
                </span>
              </div>
              <input
                id="longitude"
                name="longitude"
                type="text"
                readOnly
                value={coords.longitude}
                placeholder="Belum terdeteksi"
                className="w-full rounded-xl border border-slate-300 bg-slate-100/90 px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans cursor-default select-all focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-xs"
              />
            </div>
          </div>

          {/* Banner Status Akurasi & Link Google Maps */}
          {geoSuccess && coords.latitude && coords.longitude && (
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Koordinat terkunci pada posisi ({coords.latitude}, {coords.longitude})
                  {coords.accuracy !== null && ` · Estimasi akurasi ±${coords.accuracy} m`}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#183B7E] hover:underline inline-flex items-center gap-1"
              >
                Buka di Google Maps &rarr;
              </a>
            </div>
          )}

          {/* Patokan Tambahan */}
          <div>
            <label htmlFor="alamatDetail" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Patokan Tambahan / Keterangan Lokasi (Opsional)
            </label>
            <input
              id="alamatDetail"
              name="alamatDetail"
              type="text"
              value={alamatDetail}
              onChange={(e) => setAlamatDetail(e.target.value)}
              placeholder="Contoh: Seberang gerbang utama RS Darmo / di depan minimarket"
              className="w-full rounded-xl border border-slate-300 bg-white/95 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#183B7E]/20 transition-all shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN 3: LAMPIRAN FOTO BUKTI                                      */}
      {/* =================================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#183B7E] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h2 className="text-base font-bold text-slate-900">Lampiran Foto Bukti (Opsional)</h2>
        </div>

        <div>
          <label
            htmlFor="fotoInput"
            className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 hover:border-[#183B7E] rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all p-4 text-center"
          >
            {fotoPreview ? (
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoPreview}
                  alt="Pratinjau Foto"
                  className="w-24 h-24 object-cover rounded-xl shadow-sm border border-slate-200"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800">{fotoBukti?.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {fotoBukti ? (fotoBukti.size / 1024 / 1024).toFixed(2) : 0} MB
                  </p>
                  <span className="mt-2 inline-block text-xs font-semibold text-[#183B7E] group-hover:underline">
                    Ganti Foto
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#183B7E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  Unggah Foto Masalah (JPG, PNG, WebP)
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Maksimal ukuran berkas 5 MB</p>
              </div>
            )}
            <input
              id="fotoInput"
              name="fotoInput"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAGIAN 4: TOMBOL SUBMIT                                             */}
      {/* =================================================================== */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          Dengan mengirimkan laporan, Anda menyatakan data yang diberikan adalah benar dan dapat dipertanggungjawabkan.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#183B7E] hover:bg-[#132F66] active:bg-[#0F2652] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-[#183B7E]/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Mengirim Laporan...</span>
            </>
          ) : (
            <>
              <span>Kirim Laporan Warga</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
export default FormLaporan;
