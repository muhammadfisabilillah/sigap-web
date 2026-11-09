import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getSessionUser } from '@/src/lib/auth/session';
import { homePathForRole } from '@/src/lib/auth/roles';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper">
      <Suspense fallback={<Splash />}>
        <HomeRedirect />
      </Suspense>
    </main>
  );
}

async function HomeRedirect() {
  await connection();
  const user = await getSessionUser();
  return redirect(user ? homePathForRole(user.role) : '/login');
}

function Splash() {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-bold tracking-tight text-ink">SIGAP</p>
      <p className="text-xs text-muted">Memuat...</p>
    </div>
  );
}
