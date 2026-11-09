import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { AuthShell } from '@/src/components/auth/auth-shell';
import { AuthFormSkeleton } from '@/src/components/auth/auth-form-skeleton';
import { LoginForm } from '@/src/components/auth/login-form';
import { getSessionUser } from '@/src/lib/auth/session';
import { homePathForRole } from '@/src/lib/auth/roles';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke SIGAP untuk melaporkan dan memantau aduan warga Kota Surabaya.',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Masuk ke akun Anda"
      description="Gunakan email dan kata sandi yang terdaftar."
      footer="© 2026 Pemerintah Kota Surabaya"
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginGate />
      </Suspense>
    </AuthShell>
  );
}

async function LoginGate() {
  await connection();
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));
  return <LoginForm />;
}
