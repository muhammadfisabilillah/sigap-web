# 🚨 SIGAP — Sistem Informasi Gerak Aduan Publik

**SIGAP** (Sistem Informasi Gerak Aduan Publik) adalah platform pengaduan masyarakat berbasis web (*Progressive Web App* / PWA) yang dirancang khusus untuk warga Kota Surabaya[cite: 6]. SIGAP hadir untuk menjembatani aspirasi dan aduan warga dengan penanganan transparan serta responsif dari instansi pemerintah/kecamatan setempat[cite: 6, 7].

---

## 📌 Latar Belakang & Usulan Solusi

Berdasarkan evaluasi terhadap platform pengaduan yang ada (seperti CRM DKI Jakarta, Aplikasi WargaKu, dan Hotline Lapor Cak Eri), ditemukan beberapa keterbatasan yang saling melengkapi[cite: 3]:
1. **Kompleksitas Antarmuka:** Pengguna sering kali kesulitan bernavigasi pada aplikasi dengan fitur yang terlalu menumpuk[cite: 3, 5].
2. **Keterbatasan Pelacakan Status:** Belum tersedianya pemantauan alur penanganan laporan secara rinci dan *real-time*[cite: 3, 5].
3. **Kurangnya Partisipasi Antarwarga:** Belum ada mekanisme bagi warga untuk memberikan dukungan (*upvote*) pada laporan yang dinilai penting dan mendesak[cite: 3, 5].

**SIGAP** mengintegrasikan keunggulan dari sistem-sistem tersebut[cite: 5]:
* ⚡ **Proses Pelaporan Ringkas:** Alur pengaduan yang cepat dan mudah digunakan[cite: 4, 7].
* 📊 **Dashboard & Transparansi Status:** Pemantauan status laporan secara *real-time* dan transparan[cite: 4, 6].
* 👍 **Partisipasi Warga (Upvote):** Dukungan publik untuk memprioritaskan penanganan aduan mendesak[cite: 4, 6].
* 🌐 **Aksesibilitas PWA:** Dapat diakses layaknya aplikasi mobile dari browser tanpa perlu diinstal via app store[cite: 4, 6].

---

## 👥 Tim Pengembang & Pembagian Tugas (Task Breakdown)

Proyek ini dikembangkan menggunakan metodologi **Scrum** selama 10 minggu (5 Sprint)[cite: 36]. Pembagian tugas teknis dikelompokkan sesuai dengan perancangan modul sistem:

### 1. Muhammad Fisabilillah (102062400106) — Product Owner & Lead Developer[cite: 37]
* **Peran Proyek:** Product Owner & Lead Developer[cite: 37]
* **Fokus Tugas Teknis:**
  * **Arsitektur & Database:** Setup project utama (Next.js, Tailwind CSS, Prisma ORM, PostgreSQL Supabase)[cite: 22], menyempurnakan skema ERD (11 entitas)[cite: 23, 37] dan Class Diagram (14 kelas)[cite: 26, 37].
  * **Backend & API Core:** Mengimplementasikan autentikasi (JWT/Session)[cite: 22], pembatasan hak akses berbasis *role* (Warga, Admin, Petugas)[cite: 9, 22], serta integrasi Prisma ORM[cite: 22].
  * **System Review & Integration:** Melakukan review Pull Request (PR) dari anggota tim, konsolidasi kode, dan memastikan sistem berjalan sesuai kebutuhan fungsional (22 FR)[cite: 9, 37].

### 2. Alya Fazaristi (102062400040) — Scrum Master & Fullstack Developer[cite: 38]
* **Peran Proyek:** Scrum Master & Fullstack Developer[cite: 38]
* **Fokus Tugas Teknis:**
  * **Sprint & Project Management:** Mengelola Product Backlog, User Story, dan Sprint Kanban Board di Jira[cite: 37, 38].
  * **Modul Dashboard Petugas Kecamatan:** Mengembangkan antarmuka dan API untuk dashboard Petugas[cite: 12, 38] (Melihat daftar pengaduan wilayah[cite: 12, 19], konfirmasi domisili warga[cite: 9, 19], dan pembaruan progres penanganan di lapangan[cite: 12, 19]).
  * **Sistem Notifikasi & Log:** Mengimplementasikan modul notifikasi perubahan status akun dan laporan ke warga[cite: 11, 22].

### 3. Rafi Abdullah Afif (102062400009) — Backend Developer[cite: 37]
* **Peran Proyek:** Backend Developer[cite: 37]
* **Fokus Tugas Teknis:**
  * **Modul Verifikasi Domisili:** Mengembangkan API & Server Actions untuk alur registrasi warga[cite: 9], pengunggahan berkas KTP[cite: 9], dan alur verifikasi domisili oleh Admin & Petugas[cite: 9].
  * **Manajemen Media & Storage:** Mengintegrasikan Supabase Storage untuk penanganan *upload* foto bukti aduan dan dokumen verifikasi[cite: 22].
  * **Database Seeding:** Menyiapkan data awal (*seed data*) untuk tabel referensi Kecamatan Surabaya, Instansi, dan Kategori Aduan[cite: 23, 24].

