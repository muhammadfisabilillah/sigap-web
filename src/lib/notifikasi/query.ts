import { db } from '@/src/prisma/db';

export type NotifikasiItem = {
  id: number;
  aduanId: number | null;
  judul: string;
  pesan: string;
  dibaca: boolean;
  createdAt: string;
};

export async function getNotifikasiUser(userId: number): Promise<NotifikasiItem[]> {
  const rows = await db.orm.public.Notifikasi.where({ userId }).all();
  return rows
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((row) => ({
      id: row.id,
      aduanId: row.aduanId ?? null,
      judul: row.judul,
      pesan: row.pesan,
      dibaca: row.dibaca,
      createdAt: row.createdAt,
    }));
}

export async function getJumlahBelumDibaca(userId: number): Promise<number> {
  const rows = await db.orm.public.Notifikasi.where({ userId, dibaca: false }).all();
  return rows.length;
}

export async function tandaiNotifikasiDibaca(userId: number, id: number): Promise<void> {
  await db.orm.public.Notifikasi.where({ id, userId }).update({ dibaca: true });
}

export async function tandaiSemuaNotifikasiDibaca(userId: number): Promise<void> {
  await db.orm.public.Notifikasi.where({ userId, dibaca: false }).update({ dibaca: true });
}
