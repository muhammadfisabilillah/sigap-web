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

export function isStatusFinal(status: string): boolean {
  return status === 'Selesai' || status === 'Ditolak';
}

export type AksiAdmin = {
  value: StatusAduan;
  label: string;
  butuhInstansi?: boolean;
  butuhCatatan?: boolean;
};

export function getAksiAdmin(status: string): AksiAdmin[] {
  switch (status) {
    case 'MenungguVerifikasi':
      return [
        { value: 'Diproses', label: 'Terima dan proses aduan' },
        { value: 'Ditolak', label: 'Tolak aduan', butuhCatatan: true },
      ];
    case 'Diproses':
      return [
        {
          value: 'DiteruskanKecamatan',
          label: 'Teruskan ke kecamatan',
          butuhInstansi: true,
        },
      ];
    case 'MenungguTinjauan':
      return [{ value: 'Selesai', label: 'Tetapkan aduan selesai' }];
    case 'DiteruskanKecamatan':
    case 'Selesai':
    case 'Ditolak':
    default:
      return [];
  }
}

export function bolehTransisiAdmin(dari: string, ke: string): boolean {
  return getAksiAdmin(dari).some((aksi) => aksi.value === ke);
}

export function getStatusSetelahTindakLanjut(status: string): StatusAduan | null {
  switch (status) {
    case 'DiteruskanKecamatan':
      return 'MenungguTinjauan';
    case 'MenungguTinjauan':
      // Tetap di MenungguTinjauan, petugas menambah catatan tindak lanjut lanjutan.
      return 'MenungguTinjauan';
    default:
      return null;
  }
}

export function bolehPetugasTindakLanjut(status: string): boolean {
  return status === 'DiteruskanKecamatan' || status === 'MenungguTinjauan';
}
