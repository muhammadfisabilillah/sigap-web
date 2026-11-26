import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { readFileSync } from 'node:fs';

// Seed akun demo Admin & Petugas — jalankan: node src/prisma/seed-roles.mjs
// GANTI password sebelum dipakai di production.

const contract = contractFromJson(JSON.parse(readFileSync(new URL('./contract.json', import.meta.url), 'utf8')));
const db = postgres({ contract, url: process.env.DATABASE_URL });

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

async function upsertUser({ nama, email, password, role, kecamatanId }) {
  const existing = await db.orm.public.User.where((u) => u.email.eq(email)).first();
  if (existing) {
    console.log('sudah ada, dilewati:', email);
    return;
  }
  await db.orm.public.User.create({
    nama,
    email,
    passwordHash: hashPassword(password),
    role,
    statusAkun: 'Terverifikasi',
    kecamatanId: kecamatanId ?? null,
  });
  console.log('dibuat:', email, role);
}

await upsertUser({
  nama: 'Admin SIGAP',
  email: 'admin@sigap.test',
  password: 'Admin123!',
  role: 'Admin',
  kecamatanId: null,
});

await upsertUser({
  nama: 'Petugas Gubeng',
  email: 'petugas@sigap.test',
  password: 'Petugas123!',
  role: 'Petugas',
  kecamatanId: 8,
});

process.exit(0);
