import React from "react";
import Link from "next/link";

// Mock data untuk pengajuan verifikasi domisili warga
const mockPengajuanDomisili = {
  nama: "Rafi Abdullah Afif",
  nik: "3578012345670001",
  kecamatan: "Gubeng",
  kelurahan: "Mojo",
  nomorPengajuan: "DOM-SBY-202610-0089",
  tanggalPengajuan: "24 Oktober 2026, 09:15 WIB",
  tanggalVerifikasi: "24 Oktober 2026, 11:42 WIB",
  status: "Ditolak",
  alasanPenolakan:
    "Foto KTP tidak terbaca jelas dan dokumen pendukung kurang lengkap.",
  catatanPetugas:
    "Mohon unggah ulang foto e-KTP asli (bukan fotokopi buram), pastikan tidak ada pantulan cahaya (glare), dan sertakan surat keterangan RT/RW jika alamat berbeda.",
  namaBerkas: "KTP_Rafi_Abdullah_Afif.jpg",
  ukuranBerkas: "1.4 MB",
};

export default function StatusPengajuanDomisiliPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Navigasi SIGAP Surabaya */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo SIGAP */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 2v3h-2V3.5a1.5 1.5 0 0 0-3 0V5H9V3.5a1.5 1.5 0 0 0-3 0V5H4v14h2v-1.5a1.5 1.5 0 0 0 3 0V19h6v-1.5a1.5 1.5 0 0 0 3 0V19h2v-3h2v5H2V2h18zm-4 5H8v8h8V7z" opacity="0.1" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" opacity="0" />
                {/* Megaphone icon */}
                <path d="M3.75 8.25a.75.75 0 0 1 .75-.75h2.89l5.05-3.366A1 1 0 0 1 14 4.966V19.034a1 1 0 0 1-1.56.832L7.39 16.5H4.5a.75.75 0 0 1-.75-.75V8.25zm12.5 1.5a1 1 0 0 1 1 1 3.5 3.5 0 0 1 0 2.5 1 1 0 1 1-1.898-.633 1.5 1.5 0 0 0 0-1.234 1 1 0 0 1 .898-.633zM18 5.75a1 1 0 0 1 1 1 7.5 7.5 0 0 1 0 10.5 1 1 0 1 1-1.5-1.32 5.5 5.5 0 0 0 0-7.86 1 1 0 0 1 .5-2.32z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base leading-tight">
                SIGAP
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-none">
                Surabaya
              </div>
            </div>
          </Link>

          {/* Menu Navigasi Tengah */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link
              href="#"
              className="hover:text-slate-900 transition-colors"
            >
              Laporan Publik
            </Link>
            <Link
              href="#"
              className="hover:text-slate-900 transition-colors"
            >
              Dasbor
            </Link>
            <Link
              href="#"
              className="hover:text-slate-900 transition-colors"
            >
              Laporan Saya
            </Link>
          </nav>

          {/* Profile & Notifikasi */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1e3a8a] font-bold text-xs flex items-center justify-center">
                RA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Dasbor
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Status Pengajuan Domisili
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status verifikasi berkas domisili KTP Kota Surabaya Anda.
          </p>
        </div>

        {/* Card Utama (bg-white, rounded-2xl, shadow-sm) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          {/* Card Header: Nomor Pengajuan & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Nomor Pengajuan
              </span>
              <div className="font-semibold text-slate-900 text-base sm:text-lg">
                {mockPengajuanDomisili.nomorPengajuan}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Diajukan pada: {mockPengajuanDomisili.tanggalPengajuan}
              </div>
            </div>

            {/* Badge Status Merah "Ditolak" */}
            <div className="self-start sm:self-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                {mockPengajuanDomisili.status}
              </span>
            </div>
          </div>

          {/* Alert Box Merah/Oranye Terang untuk Alasan Penolakan */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-red-900">
                  Pengajuan Verifikasi Ditolak
                </h2>
                <p className="mt-1 text-sm text-red-700 leading-relaxed font-medium">
                  {mockPengajuanDomisili.alasanPenolakan}
                </p>

                {mockPengajuanDomisili.catatanPetugas && (
                  <div className="mt-3 pt-3 border-t border-red-200/70 text-xs text-red-600">
                    <span className="font-semibold text-red-800">
                      Catatan Petugas Verifikator:
                    </span>{" "}
                    {mockPengajuanDomisili.catatanPetugas}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panduan Pengajuan Ulang */}
          <div className="mt-6 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Panduan Perbaikan Berkas:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Pastikan foto e-KTP tampak jelas, fokus, dan tidak terpotong pada keempat sudutnya.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Hindari kilatan lampu/cahaya langsung yang menutupi teks NIK, Nama, atau Alamat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Format berkas yang didukung: JPG, PNG, atau PDF dengan ukuran maksimal 5 MB.
                </span>
              </li>
            </ul>
          </div>

          {/* Rincian Data Pengajuan */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400">Nama Pemohon</span>
              <p className="text-sm font-medium text-slate-800">
                {mockPengajuanDomisili.nama}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">NIK</span>
              <p className="text-sm font-medium text-slate-800">
                {mockPengajuanDomisili.nik}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Kecamatan & Kelurahan</span>
              <p className="text-sm font-medium text-slate-800">
                Kec. {mockPengajuanDomisili.kecamatan}, Kel.{" "}
                {mockPengajuanDomisili.kelurahan}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Berkas yang Diunggah</span>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg w-fit">
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-mono text-xs">
                  {mockPengajuanDomisili.namaBerkas}
                </span>
                <span className="text-xs text-slate-400">
                  ({mockPengajuanDomisili.ukuranBerkas})
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi: Tombol Utama Biru Tua Khas SIGAP */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm text-center transition-colors"
            >
              Kembali ke Dasbor
            </Link>

            <Link
              href="/domisili"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-medium text-sm text-center transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Pengajuan Ulang Domisili
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
