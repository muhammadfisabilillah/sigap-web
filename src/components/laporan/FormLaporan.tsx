"use client";

import React, { useState } from "react";

// ============================================================================
// Types
// ============================================================================
interface GeoCoords {
  latitude: string;
  longitude: string;
  accuracy: number | null;
}

// ============================================================================
// FormLaporan Component (SCRUM-87: Integrasi Geolocation API)
// ============================================================================
export function FormLaporan() {
  // --- Form Field States ---
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [alamatDetail, setAlamatDetail] = useState("");

  // --- Geolocation States (Task SCRUM-87) ---
  const [coords, setCoords] = useState<GeoCoords>({
    latitude: "",
    longitude: "",
    accuracy: null,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoSuccess, setGeoSuccess] = useState(false);

  // --- Submit State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /**
   * Fungsi untuk meminta koordinat lokasi saat ini menggunakan Web Geolocation API
   */
  const handleGetLocation = () => {
    // 1. Cek apakah browser / perangkat mendukung Geolocation API
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError(
        "Perangkat atau peramban Anda tidak mendukung Web Geolocation API. Silakan periksa pengaturan perangkat Anda."
      );
      setGeoSuccess(false);
      return;
    }

    // Reset error dan set loading state
    setIsLocating(true);
    setGeoError(null);
    setGeoSuccess(false);

    // Opsi penentuan posisi GPS
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true, // Gunakan GPS dengan akurasi tinggi
      timeout: 15000, // Batas waktu 15 detik
      maximumAge: 0, // Jangan gunakan cache posisi lama
    };

    navigator.geolocation.getCurrentPosition(
      // Callback SUKSES
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
      },
      // Callback ERROR
      (error: GeolocationPositionError) => {
        setIsLocating(false);
        setGeoSuccess(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(
              "Izin akses lokasi ditolak oleh pengguna. Mohon izinkan akses lokasi (GPS) pada pengaturan browser Anda untuk melanjutkan."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(
              "Informasi lokasi tidak tersedia. Pastikan fitur GPS atau layanan lokasi di perangkat Anda aktif."
            );
            break;
          case error.TIMEOUT:
            setGeoError(
              "Waktu permintaan lokasi habis (timeout). Sinyal GPS lemah atau tidak terdeteksi, silakan coba beberapa saat lagi."
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
  };

  /**
   * Handle form submit sementara
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);

    // Validasi sederhana
    if (!coords.latitude || !coords.longitude) {
      setGeoError(
        "Koordinat lokasi wajib diisi! Silakan klik tombol 'Gunakan Lokasi Saat Ini' di atas."
      );
      return;
    }

    setIsSubmitting(true);

    // Simulasi pengiriman
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: "success",
        text: "Form laporan dan data koordinat GPS berhasil disimpan!",
      });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Banner Notifikasi Submit */}
      {submitMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-xl p-4 text-sm font-medium ${
            submitMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p>{submitMessage.text}</p>
        </div>
      )}

      {/* 1. Judul Laporan */}
      <div>
        <label htmlFor="judul" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Judul Laporan <span className="text-red-500">*</span>
        </label>
        <input
          id="judul"
          name="judul"
          type="text"
          required
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Contoh: Lampu penerangan jalan umum mati di Jl. Darmo"
          className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs"
        />
      </div>

      {/* 2. Kategori Laporan */}
      <div>
        <label htmlFor="kategori" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Kategori Aduan <span className="text-red-500">*</span>
        </label>
        <select
          id="kategori"
          name="kategori"
          required
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs"
        >
          <option value="">-- Pilih Kategori Masalah --</option>
          <option value="infrastruktur">Jalan, Jembatan &amp; Trotoar Rusak</option>
          <option value="kebersihan">Kebersihan, Sampah &amp; Lingkungan</option>
          <option value="penerangan">Penerangan Jalan Umum (PJU)</option>
          <option value="drainase">Saluran Air, Drainase &amp; Banjir</option>
          <option value="ketertiban">Ketertiban Umum &amp; Gangguan Sosial</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      {/* 3. Deskripsi Laporan */}
      <div>
        <label htmlFor="deskripsi" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Deskripsi Masalah <span className="text-red-500">*</span>
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          required
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Jelaskan secara rinci kondisi masalah yang terjadi, waktu kejadian, serta dampaknya bagi masyarakat sekitar."
          className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183B7E]/20 transition-all shadow-xs"
        />
      </div>

      {/* =================================================================== */}
      {/* 4. BLOK GEOLOCATION API (FOKUS UTAMA TASK SCRUM-87)                */}
      {/* =================================================================== */}
      <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-slate-50/90 via-blue-50/40 to-indigo-50/30 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100/80 text-[#183B7E]">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              Lokasi Kejadian (Koordinat GPS) <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dapatkan posisi lintang dan bujur otomatis langsung dari sensor perangkat Anda.
            </p>
          </div>

          {/* Tombol Lokasi: "Gunakan Lokasi Saat Ini" */}
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#183B7E] hover:bg-[#132F66] active:bg-[#0F2652] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#183B7E]/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLocating ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Mencari GPS...</span>
              </>
            ) : (
              <>
                {/* Crosshair / GPS Icon */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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

        {/* State Error GPS (Error Handling) */}
        {geoError && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-xs sm:text-sm text-red-700 animate-fadeIn"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <span className="font-semibold block">Gagal Mengakses GPS:</span>
              <p className="mt-0.5 leading-relaxed">{geoError}</p>
            </div>
          </div>
        )}

        {/* State Sukses Lokasi Terbaca */}
        {geoSuccess && coords.latitude && coords.longitude && (
          <div
            role="status"
            className="flex items-center justify-between flex-wrap gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-xs text-emerald-800"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">
                Koordinat GPS berhasil diperoleh!
                {coords.accuracy !== null && (
                  <span className="font-normal text-emerald-700"> (Estimasi radius: ±{coords.accuracy} m)</span>
                )}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 underline hover:text-emerald-900 transition-colors"
            >
              Buka Google Maps
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {/* Tampilan Koordinat Lintang & Bujur (Read-Only Tanpa Penumpukan Teks) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Latitude */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="latitude"
                className="text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
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
              className="w-full rounded-lg border border-slate-300 bg-slate-100/80 px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans cursor-default select-all focus:outline-none focus:ring-1 focus:ring-slate-300 transition-colors shadow-xs"
            />
          </div>

          {/* Longitude */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="longitude"
                className="text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
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
              className="w-full rounded-lg border border-slate-300 bg-slate-100/80 px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans cursor-default select-all focus:outline-none focus:ring-1 focus:ring-slate-300 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Patokan / Catatan Alamat Tambahan (Opsional) */}
        <div>
          <label
            htmlFor="alamatDetail"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Patokan Tambahan / Nama Jalan (Opsional)
          </label>
          <input
            id="alamatDetail"
            name="alamatDetail"
            type="text"
            value={alamatDetail}
            onChange={(e) => setAlamatDetail(e.target.value)}
            placeholder="Contoh: Di depan toko swalayan / seberang pos satpam RT 03"
            className="w-full rounded-lg border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#183B7E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#183B7E]/20 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* 5. Tombol Aksi Submit Form */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#183B7E] hover:bg-[#132F66] active:bg-[#0F2652] text-white text-sm font-semibold transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#183B7E]/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Mengirim Laporan...</span>
            </>
          ) : (
            "Kirim Laporan"
          )}
        </button>
      </div>
    </form>
  );
}
export default FormLaporan;
