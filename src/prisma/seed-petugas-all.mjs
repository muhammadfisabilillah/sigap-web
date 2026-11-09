import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { readFileSync } from 'node:fs';

// Seed satu akun Petugas per kecamatan — jalankan: node src/prisma/seed-petugas-all.mjs
// Email: petugas-<slug-kecamatan>@sigap.test, Password: Petugas123! (GANTI sebelum production)

const contract = contractFromJson(JSON.parse(readFileSync(new URL('./contract.json', import.meta.url), 'utf8')));
const db = postgres({ contract, url: process.env.DATABASE_URL });

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

function slug(nama) {
  return nama
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const kecamatanList = await db.orm.public.Kecamatan.all();
kecamatanList.sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

let dibuat = 0;
let dilewati = 0;

for (const kecamatan of kecamatanList) {
  const email = `petugas-${slug(kecamatan.nama)}@sigap.test`;
  const existing = await db.orm.public.User.where((u) => u.email.eq(email)).first();
  if (existing) {
    console.log('sudah ada, dilewati:', email);
    dilewati++;
    continue;
  }
  await db.orm.public.User.create({
    nama: `Petugas ${kecamatan.nama}`,
    email,
    passwordHash: hashPassword('Petugas123!'),
    role: 'Petugas',
    statusAkun: 'Terverifikasi',
    kecamatanId: kecamatan.id,
  });
  console.log('dibuat:', email, '-', kecamatan.nama);
  dibuat++;
}

console.log(`\nSelesai. Dibuat: ${dibuat}, dilewati: ${dilewati}, total kecamatan: ${kecamatanList.length}`);
process.exit(0);
