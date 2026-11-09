import { FilterPengajuanPetugas } from "@/src/components/petugas/filter-pengajuan-petugas";

export const metadata = {
  title: "Verifikasi Domisili Wilayah — Petugas Kecamatan SIGAP Surabaya",
  description: "Daftar pengajuan domisili warga terfilter berdasarkan wilayah kecamatan petugas",
};

export default function PetugasDomisiliPage() {
  return <FilterPengajuanPetugas />;
}

