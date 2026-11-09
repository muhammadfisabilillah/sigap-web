import { db } from '@/src/prisma/db';
import type { AduanItem } from './labels';

export type AduanRow = {
  id: number;
  nomorTiket: string;
  pelaporId: number;
  kategoriId: number;
  kecamatanId: number;
  judul: string;
  deskripsi: string;
  latitude: number;
  longitude: number;
  status: string;
  totalUpvote: number;
  createdAt: string;
  updatedAt: string;
};

export async function enrichAduan(rows: AduanRow[]): Promise<AduanItem[]> {
  const [kategoriList, kecamatanList, fotoList] = await Promise.all([
    db.orm.public.Kategori.all(),
    db.orm.public.Kecamatan.all(),
    db.orm.public.FotoAduan.all(),
  ]);

  const kategoriMap = new Map(kategoriList.map((k) => [k.id, k.nama]));
  const kecamatanMap = new Map(kecamatanList.map((k) => [k.id, k.nama]));
  const fotoByAduan = new Map<number, string[]>();
  for (const foto of fotoList) {
    const list = fotoByAduan.get(foto.aduanId) ?? [];
    list.push(foto.url);
    fotoByAduan.set(foto.aduanId, list);
  }

  return rows
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((row) => ({
      id: row.id,
      nomorTiket: row.nomorTiket,
      judul: row.judul,
      deskripsi: row.deskripsi,
      latitude: row.latitude,
      longitude: row.longitude,
      status: row.status,
      totalUpvote: row.totalUpvote,
      createdAt: row.createdAt,
      kategoriNama: kategoriMap.get(row.kategoriId) ?? '-',
      kecamatanNama: kecamatanMap.get(row.kecamatanId) ?? '-',
      fotoUrls: fotoByAduan.get(row.id) ?? [],
    }));
}

export async function getAduanSaya(userId: number): Promise<AduanItem[]> {
  const rows = await db.orm.public.Aduan.where({ pelaporId: userId }).all();
  return enrichAduan(rows as AduanRow[]);
}

export async function getAduanPublik(): Promise<AduanItem[]> {
  const rows = await db.orm.public.Aduan.all();
  return enrichAduan(rows as AduanRow[]);
}
