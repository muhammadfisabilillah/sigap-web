// SCRUM-76: Tampilkan alasan penolakan dan pengajuan ulang
"use client";

import React from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Mock data — akan diganti data real dari API (getSessionUser + db query)
// ---------------------------------------------------------------------------
const mockPengajuanDomisili = {
  nama: "Rafi Abdullah Afif",
  nik: "3578012345670001",
  kecamatan: "Gubeng",
  kelurahan: "Mojo",
  nomorPengajuan: "DOM-SBY-202610-0089",
  tanggalPengajuan: "24 Oktober 2026, 09:15 WIB",
  tanggalVerifikasi: "24 Oktober 2026, 11:42 WIB",
  status: "Ditolak" as "Ditolak" | "Menunggu" | "Diterima",
  alasanPenolakan:
    "Foto KTP tidak terbaca jelas dan dokumen pendukung kurang lengkap.",
  catatanPetugas:
    "Mohon unggah ulang foto e-KTP asli (bukan fotokopi buram), pastikan tidak ada pantulan cahaya (glare), dan sertakan surat keterangan RT/RW jika alamat berbeda.",
  namaBerkas: "KTP_Rafi_Abdullah_Afif.jpg",
  ukuranBerkas: "1.4 MB",
};

// ---------------------------------------------------------------------------
// Icon helpers (inline SVG — tanpa dependency tambahan)
// ---------------------------------------------------------------------------
function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function IconXCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function IconAlertTriangle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function IconFile({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Panduan perbaikan berkas
// ---------------------------------------------------------------------------
const panduanPerbaikan = [
  "Pastikan foto e-KTP tampak jelas, fokus, dan tidak terpotong pada keempat sudutnya.",
  "Hindari kilatan lampu/cahaya langsung yang menutupi teks NIK, Nama, atau Alamat.",
  "Format berkas yang didukung: JPG, PNG, atau PDF dengan ukuran maksimal 5 MB.",
  "Sertakan surat keterangan RT/RW jika alamat pada KTP berbeda dengan domisili saat ini.",
];

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function StatusPengajuanDomisiliPage() {
  const data = mockPengajuanDomisili;
  const isDitolak = data.status === "Ditolak";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* ------------------------------------------------------------------ */}
      {/* Header Navigasi                                                      */}
      {/* ------------------------------------------------------------------ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo SIGAP */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M3.75 8.25a.75.75 0 0 1 .75-.75h2.89l5.05-3.366A1 1 0 0 1 14 4.966V19.034a1 1 0 0 1-1.56.832L7.39 16.5H4.5a.75.75 0 0 1-.75-.75V8.25zm12.5 1.5a1 1 0 0 1 1 1 3.5 3.5 0 0 1 0 2.5 1 1 0 1 1-1.898-.633 1.5 1.5 0 0 0 0-1.234 1 1 0 0 1 .898-.633zM18 5.75a1 1 0 0 1 1 1 7.5 7.5 0 0 1 0 10.5 1 1 0 1 1-1.5-1.32 5.5 5.5 0 0 0 0-7.86 1 1 0 0 1 .5-2.32z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base leading-tight">SIGAP</div>
              <div className="text-[11px] text-slate-500 font-medium leading-none">Surabaya</div>
            </div>
          </Link>

          {/* Navigasi Tengah */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/laporan/publik" className="hover:text-slate-900 transition-colors">Laporan Publik</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dasbor</Link>
            <Link href="/laporan/saya" className="hover:text-slate-900 transition-colors">Laporan Saya</Link>
          </nav>

          {/* Profil & Notifikasi */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <IconBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1e3a8a] font-bold text-xs flex items-center justify-center select-none">
              RA
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <IconArrowLeft className="w-4 h-4" />
            Kembali ke Dasbor
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Status Pengajuan Domisili
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status verifikasi berkas domisili KTP Kota Surabaya Anda.
          </p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Banner Status Ditolak (hanya tampil bila status = Ditolak)        */}
        {/* ---------------------------------------------------------------- */}
        {isDitolak && (
          <div className="mb-6 flex items-start gap-4 bg-red-600 text-white rounded-2xl px-5 py-4 shadow-md shadow-red-200">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <IconXCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base leading-snug">
                Pengajuan Verifikasi Domisili Ditolak
              </p>
              <p className="text-red-100 text-sm mt-0.5">
                Tinjau alasan penolakan di bawah, perbaiki berkas Anda, lalu ajukan kembali.
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Card Utama                                                         */}
        {/* ---------------------------------------------------------------- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* Card Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Nomor Pengajuan
              </span>
              <div className="font-semibold text-slate-900 text-base sm:text-lg mt-0.5">
                {data.nomorPengajuan}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Diajukan pada: {data.tanggalPengajuan}
              </div>
            </div>

            {/* Badge Status */}
            <div className="self-start sm:self-center">
              {data.status === "Ditolak" && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100">
                  <IconXCircle className="w-3.5 h-3.5" />
                  Ditolak
                </span>
              )}
              {data.status === "Menunggu" && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Menunggu Verifikasi
                </span>
              )}
              {data.status === "Diterima" && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <IconCheck className="w-3.5 h-3.5" />
                  Diterima
                </span>
              )}
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-6 space-y-6">
            {/* -------------------------------------------------------------- */}
            {/* Alert Box Alasan Penolakan                                       */}
            {/* -------------------------------------------------------------- */}
            {isDitolak && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6">
                {/* Judul alert dengan icon AlertTriangle */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <IconAlertTriangle className="w-4.5 h-4.5 text-red-600 w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-red-900 tracking-tight">
                    Alasan Penolakan
                  </h2>
                </div>

                {/* Pesan penolakan utama */}
                <p className="text-sm text-red-800 leading-relaxed font-medium pl-10">
                  {data.alasanPenolakan}
                </p>

                {/* Catatan petugas */}
                {data.catatanPetugas && (
                  <div className="mt-4 pl-10">
                    <div className="bg-red-100/60 border border-red-200/70 rounded-lg px-4 py-3">
                      <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1.5">
                        Catatan Petugas Verifikator
                      </p>
                      <p className="text-xs text-red-700 leading-relaxed">
                        {data.catatanPetugas}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tanggal verifikasi */}
                <p className="mt-3 pl-10 text-xs text-red-500">
                  Diverifikasi pada: {data.tanggalVerifikasi}
                </p>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* Panduan Perbaikan Berkas                                         */}
            {/* -------------------------------------------------------------- */}
            <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-blue-900 inline-block" />
                Panduan Perbaikan Berkas
              </h3>
              <ul className="space-y-3">
                {panduanPerbaikan.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <IconCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Rincian Data Pengajuan                                           */}
            {/* -------------------------------------------------------------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 font-medium">Nama Pemohon</span>
                <p className="text-sm font-semibold text-slate-800">{data.nama}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 font-medium">NIK</span>
                <p className="text-sm font-semibold text-slate-800 font-mono tracking-wide">{data.nik}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 font-medium">Kecamatan &amp; Kelurahan</span>
                <p className="text-sm font-semibold text-slate-800">
                  Kec. {data.kecamatan}, Kel. {data.kelurahan}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Berkas yang Diunggah</span>
                <div className="inline-flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                  <IconFile className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-mono text-xs">{data.namaBerkas}</span>
                  <span className="text-xs text-slate-400">({data.ukuranBerkas})</span>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* Tombol Aksi                                                       */}
            {/* -------------------------------------------------------------- */}
            <div className="pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm text-center transition-colors"
              >
                Kembali ke Dasbor
              </Link>

              {/* Tombol Pengajuan Ulang — mengarah ke /domisili/pengajuan */}
              <Link
                href="/domisili/pengajuan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-950 active:bg-blue-950 text-white font-semibold text-sm transition-all duration-150 shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 ring-1 ring-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              >
                <IconRefresh className="w-4 h-4 flex-shrink-0" />
                Ajukan Ulang Domisili
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
