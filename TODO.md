# SIGAP — Todo List

Terakhir diperbarui: 9 November 2026
Branch aktif: `feature/SCRUM-68-auth-ui`

---

## Selesai

- [x] Setup Next.js 16 App Router, Tailwind v4, Prisma 8, Supabase
- [x] Data contract 11 entitas (`contract.prisma`) + migrasi + seed 31 kecamatan, 10 kategori, 6 instansi
- [x] Autentikasi: register, login, logout, sesi DB-backed, guard peran
- [x] API verifikasi domisili: upload KTP ke Supabase Storage, validasi JPG/PNG/PDF maks 2 MB
- [x] UI login & register (foto Sura-Baya, lalu diganti skyline Surabaya)
- [x] Redirect per peran: `/` → `/warga`, `/admin`, `/petugas`, atau `/login`
- [x] Dashboard awal Warga, Admin, Petugas + halaman `/domisili`
- [x] Redesign anti AI-slop: font Plus Jakarta Sans, palet kertas hangat + hijau tua, icon dihapus, kartu tanpa shadow
- [x] `npm run lint` dan `npm run build` lolos

---

## Prioritas 1 — Modul Aduan Warga (inti aplikasi)

- [x] API buat aduan: `POST /api/aduan` (judul, deskripsi, kategori, kecamatan, lat/long, foto)
- [x] Upload foto aduan ke Supabase Storage (bucket `aduan`)
- [x] Generate nomor tiket unik (`nomorTiket`)
- [x] Form buat aduan di `/warga/aduan/baru`
- [x] Integrasi Geolocation API untuk isi koordinat otomatis
- [x] Halaman daftar "Aduan Saya" + detail aduan + riwayat status
- [x] Halaman "Laporan Publik" untuk warga sekecamatan
- [ ] API list aduan: `GET /api/aduan?scope=mine|public` (sudah ada, tinggal dipakai/ditest)

## Prioritas 2 — Verifikasi & Pengelolaan Admin

- [x] Halaman Admin: daftar pengajuan domisili menunggu verifikasi
- [x] Aksi terima/tolak verifikasi domisili + catatan penolakan
- [x] Saat diterima: update `User.statusAkun` → `Terverifikasi`
- [x] Halaman Admin: daftar aduan masuk, filter per status/kategori/kecamatan
- [x] Aksi teruskan aduan ke instansi / petugas kecamatan
- [x] Aksi tetapkan status akhir (Selesai / Ditolak)

## Prioritas 3 — Dashboard Petugas Kecamatan

- [x] Halaman daftar aduan wilayah (filter `kecamatanId` petugas)
- [x] Form update progres tindak lanjut + catatan lapangan
- [x] Halaman validasi domisili warga di wilayahnya
- [x] Halaman riwayat tindak lanjut

## Prioritas 4 — Partisipasi & Notifikasi

- [ ] API upvote/unvote (`POST /api/aduan/[id]/upvote`), jaga `totalUpvote` tetap konsisten
- [ ] Tampilkan jumlah upvote + urutan prioritas di daftar laporan publik
- [x] Buat notifikasi saat status aduan berubah
- [ ] Halaman/icon notifikasi di header (belum dibaca / sudah dibaca)

## Prioritas 4b — Otomatisasi Status Aduan (todo berikutnya)

Tujuan: status aduan mengalir berurutan tanpa harus pilih manual dari daftar semua status.

- [ ] **Alur status berurutan (workflow)** — batasi transisi hanya ke langkah berikutnya:
  `MenungguVerifikasi → Diproses → DiteruskanKecamatan → MenungguTinjauan → Selesai`
  (Ditolak hanya dari langkah awal, Selesai/Ditolak adalah status akhir dan terkunci)
- [ ] **Tombol aksi mengikuti status saat ini** di halaman detail Admin — tampilkan hanya aksi langkah berikutnya, bukan dropdown semua status
- [ ] **Petugas tindak lanjut otomatis membuat status maju** — satu klik catat tindak lanjut langsung mengubah status ke langkah berikutnya dan mencatat riwayatnya
- [ ] **Notifikasi otomatis ke warga setiap status berubah** — sudah dibuat di database, tinggal ditampilkan: lonceng notifikasi di header + halaman `/notifikasi` (belum dibaca / tandai dibaca)
- [ ] **Warga melihat status terbaru tanpa refresh** — polling ringan (mis. cek tiap 30 detik) atau refresh saat kembali ke halaman detail
- [ ] (Opsional) **Eskalasi otomatis** — aduan menunggu verifikasi lebih dari 3 hari otomatis ditandai mendesak di dashboard Admin; aduan menunggu tinjauan lebih dari 7 hari otomatis diingatkan

## Prioritas 5 — Peta & PWA

- [ ] Integrasi Leaflet + OpenStreetMap: tampilkan titik aduan di peta
- [ ] PWA: `manifest.webmanifest`, service worker, ikon aplikasi
- [ ] Uji instalasi PWA di HP Android

## Prioritas 6 — Rapikan yang Menunggak

- [ ] Ganti halaman `/domisili/status` yang masih mock data dengan data nyata dari API
- [ ] Kompres foto `public/images/pexels-pamanjoe-21896936.jpg` (saat ini ±5 MB) agar repo ringan
- [ ] Buat akun seed resmi untuk Admin & Petugas (sekarang masih diubah manual lewat SQL)
- [ ] Tambah halaman lupa kata sandi (form login sebelumnya menautkannya, tapi halamannya belum ada)
- [ ] Bucket KTP di Supabase dibuat publik — ubah jadi privat + signed URL
- [ ] Perbarui `AGENTS.md` bila status implementasi berubah lagi

## Prioritas 7 — Uji & Rilis

- [ ] Uji end-to-end: register → verifikasi domisili → buat aduan → admin verifikasi → petugas tindak lanjut → warga terima notifikasi
- [ ] Uji di HP (responsif) untuk setiap halaman utama
- [ ] Jalankan `npm run lint` dan `npm run build` sebelum setiap PR
- [ ] Buat PR ke `development` dengan judul `SCRUM-<id> <deskripsi>`, jangan langsung ke `main`
- [ ] Deploy ke Vercel / host pilihan dan catat URL-nya di README
