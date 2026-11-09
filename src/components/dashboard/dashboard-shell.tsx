import Link from 'next/link';
import type { ReactNode } from 'react';
import { SigapLogo } from '@/src/components/brand/sigap-logo';
import { LogoutButton } from '@/src/components/dashboard/logout-button';
import type { SessionUser } from '@/src/lib/auth/session';

type NavItem = {
  label: string;
  href: string | null;
};

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  Warga: [
    { label: 'Dasbor', href: '/warga' },
    { label: 'Domisili', href: '/domisili' },
    { label: 'Aduan Saya', href: null },
    { label: 'Laporan Publik', href: null },
  ],
  Admin: [
    { label: 'Dasbor', href: '/admin' },
    { label: 'Verifikasi Domisili', href: null },
    { label: 'Kelola Aduan', href: null },
    { label: 'Instansi', href: null },
  ],
  Petugas: [
    { label: 'Dasbor', href: '/petugas' },
    { label: 'Aduan Wilayah', href: null },
    { label: 'Verifikasi Domisili', href: null },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  Warga: 'Warga',
  Admin: 'Admin',
  Petugas: 'Petugas Kecamatan',
};

type DashboardShellProps = {
  user: SessionUser;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardShell({ user, title, subtitle, children }: DashboardShellProps) {
  const nav = NAV_BY_ROLE[user.role] ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <SigapLogo href="/" size="sm" variant="dark" />

          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            {nav.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="text-muted/60">
                  {item.label}
                </span>
              ),
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.nama}</p>
              <p className="text-xs leading-tight text-muted">
                {ROLE_LABEL[user.role] ?? user.role}
              </p>
            </div>
            <span className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 border-b border-line pb-6">
          <h1 className="text-[24px] font-semibold leading-tight tracking-tight">{title}</h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">{subtitle}</p>
        </div>

        {children}
      </main>

      <footer className="border-t border-line py-5">
        <div className="mx-auto max-w-5xl px-4 text-xs text-muted sm:px-6">
          SIGAP — Sistem Informasi Gerak Aduan Publik, Kota Surabaya
        </div>
      </footer>
    </div>
  );
}
