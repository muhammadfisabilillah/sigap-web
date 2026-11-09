import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getSessionUser } from '@/src/lib/auth/session';
import { homePathForRole } from '@/src/lib/auth/roles';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
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
    <div className="flex flex-col items-center gap-4">
      <div className="h-11 w-11 animate-pulse rounded-xl bg-[#F59E0B]" />
      <p className="text-sm font-medium text-slate-500">Memuat SIGAP...</p>
    </div>
  );
}
