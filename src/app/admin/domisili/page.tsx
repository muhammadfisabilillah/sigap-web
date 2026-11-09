"use client";

import { useState } from "react";

type Status = "Menunggu" | "Diteruskan" | "Dikembalikan" | "Diterima" | "Ditolak";

type StatusAkun = "Belum Diverifikasi" | "Aktif" | "Tidak Aktif";

type Pengajuan = {
  id: number;
  nama: string;
  email: string;
  kecamatan: string;
  tanggal: string;
  status: Status;
  dokumen: string;
  alasan: string;
  statusAkun: StatusAkun;
};

const dataDummy: Pengajuan[] = [
  {
    id: 1,
    nama: "Andi Pratama",
    email: "andi@example.com",
    kecamatan: "Gubeng",
    tanggal: "24 Oktober 2026",
    status: "Menunggu",
    dokumen: "KTP_Andi.pdf",
    alasan: "",
    statusAkun: "Belum Diverifikasi",
  },
  {
    id: 2,
    nama: "Siti Rahma",
    email: "siti@example.com",
    kecamatan: "Wonokromo",
    tanggal: "23 Oktober 2026",
    status: "Diteruskan",
    dokumen: "KTP_Siti.pdf",
    alasan: "",
    statusAkun: "Belum Diverifikasi",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    email: "budi@example.com",
    kecamatan: "Rungkut",
    tanggal: "22 Oktober 2026",
    status: "Diterima",
    dokumen: "KTP_Budi.pdf",
    alasan: "",
    statusAkun: "Aktif",
  },
];

const warnaStatus: Record<Status, string> = {
  Menunggu: "bg-amber-100 text-amber-800",
  Diteruskan: "bg-blue-100 text-blue-800",
  Dikembalikan: "bg-orange-100 text-orange-800",
  Diterima: "bg-green-100 text-green-800",
  Ditolak: "bg-red-100 text-red-800",
};

