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

- [ ] API buat aduan: `POST /api/aduan` (judul, deskripsi, kategori, kecamatan, lat/long, foto)
- [ ] Upload foto aduan ke Supabase Storage (bucket baru, mis. `aduan`)
- [ ] Generate nomor tiket unik (`nomorTiket`)
- [ ] Form buat aduan di `/warga/aduan/baru`
- [ ] Integrasi Geolocation API untuk isi koordinat otomatis
- [ ] Halaman daftar "Aduan Saya" + detail aduan + riwayat status
- [ ] Halaman "Laporan Publik" untuk warga sekecamatan

## Prioritas 2 — Verifikasi & Pengelolaan Admin

- [ ] Halaman Admin: daftar pengajuan domisili menunggu verifikasi
- [ ] Aksi terima/tolak verifikasi domisili + catatan penolakan
- [ ] Saat diterima: update `User.statusAkun` → `Terverifikasi`
- [ ] Halaman Admin: daftar aduan masuk, filter per status/kategori/kecamatan
- [ ] Aksi teruskan aduan ke instansi / petugas kecamatan
- [ ] Aksi tetapkan status akhir (Selesai / Ditolak)

## Prioritas 3 — Dashboard Petugas Kecamatan

- [ ] Halaman daftar aduan wilayah (filter `kecamatanId` petugas)
- [ ] Form update progres tindak lanjut + catatan lapangan
- [ ] Halaman validasi domisili warga di wilayahnya
- [ ] Halaman riwayat tindak lanjut

## Prioritas 4 — Partisipasi & Notifikasi

- [ ] API upvote/unvote (`POST /api/aduan/[id]/upvote`), jaga `totalUpvote` tetap konsisten
- [ ] Tampilkan jumlah upvote + urutan prioritas di daftar laporan publik
- [ ] Buat notifikasi saat status aduan berubah
- [ ] Halaman/icon notifikasi di header (belum dibaca / sudah dibaca)

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
