export const STATUS_ADUAN_LABEL: Record<string, string> = {
  MenungguVerifikasi: 'Menunggu verifikasi',
  Diproses: 'Diproses',
  DiteruskanKecamatan: 'Diteruskan ke kecamatan',
  MenungguTinjauan: 'Menunggu tinjauan',
  Selesai: 'Selesai',
  Ditolak: 'Ditolak',
};

export const STATUS_RIWAYAT_LABEL: Record<string, string> = {
  Dibuat: 'Aduan dibuat',
  Diverifikasi: 'Diverifikasi admin',
  Dikembalikan: 'Dikembalikan',
  Diteruskan: 'Diteruskan ke kecamatan',
  DitindakLanjuti: 'Ditindaklanjuti petugas',
  DitetapkanSelesai: 'Ditetapkan selesai',
};

export type AduanItem = {
  id: number;
  nomorTiket: string;
  judul: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  status: string;
  totalUpvote: number;
  createdAt: string;
  kategoriNama: string;
  kecamatanNama: string;
  fotoUrls: string[];
};

export function formatTanggal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}
