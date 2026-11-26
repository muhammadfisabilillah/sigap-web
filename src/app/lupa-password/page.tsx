import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { AuthShell } from '@/src/components/auth/auth-shell';
import { AuthFormSkeleton } from '@/src/components/auth/auth-form-skeleton';
import { LupaPasswordForm } from '@/src/components/auth/lupa-password-form';
import { getSessionUser } from '@/src/lib/auth/session';
import { homePathForRole } from '@/src/lib/auth/roles';

export const metadata: Metadata = {
  title: 'Lupa Kata Sandi',
  description: 'Minta reset kata sandi akun SIGAP Anda.',
};

export default function LupaPasswordPage() {
  return (
    <AuthShell
      title="Lupa kata sandi"
      description="Masukkan email terdaftar. Kami akan membantu mengatur ulang kata sandi Anda."
      footer="© 2026 Pemerintah Kota Surabaya"
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LupaPasswordGate />
      </Suspense>
    </AuthShell>
  );
}

async function LupaPasswordGate() {
  await connection();
  const user = await getSessionUser();
  if (user) redirect(homePathForRole(user.role));
  return <LupaPasswordForm />;
}
