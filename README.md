# 🚨 SIGAP — Sistem Informasi Gerak Aduan Publik

**SIGAP** (Sistem Informasi Gerak Aduan Publik) adalah platform pengaduan masyarakat berbasis web (*Progressive Web App* / PWA) yang dirancang khusus untuk warga Kota Surabaya. SIGAP hadir untuk menjembatani aspirasi dan aduan warga dengan penanganan transparan serta responsif dari instansi pemerintah/kecamatan setempat.

---

## 📌 Latar Belakang & Usulan Solusi

Berdasarkan evaluasi terhadap platform pengaduan yang ada (seperti CRM DKI Jakarta, Aplikasi WargaKu, dan Hotline Lapor Cak Eri), ditemukan beberapa keterbatasan yang saling melengkapi:

1. **Kompleksitas Antarmuka:** Pengguna sering kali kesulitan bernavigasi pada aplikasi dengan fitur yang terlalu menumpuk.
2. **Keterbatasan Pelacakan Status:** Belum tersedianya pemantauan alur penanganan laporan secara rinci dan *real-time*.
3. **Kurangnya Partisipasi Antarwarga:** Belum ada mekanisme bagi warga untuk memberikan dukungan (*upvote*) pada laporan yang dinilai penting dan mendesak.

**SIGAP** mengintegrasikan keunggulan dari sistem-sistem tersebut:

* ⚡ **Proses Pelaporan Ringkas:** Alur pengaduan yang cepat dan mudah digunakan.
* 📊 **Dashboard & Transparansi Status:** Pemantauan status laporan secara *real-time* dan transparan.
* 👍 **Partisipasi Warga (Upvote):** Dukungan publik untuk memprioritaskan penanganan aduan mendesak.
* 🌐 **Aksesibilitas PWA:** Dapat diakses layaknya aplikasi mobile dari browser tanpa perlu diinstal via app store.

---

## 👥 Tim Pengembang & Pembagian Tugas (Task Breakdown)

Proyek ini dikembangkan menggunakan metodologi **Scrum** selama 10 minggu (5 Sprint). Pembagian tugas teknis dikelompokkan sesuai dengan perancangan modul sistem:

### 1. Muhammad Fisabilillah (102062400106) — Product Owner & Lead Developer

* **Peran Proyek:** Product Owner & Lead Developer
* **Fokus Tugas Teknis:**
  * **Arsitektur & Database:** Setup project utama (Next.js, Tailwind CSS, Prisma ORM, PostgreSQL Supabase), menyempurnakan skema ERD (11 entitas) dan Class Diagram (14 kelas).
  * **Backend & API Core:** Mengimplementasikan autentikasi (JWT/Session), pembatasan hak akses berbasis *role* (Warga, Admin, Petugas), serta integrasi Prisma ORM.
  * **System Review & Integration:** Melakukan review Pull Request (PR) dari anggota tim, konsolidasi kode, dan memastikan sistem berjalan sesuai kebutuhan fungsional (22 FR).

### 2. Alya Fazaristi (102062400040) — Scrum Master & Fullstack Developer

* **Peran Proyek:** Scrum Master & Fullstack Developer
* **Fokus Tugas Teknis:**
  * **Sprint & Project Management:** Mengelola Product Backlog, User Story, dan Sprint Kanban Board di Jira.
  * **Modul Dashboard Petugas Kecamatan:** Mengembangkan antarmuka dan API untuk dashboard Petugas (melihat daftar pengaduan wilayah, konfirmasi domisili warga, dan pembaruan progres penanganan di lapangan).
  * **Sistem Notifikasi & Log:** Mengimplementasikan modul notifikasi perubahan status akun dan laporan ke warga.

### 3. Rafi Abdullah Afif (102062400009) — Backend Developer

