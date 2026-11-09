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
  const initials = getInitials(user.nama);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <SigapLogo href="/" size="sm" variant="dark" />

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              {nav.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="transition-colors hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-slate-400"
                    title="Segera hadir"
                  >
                    {item.label}
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Soon
                    </span>
                  </span>
                ),
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold leading-tight text-slate-900">{user.nama}</p>
              <p className="text-[11px] leading-tight text-slate-500">
                {ROLE_LABEL[user.role] ?? user.role}
              </p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#1e3a8a]"
              aria-hidden="true"
            >
              {initials}
            </div>
            <LogoutButton />
          </div>
        </div>

        {nav.length > 0 ? (
          <nav className="flex gap-5 overflow-x-auto border-t border-slate-100 px-4 py-2 text-xs font-medium text-slate-600 md:hidden">
            {nav.map((item) =>
              item.href ? (
                <Link key={item.label} href={item.href} className="whitespace-nowrap py-1">
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className="whitespace-nowrap py-1 text-slate-400">
                  {item.label}
                </span>
              ),
            )}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-4 text-center text-[11px] text-slate-400 sm:px-6 lg:px-8">
          SIGAP — Sistem Informasi Gerak Aduan Publik Kota Surabaya
        </div>
      </footer>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
