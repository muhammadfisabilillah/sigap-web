export const STATUS_ADUAN_TO_RIWAYAT = {
  MenungguVerifikasi: 'Dibuat',
  Diproses: 'Diverifikasi',
  DiteruskanKecamatan: 'Diteruskan',
  MenungguTinjauan: 'DitindakLanjuti',
  Selesai: 'DitetapkanSelesai',
  Ditolak: 'Dikembalikan',
} as const;

export const STATUS_ADUAN_VALID = [
  'MenungguVerifikasi',
  'Diproses',
  'DiteruskanKecamatan',
  'MenungguTinjauan',
  'Selesai',
  'Ditolak',
] as const;

export type StatusAduan = (typeof STATUS_ADUAN_VALID)[number];

export function isStatusAduan(value: string): value is StatusAduan {
  return (STATUS_ADUAN_VALID as readonly string[]).includes(value);
}