* **Peran Proyek:** Backend Developer
* **Fokus Tugas Teknis:**
  * **Modul Verifikasi Domisili:** Mengembangkan API & Server Actions untuk alur registrasi warga, pengunggahan berkas KTP, dan alur verifikasi domisili oleh Admin & Petugas.
  * **Manajemen Media & Storage:** Mengintegrasikan Supabase Storage untuk penanganan *upload* foto bukti aduan dan dokumen verifikasi.
  * **Database Seeding:** Menyiapkan data awal (*seed data*) untuk tabel referensi Kecamatan Surabaya, Instansi, dan Kategori Aduan.

### 4. Nanda Pratama Sugiarto (102062400019) — Fullstack / Module Developer

* **Peran Proyek:** Fullstack / Module Developer
* **Fokus Tugas Teknis:**
  * **Modul Pengaduan Warga:** Mengembangkan formulir pembuatan laporan aduan (input judul, deskripsi, kategori, dan validasi file unggahan foto).
  * **Fitur Geolocation & Peta:** Integrasi Geolocation API browser untuk otomatisasi koordinat lokasi GPS serta visualisasi titik aduan menggunakan Leaflet & OpenStreetMap.
  * **Fitur Partisipasi (Upvote):** Mengembangkan logika dukungan aduan (*upvote/unvote*) khusus warga se-kecamatan beserta penghitungan total dukungannya.

### 5. Nesha Olivia Pramitha (102062400027) — UI/UX & Frontend Developer

* **Peran Proyek:** UI/UX & Frontend Developer
* **Fokus Tugas Teknis:**
  * **UI/UX Implementation:** Menerjemahkan mockup Figma ke dalam komponen halaman React/Next.js menggunakan Tailwind CSS.
  * **Modul Dashboard Admin:** Mengembangkan halaman Dashboard Admin (statistik pengaduan, filter prioritas berbasis jumlah *upvote*, dan modul penerusan laporan ke instansi/kecamatan).
  * **PWA & Responsive Layout:** Menerapkan Progressive Web App (PWA) manifest/service worker dan memastikan antarmuka *fully responsive* di layar ponsel maupun desktop.

---

## 🛠️ Tech Stack & Arsitektur Sistem

SIGAP dibangun menggunakan arsitektur berlapis (*Layered / N-Tier Architecture*):

* **Presentation Layer:** Next.js (App Router), TypeScript, Tailwind CSS, Leaflet (Peta Interaktif).
* **Application Layer:** Next.js API Routes / Server Actions, Prisma ORM.
* **Data Layer:** Supabase (PostgreSQL Database & Storage untuk berkas/foto).
* **Integrasi Eksternal:** Geolocation API (Deteksi lokasi GPS otomatis) & OpenStreetMap.

---

## 🗂️ Hak Akses Pengguna (Peran)

### 1. Warga

* Registrasi & Pengajuan Verifikasi Domisili (Upload KTP).
* Membuat laporan aduan + foto bukti & deteksi lokasi GPS.
* Melacak perkembangan status laporan secara *real-time*.
* Memberikan dukungan (*upvote*) pada laporan warga se-kecamatan.

### 2. Admin (Pengelola Pusat)

* Verifikasi berkas pendaftaran domisili warga.
* Memeriksa kelayakan laporan aduan masuk & meneruskan ke Petugas Kecamatan.
* Menetapkan status akhir laporan.

### 3. Petugas Kecamatan

* Memvalidasi kebenaran domisili warga di wilayahnya.
* Memperbarui tindak lanjut dan progres penanganan pengaduan di lapangan.

---

## 🌿 Panduan Alur Kerja Git (Branching Strategy)

Untuk menjaga kerapian repositori dan menghindari konflik kode (*merge conflict*), seluruh anggota tim **wajib** mengikuti aturan berikut.

### 1. Struktur Branch

* `main`: Branch utama berisi kode stabil yang siap dipresentasikan. **(Dilarang commit/push langsung ke branch ini!)**
* `development`: Branch utama tempat penggabungan seluruh fitur yang sedang dikembangkan.
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
```