### 4. Nanda Pratama Sugiarto (102062400019) — Fullstack / Module Developer[cite: 37]
* **Peran Proyek:** Fullstack / Module Developer[cite: 37]
* **Fokus Tugas Teknis:**
  * **Modul Pengaduan Warga:** Mengembangkan formulir pembuatan laporan aduan[cite: 10] (Input judul, deskripsi, kategori, dan validasi file unggahan foto[cite: 10, 13]).
  * **Fitur Geolocation & Peta:** Integrasi Geolocation API browser untuk otomatisasi koordinat lokasi GPS[cite: 10, 22] serta visualisasi titik aduan menggunakan Leaflet & OpenStreetMap[cite: 21, 22].
  * **Fitur Partisipasi (Upvote):** Mengembangkan logika dukungan aduan (*upvote/unvote*) khusus warga se-kecamatan beserta penghitungan total dukungannya[cite: 10].

### 5. Nesha Olivia Pramitha (102062400027) — UI/UX & Frontend Developer[cite: 38]
* **Peran Proyek:** UI/UX & Frontend Developer[cite: 38]
* **Fokus Tugas Teknis:**
  * **UI/UX Implementation:** Menerjemahkan mockup Figma ke dalam komponen halaman React/Next.js menggunakan Tailwind CSS[cite: 21, 38].
  * **Modul Dashboard Admin:** Mengembangkan halaman Dashboard Admin[cite: 10, 38] (Statistik pengaduan[cite: 19], filter prioritas berbasis jumlah *upvote*[cite: 10], dan modul penerusan laporan ke instansi/kecamatan[cite: 11]).
  * **PWA & Responsive Layout:** Menerapkan Progressive Web App (PWA) manifest/service worker[cite: 14, 15] dan memastikan antarmuka *fully responsive* di layar ponsel maupun desktop[cite: 13].

---

## 🛠️ Tech Stack & Arsitektur Sistem

SIGAP dibangun menggunakan arsitektur berlapis (*Layered / N-Tier Architecture*)[cite: 21]:

* **Presentation Layer:** Next.js (App Router), TypeScript, Tailwind CSS, Leaflet (Peta Interaktif)[cite: 22].
* **Application Layer:** Next.js API Routes / Server Actions, Prisma ORM[cite: 22].
* **Data Layer:** Supabase (PostgreSQL Database & Storage untuk berkas/foto)[cite: 22].
* **Integrasi Eksternal:** Geolocation API (Deteksi lokasi GPS otomatis) & OpenStreetMap[cite: 22].

---

## 🗂️ Hak Akses Pengguna (Peran)

1. **Warga:**
   * Registrasi & Pengajuan Verifikasi Domisili (Upload KTP)[cite: 9, 11].
   * Membuat laporan aduan + foto bukti & deteksi lokasi GPS[cite: 10, 11].
   * Melacak perkembangan status laporan secara *real-time*[cite: 10, 11].
   * Memberikan dukungan (*upvote*) pada laporan warga se-kecamatan[cite: 10, 11].
2. **Admin (Pengelola Pusat):**
   * Verifikasi berkas pendaftaran domisili warga[cite: 9, 12].
   * Memeriksa kelayakan laporan aduan masuk & meneruskan ke Petugas Kecamatan[cite: 10, 12].
   * Menetapkan status akhir laporan[cite: 11, 12].
3. **Petugas Kecamatan:**
   * Memvalidasi kebenaran domisili warga di wilayahnya[cite: 9, 12].
   * Memperbarui tindak lanjut dan progres penanganan pengaduan di lapangan[cite: 11, 12].

---

## 🌿 Panduan Alur Kerja Git (Branching Strategy)

Untuk menjaga kerapian repositori dan menghindari konflik kode (*merge conflict*), seluruh anggota tim **wajib** mengikuti aturan berikut[cite: 36, 37]:

### 1. Struktur Branch
* `main`: Branch utama berisi kode stabil yang siap dipresentasikan[cite: 37]. **(Dilarang commit/push langsung ke branch ini!)**.
* `development`: Branch utama tempat penggabungan seluruh fitur yang sedang dikembangkan[cite: 36, 37].
* `feature/<nama-fitur>`: Branch kerja masing-masing anggota tim yang dibuat dari `development`.

### 2. Langkah Mengerjakan Fitur Baru (Untuk Anggota Tim)
```bash
# 1. Pastikan berada di branch development & mengambil update terbaru
git checkout development
git pull origin development

# 2. Buat branch fitur baru
git checkout -b feature/nama-fitur-kalian

# 3. Lakukan pengodean dan simpan perubahan
git add .
git commit -m "feat: menjelaskan fitur yang dibuat"

# 4. Push branch fitur ke GitHub
git push origin feature/nama-fitur-kalian
