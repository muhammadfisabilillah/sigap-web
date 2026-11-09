import { FilterPengajuanPetugas } from "@/src/components/petugas/filter-pengajuan-petugas";

export const metadata = {
  title: "Portal Petugas Kecamatan — SIGAP Surabaya",
  description: "Filter dan verifikasi pengajuan domisili warga berdasarkan kecamatan petugas",
};

export default function PetugasDashboardPage() {
  return <FilterPengajuanPetugas />;
}

