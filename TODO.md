# SIGAP — Todo List

Terakhir diperbarui: 10 November 2026
Branch aktif: `feature/SCRUM-68-auth-ui`

---

## Agenda hari ini (10 Nov)

Fokus: **finalisasi untuk presentasi**. Utamakan urutan ini:

1. **Deploy ke Vercel** (Prioritas 7) — supaya bisa uji PWA di HP & catat URL
2. **Merge PR #7** ke `development` setelah dicek tim
3. **Rapikan data**: hapus aduan test ("fafa…", "test tiga foto"), ganti password demo
4. **Kompres foto** `pexels-pamanjoe-21896936.jpg` (±5 MB)
5. **Screenshot semua halaman** untuk PPT
6. **Uji end-to-end di HP** + latihan demo 10 menit
7. (Opsional, kalau ada waktu) **Prioritas 4b**: otomatisasi status berurutan + lonceng notifikasi di header

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
- [x] Modul Aduan Warga: API, form + GPS + foto, nomor tiket, Aduan Saya, Detail Aduan, Laporan Publik
- [x] Peta Leaflet + OpenStreetMap (perbaikan URL tile)
- [x] Upvote aduan (lintas kecamatan, kecuali aduan sendiri) + halaman Profil
- [x] PWA: manifest, service worker, ikon, tombol pasang aplikasi
- [x] Admin: verifikasi domisili (terima/tolak), kelola aduan (status, instansi, riwayat)
- [x] Petugas: 31 akun per kecamatan, aduan wilayah, verifikasi domisili wilayah, tindak lanjut
- [x] KTP bucket privat + signed URL 1 jam
- [x] Halaman lupa kata sandi
- [x] Halaman status domisili data nyata (bukan mock)
- [x] Seed akun demo: admin, 31 petugas per kecamatan
- [x] Visual dosen: banner foto di semua dashboard, stat card berwarna, kartu modul aksen, pola titik, footer lengkap, banner CTA, grafik statistik (admin & petugas), timeline aktivasi akun warga
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
- [x] API list aduan: `GET /api/aduan?scope=mine|public` (sudah dipakai & dites)

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

- [x] API upvote/unvote (`POST /api/aduan/[id]/upvote`), jaga `totalUpvote` tetap konsisten
- [x] Tampilkan jumlah upvote + urutan prioritas di daftar laporan publik
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

- [x] Integrasi Leaflet + OpenStreetMap: tampilkan titik aduan di peta
- [x] PWA: `manifest.webmanifest`, service worker, ikon aplikasi
- [ ] Uji instalasi PWA di HP Android (perlu deploy HTTPS dulu)

## Prioritas 6 — Rapikan yang Menunggak

- [x] Ganti halaman `/domisili/status` yang masih mock data dengan data nyata dari API
- [ ] Kompres foto `public/images/pexels-pamanjoe-21896936.jpg` (saat ini ±5 MB) agar repo ringan
- [x] Buat akun seed resmi untuk Admin & Petugas (sekarang masih diubah manual lewat SQL)
- [x] Tambah halaman lupa kata sandi (form login sebelumnya menautkannya, tapi halamannya belum ada)
- [x] Bucket KTP di Supabase dibuat publik — ubah jadi privat + signed URL
- [ ] Perbarui `AGENTS.md` bila status implementasi berubah lagi
- [ ] NIK otomatis terbaca dari KTP saat verifikasi (OCR) — sekarang input manual di halaman Profil

## Prioritas 7 — Uji & Rilis

- [ ] Uji end-to-end: register → verifikasi domisili → buat aduan → admin verifikasi → petugas tindak lanjut → warga terima notifikasi
- [ ] Uji di HP (responsif) untuk setiap halaman utama
- [ ] Jalankan `npm run lint` dan `npm run build` sebelum setiap PR
- [ ] Buat PR ke `development` dengan judul `SCRUM-<id> <deskripsi>`, jangan langsung ke `main`
- [ ] Deploy ke Vercel / host pilihan dan catat URL-nya di README

---

## Prioritas 8 — Finalisasi (pasca-responsi dosen)

Feedback dosen: tampilan dinilai terlalu polos/kosong → sudah ditambahkan banner foto skyline, stat card berwarna, kartu modul dengan aksen, pola latar titik, dan footer lengkap.

### Rapikan konten & data

- [ ] Hapus/bersihkan data test (aduan "fafafa…", "test tiga foto", akun e2e, akun petugas duplikat) dari database sebelum presentasi
- [ ] Ganti password semua akun demo (admin@sigap.test, petugas*.sigap.test) sebelum rilis resmi
- [ ] Kompres foto `pexels-pamanjoe-21896936.jpg` (±5 MB) agar repo ringan
- [ ] Perbarui `AGENTS.md` — status implementasi sudah jauh berkembang

### Penyempurnaan UI (lanjutan masukan dosen)

- [ ] Screenshot semua halaman utama untuk bahan PPT presentasi (login, register, dashboard 3 role, form aduan, detail aduan, laporan publik)
- [ ] Tambah ilustrasi/empty-state di halaman yang kosong (mis. "Belum ada aduan" dengan gambar)
- [ ] Cek kontras teks & ukuran font pada layar proyektor (min. 16px untuk body)

### Rilis & presentasi

- [ ] Merge PR #7 ke `development` setelah direview tim
- [ ] Deploy ke Vercel (+ set env: DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Uji instalasi PWA di HP Android dari URL production (HTTPS)
- [ ] Catat URL production di README.md dan di Jira SCRUM-68
- [ ] Merge `development` → `main` menjelang hari presentasi
- [ ] Latihan demo 10 menit: register warga baru → upload KTP → admin verifikasi → warga buat aduan → admin proses → petugas tindak lanjut → warga lihat status/selesai
- [ ] Siapkan fallback offline/screenshot apabila WiFi kampus bermasalah saat demo
- [ ] Update TODO.md sebagai lampiran progress ke Jira
