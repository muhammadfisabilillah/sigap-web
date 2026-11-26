import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { AuthShell } from '@/src/components/auth/auth-shell';
import { AuthFormSkeleton } from '@/src/components/auth/auth-form-skeleton';
import { RegisterForm } from '@/src/components/auth/register-form';
import { db } from '@/src/prisma/db';
import { getSessionUser } from '@/src/lib/auth/session';
import { homePathForRole } from '@/src/lib/auth/roles';

export const metadata: Metadata = {
  title: 'Daftar',
  description:
    'Buat akun SIGAP untuk melaporkan aduan dan memverifikasi domisili Kota Surabaya.',
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Buat akun warga"
      description="Daftar untuk melaporkan aduan di lingkungan Anda."
      footer="© 2026 Pemerintah Kota Surabaya"
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <RegisterGate />
      </Suspense>
    </AuthShell>
  );
}

async function RegisterGate() {
  await connection();
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));

  let kecamatan: { id: number; nama: string }[] = [];
  try {
    const rows = await db.orm.public.Kecamatan.all();
    kecamatan = rows
      .map((row) => ({ id: row.id, nama: row.nama }))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
  } catch {
    kecamatan = [];
  }

  return <RegisterForm kecamatan={kecamatan} />;
}
