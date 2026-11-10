import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { SigapLogo } from '@/src/components/brand/sigap-logo';
import { LogoutButton } from '@/src/components/dashboard/logout-button';
import { InstallPrompt } from '@/src/components/pwa/install-prompt';
import type { SessionUser } from '@/src/lib/auth/session';

type NavItem = {
  label: string;
  href: string | null;
};

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  Warga: [
    { label: 'Dasbor', href: '/warga' },
    { label: 'Domisili', href: '/domisili' },
    { label: 'Aduan Saya', href: '/warga/aduan' },
    { label: 'Laporan Publik', href: '/warga/laporan-publik' },
    { label: 'Profil', href: '/warga/profil' },
  ],
  Admin: [
    { label: 'Dasbor', href: '/admin' },
    { label: 'Verifikasi Domisili', href: '/admin/verifikasi-domisili' },
    { label: 'Kelola Aduan', href: '/admin/aduan' },
    { label: 'Instansi', href: null },
  ],
  Petugas: [
    { label: 'Dasbor', href: '/petugas' },
    { label: 'Aduan Wilayah', href: '/petugas/aduan' },
    { label: 'Verifikasi Domisili', href: '/petugas/verifikasi-domisili' },
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
      <header className="border-b border-line bg-card/80 backdrop-blur">
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <section className="relative mb-6 overflow-hidden rounded-2xl border border-line">
          <Image
            src="/images/pexels-pamanjoe-21896936.jpg"
            alt="Skyline Kota Surabaya dari udara"
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover object-[50%_42%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08192b]/95 via-[#0d2138]/80 to-[#0d2138]/20" />
          <div className="relative z-10 flex h-44 flex-col justify-center p-6 sm:h-52 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
              {ROLE_LABEL[user.role] ?? user.role} · SIGAP Surabaya
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">{subtitle}</p>
          </div>
        </section>

        {children}
      </main>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <SigapLogo href="/" size="sm" variant="dark" />
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Sistem Informasi Gerak Aduan Publik — satu kanal resmi aspirasi dan aduan
                masyarakat Kota Surabaya.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Navigasi
              </p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {nav.slice(0, 4).map((item) =>
                  item.href ? (
                    <li key={item.label}>
                      <Link href={item.href} className="text-ink/80 hover:text-brand">
                        {item.label}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label} className="text-muted">
                      {item.label}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Kontak
              </p>
              <p className="mt-2 text-sm text-ink/80">Pemerintah Kota Surabaya</p>
              <p className="text-xs text-muted">Jl. Tunjungan No. 1-3, Surabaya 60275</p>
              <p className="mt-1 text-xs text-muted">saran@surabaya.go.id</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
            <span>© 2026 Pemerintah Kota Surabaya · SIGAP</span>
            <InstallPrompt />
          </div>
        </div>
      </footer>
    </div>
  );
}