export default function AdminDomisiliPage() {
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>(dataDummy);
  const [pilihan, setPilihan] = useState<Pengajuan | null>(null);
  const [pencarian, setPencarian] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [modeKembali, setModeKembali] = useState(false);
  const [modeTolak, setModeTolak] = useState(false);
  const [alasanInput, setAlasanInput] = useState("");
  const [pesan, setPesan] = useState("");

  const hasilFilter = pengajuan.filter((item) => {
    const kata = pencarian.toLowerCase();
    const cocokNama = item.nama.toLowerCase().includes(kata) || item.email.toLowerCase().includes(kata);
    const cocokStatus = filter === "Semua" || item.status === filter;

    return cocokNama && cocokStatus;
  });

  const jumlahMenunggu = pengajuan.filter((item) => item.status === "Menunggu").length;

  const jumlahDiputuskan = pengajuan.filter((item) => item.status === "Diterima" || item.status === "Ditolak").length;

  function bukaDetail(item: Pengajuan) {
    setPilihan(item);
    setModeKembali(false);
    setModeTolak(false);
    setAlasanInput("");
    setPesan("");
  }

  function perbaruiPengajuan(id: number, status: Status, alasan = "") {
    const terbaru = pengajuan.map((item) => {
      if (item.id !== id) return item;

      let statusAkun = item.statusAkun;

      if (status === "Diterima") {
        statusAkun = "Aktif";
      } else if (status === "Ditolak") {
        statusAkun = "Tidak Aktif";
      } else if (status === "Dikembalikan") {
        statusAkun = "Belum Diverifikasi";
      }

      return {
        ...item,
        status,
        alasan,
        statusAkun,
      };
    });

    setPengajuan(terbaru);
    setPilihan(terbaru.find((item) => item.id === id) ?? null);
    setModeKembali(false);
    setModeTolak(false);
    setAlasanInput("");

    const pesanStatus: Record<Status, string> = {
      Menunggu: "Status pengajuan diperbarui.",
      Diteruskan: "Pengajuan berhasil diteruskan.",
      Dikembalikan: "Pengajuan berhasil dikembalikan. Alasan telah dicatat.",
      Diterima: "Pengajuan diterima. Status akun simulasi sekarang Aktif.",
      Ditolak: "Pengajuan ditolak. Status akun simulasi sekarang Tidak Aktif.",
    };

    setPesan(pesanStatus[status]);
  }

  function kembalikanPengajuan() {
    if (!pilihan || !alasanInput.trim()) {
      setPesan("Alasan wajib diisi sebelum pengajuan dikembalikan.");
      return;
    }

    perbaruiPengajuan(pilihan.id, "Dikembalikan", alasanInput.trim());
  }

  function tolakPengajuan() {
    if (!pilihan || !alasanInput.trim()) {
      setPesan("Alasan wajib diisi sebelum pengajuan ditolak.");
      return;
    }

    perbaruiPengajuan(pilihan.id, "Ditolak", alasanInput.trim());
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-800 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header>
          <p className="text-sm font-medium text-blue-700">SIGAP SURABAYA / ADMIN</p>
          <h1 className="mt-2 text-3xl font-bold">Verifikasi Domisili</h1>
          <p className="mt-2 text-slate-500">Kelola pengajuan verifikasi domisili masyarakat Surabaya.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">Total Pengajuan</p>
            <p className="mt-2 text-3xl font-bold">{pengajuan.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">Menunggu Verifikasi</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{jumlahMenunggu}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">Sudah Diputuskan</p>
            <p className="mt-2 text-3xl font-bold text-green-700">{jumlahDiputuskan}</p>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-xl font-semibold">Daftar Pengajuan</h2>
              <p className="mt-1 text-sm text-slate-500">Cari pengajuan dan pilih detail untuk memprosesnya.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                placeholder="Cari nama atau email..."
                className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-600"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Diteruskan">Diteruskan</option>
                <option value="Dikembalikan">Dikembalikan</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama Pemohon</th>
                  <th className="px-4 py-3 font-medium">Kecamatan</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {hasilFilter.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-medium">{item.nama}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.email}</p>
                    </td>
                    <td className="px-4 py-4">{item.kecamatan}</td>
                    <td className="px-4 py-4">{item.tanggal}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${warnaStatus[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => bukaDetail(item)}
                        className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                      >
                        Lihat detail
                      </button>
                    </td>
                  </tr>
                ))}

                {hasilFilter.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada pengajuan yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {pilihan && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            onClick={() => setPilihan(null)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-detail"
              className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="judul-detail" className="text-xl font-bold">
                    Detail Pengajuan
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Informasi pemohon dan dokumen pendukung.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setPilihan(null)}
                  className="cursor-pointer rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Tutup
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Nama Pemohon", pilihan.nama],
                  ["Email", pilihan.email],
                  ["Kecamatan", pilihan.kecamatan],
                  ["Tanggal Pengajuan", pilihan.tanggal],
                  ["Status Pengajuan", pilihan.status],
                  ["Status Akun (Simulasi)", pilihan.statusAkun],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-1 font-medium">{value}</p>
                  </div>
                ))}

                <div>
                  <p className="text-sm text-slate-500">Dokumen KTP</p>
                  <div className="mt-2 rounded-lg border border-dashed p-4">
                    <p className="font-medium">{pilihan.dokumen}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pratinjau belum tersedia karena dokumen menggunakan data dummy.
                    </p>
                  </div>
                </div>

                {pilihan.alasan && (
                  <div className="rounded-lg bg-orange-50 p-4">
                    <p className="text-sm font-medium text-orange-800">Alasan</p>
                    <p className="mt-1 text-sm text-orange-900">{pilihan.alasan}</p>
                  </div>
                )}
              </div>

              {pesan && (
                <p role="status" className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  {pesan}
                </p>
              )}

              <div className="mt-6 space-y-4">
                {pilihan.status === "Menunggu" && (
                  <>
                    {!modeKembali ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => perbaruiPengajuan(pilihan.id, "Diteruskan")}
                          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                        >
                          Teruskan Pengajuan
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setModeKembali(true);
                            setPesan("");
                          }}
                          className="cursor-pointer rounded-lg bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700"
                        >
                          Kembalikan Pengajuan
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label htmlFor="alasan-kembali" className="block text-sm font-medium">
                          Alasan Pengembalian <span className="text-red-600">*</span>
                        </label>

                        <textarea
                          id="alasan-kembali"
                          value={alasanInput}
                          onChange={(e) => setAlasanInput(e.target.value)}
                          placeholder="Contoh: Dokumen KTP kurang jelas, silakan unggah ulang."
                          rows={4}
                          className="w-full rounded-lg border p-3 text-sm outline-none focus:border-orange-600"
                          required
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={kembalikanPengajuan}
                            className="cursor-pointer rounded-lg bg-orange-600 px-4 py-3 font-medium text-white hover:bg-orange-700"
                          >
                            Kirim Pengembalian
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setModeKembali(false);
                              setAlasanInput("");
                              setPesan("");
                            }}
                            className="cursor-pointer rounded-lg border px-4 py-3 font-medium hover:bg-slate-100"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {pilihan.status === "Diteruskan" && (
                  <>
                    {!modeTolak ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => perbaruiPengajuan(pilihan.id, "Diterima")}
                          className="cursor-pointer rounded-lg bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
                        >
                          Terima Pengajuan
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setModeTolak(true);
                            setPesan("");
                            setAlasanInput("");
                          }}
                          className="cursor-pointer rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
                        >
                          Tolak Pengajuan
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label htmlFor="alasan-tolak" className="block text-sm font-medium">
                          Alasan Penolakan <span className="text-red-600">*</span>
                        </label>

                        <textarea
                          id="alasan-tolak"
                          value={alasanInput}
                          onChange={(e) => setAlasanInput(e.target.value)}
                          placeholder="Jelaskan alasan pengajuan ditolak."
                          rows={4}
                          className="w-full rounded-lg border p-3 text-sm outline-none focus:border-red-600"
                          required
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={tolakPengajuan}
                            className="cursor-pointer rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
                          >
                            Konfirmasi Penolakan
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setModeTolak(false);
                              setAlasanInput("");
                              setPesan("");
                            }}
                            className="cursor-pointer rounded-lg border px-4 py-3 font-medium hover:bg-slate-100"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {(pilihan.status === "Diterima" ||
                  pilihan.status === "Ditolak" ||
                  pilihan.status === "Dikembalikan") && (
                  <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-600">
                    Pengajuan ini sudah diproses pada tahap saat ini. Tidak ada tindakan lanjutan yang tersedia di
                    halaman demonstrasi.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPilihan(null)}
                className="mt-4 w-full cursor-pointer rounded-lg border px-4 py-3 font-medium hover:bg-slate-100"
              >
                Kembali ke Daftar
              </button>
            </section>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Mode demonstrasi: data dan status akun masih dummy, belum disimpan ke database.
        </p>
      </div>
    </main>
  );
}
