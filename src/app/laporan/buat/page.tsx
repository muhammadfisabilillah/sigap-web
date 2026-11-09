import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { FormLaporan } from "@/src/components/laporan/FormLaporan";

export const metadata: Metadata = {
  title: "Buat Laporan Warga | SIGAP Surabaya",
  description:
    "Formulir pembuatan aduan dan laporan masyarakat Kota Surabaya dengan integrasi Geolocation GPS.",
};

export default function BuatLaporanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100/80 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      {/* Elemen Dekoratif Aksen Pastel di Background */}
      <div className="absolute top-0 right-0 -mr-28 -mt-28 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-28 w-80 h-80 rounded-full bg-slate-300/30 blur-3xl pointer-events-none" />

      {/* =================================================================== */}
      {/* Header Navigasi SIGAP Surabaya                                      */}
      {/* =================================================================== */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
              <div className="font-bold text-slate-900 tracking-tight text-base leading-tight">
                SIGAP
              </div>
              <div className="text-[11px] text-slate-500 font-medium leading-none">
                Surabaya
              </div>
            </div>
          </Link>

          {/* Navigasi Tengah */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/laporan/publik" className="hover:text-slate-900 transition-colors">
              Laporan Publik
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Dasbor
            </Link>
            <Link href="/laporan/saya" className="hover:text-slate-900 transition-colors">
              Laporan Saya
            </Link>
          </nav>

          {/* Profil Warga */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-[#183B7E] font-bold text-xs flex items-center justify-center select-none ring-2 ring-white">
              RA
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* Konten Utama                                                        */}
      {/* =================================================================== */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* Breadcrumb / Kembali */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Dasbor
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Pembuatan Laporan Warga
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Sampaikan permasalahan di lingkungan Anda dengan menyertakan titik lokasi koordinat yang akurat.
          </p>
        </div>

        {/* Card Formulir dengan Nuansa Lembut Elegan */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-200/90 p-6 sm:p-9">
          <FormLaporan />
        </div>
      </main>
    </div>
  );
}
