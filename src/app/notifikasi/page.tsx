import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/src/components/dashboard/dashboard-shell';
import { PageSkeleton } from '@/src/components/dashboard/page-skeleton';
import { NotificationList } from '@/src/components/notifikasi/notification-list';
import { getSessionUser } from '@/src/lib/auth/session';
import { getJumlahBelumDibaca, getNotifikasiUser } from '@/src/lib/notifikasi/query';

export const metadata: Metadata = {
  title: 'Notifikasi',
};

export default function NotifikasiPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Notifikasi />
    </Suspense>
  );
}

async function Notifikasi() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [notifikasi, belumDibaca] = await Promise.all([
    getNotifikasiUser(user.id),
    getJumlahBelumDibaca(user.id),
  ]);

  return (
    <DashboardShell
      user={user}
      title="Notifikasi"
      subtitle="Pantau pemberitahuan terbaru tentang aduan dan pengajuan domisili Anda."
    >
      <NotificationList
        initialNotifikasi={notifikasi}
        initialBelumDibaca={belumDibaca}
        role={user.role}
      />
    </DashboardShell>
  );
}
