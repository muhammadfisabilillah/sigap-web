import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panduan Penggunaan SIGAP',
  description:
    'Cara menggunakan SIGAP — Sistem Informasi Gerak Aduan Publik Kota Surabaya: cara kerja, cara membuat aduan, dan etika berpartisipasi.',
};

const CARA_KERJA = [
  {
    judul: '1. Daftar & verifikasi domisili',
    isi: 'Buat akun dengan email dan kata sandi, lalu ajukan verifikasi domisili dengan mengunggah foto KTP asli. Setelah diverifikasi petugas, akun Anda aktif dan dapat membuat aduan.',
  },
  {
    judul: '2. Buat aduan',
    isi: 'Isi judul, deskripsi, pilih kategori dan kecamatan, tentukan lokasi (tombol “Ambil lokasi saya” atau klik peta), dan lampirkan minimal 1 foto. Anda mendapat nomor tiket untuk melacak aduan.',
  },
  {
    judul: '3. Diteruskan ke yang berwenang',
    isi: 'Admin memeriksa kelayakan aduan dan meneruskannya ke petugas kecamatan atau instansi terkait (mis. Dinas Bina Marga untuk jalan rusak).',
  },
  {
    judul: '4. Ditindaklanjuti sampai selesai',
    isi: 'Petugas mencatat tindak lanjut di lapangan. Status aduan berubah dari Menunggu verifikasi → Diproses → Diteruskan → Menunggu tinjauan → Selesai. Anda menerima notifikasi pada setiap perubahan status.',
  },
];

const BIJAK = [
  {
    judul: 'Adukan hanya yang Anda lihat nyata',
    isi: 'Laporkan persoalan di sekitar Anda (jalan rusak, banjir, sampah, penerangan mati, fasilitas rusak). Bukan rumor, bukan gosip, dan bukan aduan palsu.',
  },
  {
    judul: 'Tulis sejelas mungkin',
    isi: 'Judul dan deskripsi yang spesifik (lokasi persis, kapan terjadi, seberapa mendesak) membantu petugas bertindak lebih cepat.',
  },
  {
    judul: 'Foto yang jelas, lokasi akurat',
    isi: 'Foto tampak keseluruhan objek, tidak buram, dan koordinat yang benar-benar menunjuk ke tempat kejadian.',
  },
  {
    judul: 'Tidak mengandung ujaran kebencian',
    isi: 'Hindari umpatan, SARA, fitnah, atau fitnah perorangan. Fokus pada persoalan, bukan menyerang orang.',
  },
  {
    judul: 'Jangan spam',
    isi: 'Satu persoalan, satu aduan. Aduan duplikat memperlambat penanganan aduan warga lain yang lebih mendesak.',
  },
  {
    judul: 'Dukung aduan warga lain dengan jujur',
    isi: 'Gunakan tombol Dukung untuk aduan yang benar-benar penting. Dukungan palsu mengalahkan prioritas nyata.',
  },
  {
    judul: 'Wariskan etika digital ini',
    isi: 'Adukan sekali, pantau dengan sabar. Jangan menuntut di luar jalur resmi — SIGAP bekerja dengan prosedur, bukan teriakan.',
  },
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-[17px] font-bold tracking-tight text-ink">
            SIGAP <span className="text-xs font-medium text-muted">Surabaya</span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-brand hover:underline">
            Masuk
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
          Panduan Warga
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-ink">
          Cara menggunakan SIGAP dengan bijak
        </h1>
        <p className="mt-3 text-muted">
          SIGAP adalah kanal resmi Pemerintah Kota Surabaya untuk menyalurkan aduan warga.
          Agar setiap aduan bisa ditindaklanjuti dengan cepat dan adil, gunakan SIGAP sesuai
          panduan berikut.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Cara kerja SIGAP</h2>
          <ol className="mt-4 space-y-4">
            {CARA_KERJA.map((item) => (
              <li key={item.judul} className="rounded-xl border border-line bg-card p-5">
                <h3 className="font-semibold text-ink">{item.judul}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.isi}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Etika berpartisipasi</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {BIJAK.map((item) => (
              <li key={item.judul} className="rounded-xl border border-line bg-card p-5">
                <h3 className="text-sm font-semibold text-ink">{item.judul}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.isi}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-xl border border-line bg-brand-soft p-5">
          <h2 className="font-semibold text-brand">Butuh bantuan?</h2>
          <p className="mt-1 text-sm leading-relaxed text-brand/90">
            Jika akun Anda mengalami kendala (aduan tidak bergerak, verifikasi ditolak, atau lupa
            kata sandi), hubungi admin SIGAP melalui email saran@surabaya.go.id atau datang ke
            Balai Kota Surabaya.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white hover:bg-brand-hover"
          >
            Daftar sekarang
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-line px-5 py-3 text-sm font-medium text-muted hover:text-ink"
          >
            Kembali masuk
          </Link>
        </div>
      </main>
    </div>
  );
}
