"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

export type StatusFilter = "Semua" | "Menunggu" | "Diterima" | "Ditolak";

export type PengajuanItem = {
  id: number;
  userId: number;
  nama: string;
  email: string;
  noHp: string | null;
  kecamatanId: number;
  kecamatanNama: string;
  status: "Menunggu" | "Diterima" | "Ditolak";
  catatan: string | null;
  fileKtpUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type PetugasInfo = {
  id: number;
  nama: string;
  email: string;
  role: string;
  kecamatanId: number;
  kecamatanNama: string;
};

// Data cadangan simulasi wilayah Surabaya jika endpoint belum tersambung ke live DB
const MOCK_PETUGAS_DEFAULT: PetugasInfo = {
  id: 2,
  nama: "Alya Fazaristi",
  email: "petugas.gubeng@surabaya.go.id",
  role: "Petugas",
  kecamatanId: 8,
  kecamatanNama: "Gubeng",
};

const MOCK_PENGAJUAN_DEFAULT: PengajuanItem[] = [
  {
    id: 101,
    userId: 201,
    nama: "Ahmad Fauzi Rahman",
    email: "ahmad.fauzi@surabaya.id",
    noHp: "0812-3456-7801",
    kecamatanId: 8,
    kecamatanNama: "Gubeng",
    status: "Menunggu",
    catatan: null,
    fileKtpUrl: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-24T08:30:00.000Z",
    updatedAt: "2026-10-24T08:30:00.000Z",
  },
  {
    id: 102,
    userId: 202,
    nama: "Siti Nurhaliza",
    email: "siti.nurhaliza@surabaya.id",
    noHp: "0812-3456-7802",
    kecamatanId: 8,
    kecamatanNama: "Gubeng",
    status: "Menunggu",
    catatan: null,
    fileKtpUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-24T09:15:00.000Z",
    updatedAt: "2026-10-24T09:15:00.000Z",
  },
  {
    id: 103,
    userId: 203,
    nama: "Budi Hartono",
    email: "budi.hartono@surabaya.id",
    noHp: "0812-3456-7803",
    kecamatanId: 8,
    kecamatanNama: "Gubeng",
    status: "Diterima",
    catatan: "Dokumen KTP valid dan sesuai domisili RT 04 / RW 02 Kelurahan Mojo, Gubeng.",
    fileKtpUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-23T14:20:00.000Z",
    updatedAt: "2026-10-23T15:00:00.000Z",
  },
  {
    id: 104,
    userId: 204,
    nama: "Dewi Lestari",
    email: "dewi.lestari@surabaya.id",
    noHp: "0812-3456-7804",
    kecamatanId: 8,
    kecamatanNama: "Gubeng",
    status: "Ditolak",
    catatan: "Foto KTP buram dan silau (glare), NIK serta alamat RT/RW tidak terbaca jelas.",
    fileKtpUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-10-22T10:05:00.000Z",
    updatedAt: "2026-10-22T11:30:00.000Z",
  },
];

export function FilterPengajuanPetugas() {
  const [petugas, setPetugas] = useState<PetugasInfo>(MOCK_PETUGAS_DEFAULT);
  const [daftarPengajuan, setDaftarPengajuan] = useState<PengajuanItem[]>(MOCK_PENGAJUAN_DEFAULT);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanItem | null>(null);
  const [catatanInput, setCatatanInput] = useState("");
  const [modeTolak, setModeTolak] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Ambil data pengajuan terfilter kecamatan petugas dari API
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch("/api/petugas/domisili");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.pengajuan)) {
            setDaftarPengajuan(data.pengajuan);
            if (data.petugas) {
              setPetugas(data.petugas);
            }
          }
        }
      } catch (err) {
        console.warn("Gagal menghubungi API /api/petugas/domisili, memakai data simulasi wilayah:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter pengajuan berdasarkan pencarian dan status (HANYA dalam kecamatan petugas)
  const hasilFilter = useMemo(() => {
    return daftarPengajuan.filter((item) => {
      // Validasi mutlak kecamatan petugas
      const cocokKecamatan = item.kecamatanId === petugas.kecamatanId;
      if (!cocokKecamatan) return false;

      // Filter status
      const cocokStatus = statusFilter === "Semua" || item.status === statusFilter;

      // Filter query pencarian
      const q = searchQuery.toLowerCase().trim();
      const cocokSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        (item.noHp && item.noHp.includes(q));

      return cocokStatus && cocokSearch;
    });
  }, [daftarPengajuan, statusFilter, searchQuery, petugas.kecamatanId]);

  // Statistik untuk kecamatan petugas
  const stats = useMemo(() => {
    const list = daftarPengajuan.filter((d) => d.kecamatanId === petugas.kecamatanId);
    return {
      total: list.length,
      menunggu: list.filter((d) => d.status === "Menunggu").length,
      diterima: list.filter((d) => d.status === "Diterima").length,
      ditolak: list.filter((d) => d.status === "Ditolak").length,
    };
  }, [daftarPengajuan, petugas.kecamatanId]);

  // Handler proses verifikasi
  async function handleVerifikasi(pengajuanId: number, status: "Diterima" | "Ditolak", catatan?: string) {
    setProcessingId(pengajuanId);
    try {
      const res = await fetch("/api/petugas/domisili", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pengajuanId, status, catatan }),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        setToastMessage({
          type: "success",
          text: `Pengajuan berhasil ${status === "Diterima" ? "disetujui" : "ditolak"}.`,
        });
      } else {
        // Fallback update lokal jika berjalan di lingkungan tanpa koneksi DB server
        setToastMessage({
          type: "success",
          text: `[Simulasi] Pengajuan berhasil ${status === "Diterima" ? "disetujui" : "ditolak"}.`,
        });
      }

      // Update state lokal
      setDaftarPengajuan((prev) =>
        prev.map((item) =>
          item.id === pengajuanId
            ? { ...item, status, catatan: catatan || item.catatan, updatedAt: new Date().toISOString() }
            : item,
        ),
      );

      // Tutup modal / drawer
      setSelectedPengajuan(null);
      setModeTolak(false);
      setCatatanInput("");
    } catch {
      setToastMessage({
        type: "error",
        text: "Gagal memproses verifikasi. Periksa koneksi internet Anda.",
      });
    } finally {
      setProcessingId(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  }

  function formatTanggal(isoString: string) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Portal Petugas SIGAP */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/petugas" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 tracking-tight text-base leading-tight flex items-center gap-2">
                  <span>SIGAP Surabaya</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Petugas
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-none">
                  Sistem Informasi Gerak Aduan Publik
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Tag Wilayah Kecamatan Petugas */}
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Wilayah Tugas: <strong>Kecamatan {petugas.kecamatanNama}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                {petugas.nama.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-800">{petugas.nama}</div>
                <div className="text-[10px] text-slate-500">Petugas Kec. {petugas.kecamatanNama}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Identitas Filter Wilayah Kecamatan */}
        <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-blue-200 text-xs font-medium mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Filter Aktif: Berdasarkan Kecamatan Petugas
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pengajuan Domisili Kecamatan {petugas.kecamatanNama}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Daftar di bawah ini telah disaring secara otomatis khusus untuk warga yang berdomisili di wilayah kerja <strong>Kecamatan {petugas.kecamatanNama}</strong>. Lakukan peninjauan berkas KTP dan verifikasi status domisili warga.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <svg className="w-72 h-72 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
          </div>
        </section>

        {/* Notifikasi Toast */}
        {toastMessage && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium transition-all ${
              toastMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs underline hover:opacity-80 ml-4 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Statistik Ringkasan Pengajuan Kecamatan */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pengajuan</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</div>
            <div className="mt-1 text-xs text-slate-500">Warga Kec. {petugas.kecamatanNama}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Menunggu Verifikasi</div>
            <div className="mt-2 text-3xl font-bold text-amber-600">{stats.menunggu}</div>
            <div className="mt-1 text-xs text-amber-600">Perlu peninjauan segera</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Telah Diterima</div>
            <div className="mt-2 text-3xl font-bold text-emerald-600">{stats.diterima}</div>
            <div className="mt-1 text-xs text-emerald-600">Domisili terkonfirmasi</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/30 shadow-xs">
            <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Ditolak</div>
            <div className="mt-2 text-3xl font-bold text-rose-600">{stats.ditolak}</div>
            <div className="mt-1 text-xs text-rose-600">Perlu perbaikan berkas</div>
          </div>
        </section>

        {/* Bilah Filter & Pencarian */}
        <section className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              {(["Semua", "Menunggu", "Diterima", "Ditolak"] as StatusFilter[]).map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-blue-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <span>{st === "Semua" ? "Semua Status" : st}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {st === "Semua"
                        ? stats.total
                        : st === "Menunggu"
                        ? stats.menunggu
                        : st === "Diterima"
                        ? stats.diterima
                        : stats.ditolak}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Input Pencarian */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, no. HP..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Indikator Wilayah & Hasil */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Menampilkan <strong>{hasilFilter.length}</strong> pengajuan warga di <strong>Kecamatan {petugas.kecamatanNama}</strong>
              </span>
            </div>
            {searchQuery && (
              <span className="text-blue-600 font-medium">Kata kunci: &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>
        </section>

        {/* Tabel / Daftar Pengajuan */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Memuat data pengajuan Kecamatan {petugas.kecamatanNama}...
            </div>
          ) : hasilFilter.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-800">Tidak ada pengajuan yang cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "Semua"
                  ? "Coba ubah kata kunci pencarian atau ganti pilihan filter status di atas."
                  : `Belum ada pengajuan verifikasi domisili yang masuk untuk wilayah Kecamatan ${petugas.kecamatanNama}.`}
              </p>
              {(searchQuery || statusFilter !== "Semua") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("Semua");
                  }}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Warga Pemohon</th>
                    <th scope="col" className="px-6 py-3.5">Kecamatan</th>
                    <th scope="col" className="px-6 py-3.5">Tanggal Masuk</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5">Berkas KTP</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Aksi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hasilFilter.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.nama}</div>
                        <div className="text-xs text-slate-500">{item.email}</div>
                        {item.noHp && <div className="text-[11px] text-slate-400 mt-0.5">{item.noHp}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Kec. {item.kecamatanNama}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatTanggal(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Menunggu"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : item.status === "Diterima"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {item.status === "Menunggu" ? "Menunggu Verifikasi" : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={item.fileKtpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline hover:text-blue-800"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat KTP
                        </a>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPengajuan(item);
                            setModeTolak(false);
                            setCatatanInput(item.catatan || "");
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Tinjau & Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modal / Detail Pengajuan & Verifikasi */}
        {selectedPengajuan && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Tinjau Pengajuan Domisili</h3>
                  <p className="text-xs text-slate-500">
                    Wilayah: <strong>Kecamatan {selectedPengajuan.kecamatanNama}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPengajuan(null);
                    setModeTolak(false);
                    setCatatanInput("");
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Info Warga */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="font-semibold text-slate-900">{selectedPengajuan.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-medium text-slate-800">{selectedPengajuan.email}</span>
                </div>
                {selectedPengajuan.noHp && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nomor Telepon:</span>
                    <span className="font-medium text-slate-800">{selectedPengajuan.noHp}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecamatan Domisili:</span>
                  <span className="font-bold text-blue-700">Kec. {selectedPengajuan.kecamatanNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Saat Ini:</span>
                  <span
                    className={`font-semibold ${
                      selectedPengajuan.status === "Menunggu"
                        ? "text-amber-600"
                        : selectedPengajuan.status === "Diterima"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {selectedPengajuan.status}
                  </span>
                </div>
              </div>

              {/* Preview Berkas KTP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Foto / Berkas KTP:
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center max-h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPengajuan.fileKtpUrl}
                    alt={`KTP ${selectedPengajuan.nama}`}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={() => window.open(selectedPengajuan.fileKtpUrl, "_blank")}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Klik gambar untuk melihat ukuran penuh pada tab baru
                </p>
              </div>

              {/* Form Alasan Penolakan jika Mode Tolak Aktif */}
              {modeTolak ? (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label htmlFor="catatan-tolak" className="block text-xs font-semibold text-rose-700">
                    Alasan Penolakan Pengajuan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="catatan-tolak"
                    rows={3}
                    value={catatanInput}
                    onChange={(e) => setCatatanInput(e.target.value)}
                    placeholder="Contoh: Foto KTP tidak jelas / alamat KTP bukan di wilayah Kecamatan Gubeng..."
                    className="w-full p-2.5 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-rose-600 bg-rose-50/20"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!catatanInput.trim() || processingId === selectedPengajuan.id}
                      onClick={() =>
                        handleVerifikasi(selectedPengajuan.id, "Ditolak", catatanInput.trim())
                      }
                      className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {processingId === selectedPengajuan.id ? "Memproses..." : "Konfirmasi Tolak"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModeTolak(false);
                        setCatatanInput("");
                      }}
                      className="py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                /* Tombol Aksi Verifikasi */
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      disabled={processingId === selectedPengajuan.id}
                      onClick={() =>
                        handleVerifikasi(
                          selectedPengajuan.id,
                          "Diterima",
                          "Disetujui oleh Petugas Kecamatan.",
                        )
                      }
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {processingId === selectedPengajuan.id ? "Memproses..." : "Terima Pengajuan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setModeTolak(true)}
                      className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Tolak Pengajuan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

