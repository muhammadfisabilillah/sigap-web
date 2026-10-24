import 'dotenv/config';
import { readFileSync } from 'node:fs';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';

const contractJson = JSON.parse(readFileSync(new URL('./contract.json', import.meta.url), 'utf8'));
const contract = contractFromJson(contractJson);
const db = postgres({ contract, url: process.env['DATABASE_URL'] });

const KECAMATAN_SURABAYA = [
  'Asemrowo',
  'Benowo',
  'Bubutan',
  'Bulak',
  'Dukuh Pakis',
  'Gayungan',
  'Genteng',
  'Gubeng',
  'Gunung Anyar',
  'Jambangan',
  'Karang Pilang',
  'Kenjeran',
  'Krembangan',
  'Lakarsantri',
  'Mulyorejo',
  'Pabean Cantian',
  'Pakal',
  'Rungkut',
  'Sambikerep',
  'Sawahan',
  'Semampir',
  'Simokerto',
  'Sukolilo',
  'Sukomanunggal',
  'Tambaksari',
  'Tandes',
  'Tegalsari',
  'Tenggilis Mejoyo',
  'Wiyung',
  'Wonocolo',
  'Wonokromo',
];

const KATEGORI_ADUAN = [
  'Jalan dan Infrastruktur',
  'Sampah dan Kebersihan',
  'Drainase dan Banjir',
  'Penerangan Jalan',
  'Keamanan dan Ketertiban',
  'Fasilitas Umum',
  'Kesehatan Lingkungan',
  'Taman dan Ruang Terbuka Hijau',
  'Kelistrikan Publik',
  'Aliran Bersih dan Pipa',
];

const INSTANSI = [
  'Dinas Bina Marga',
  'Dinas Kebersihan dan Pertamanan',
  'Dinas Perumahan dan Kawasan Permukiman',
  'Dinas Sumber Daya Air dan Bina Marga',
  'Dinas Perhubungan',
  'Dinas Sosial',
];

async function seedRef(name, values) {
  for (const value of values) {
    await db.orm.public[name].upsert({
      create: { nama: value },
      update: {},
    });
  }
  const count = await db.orm.public[name].all();
  console.log(`${name}: ${count.length} baris (idempoten)`);
}

async function main() {
  if (!process.env['DATABASE_URL'] || process.env['DATABASE_URL'].includes('localhost')) {
    console.error('DATABASE_URL belum diisi (masih placeholder localhost).');
    process.exit(1);
  }
  await seedRef('Kecamatan', KECAMATAN_SURABAYA);
  await seedRef('Kategori', KATEGORI_ADUAN);
  await seedRef('Instansi', INSTANSI);
  console.log('Seed selesai.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
