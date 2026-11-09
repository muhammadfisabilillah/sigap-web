import type { ReactNode } from 'react';
import { SigapLogo } from '@/src/components/brand/sigap-logo';
import { AuthPhotoCarousel } from '@/src/components/auth/auth-photo-carousel';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen w-full bg-paper lg:grid lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden lg:block">
        <AuthPhotoCarousel />

        <div className="pointer-events-none relative z-10 flex h-full min-h-screen flex-col justify-between p-8 xl:p-10">
          <div className="pointer-events-auto w-fit">
            <SigapLogo href="/" />
          </div>

          <div className="pointer-events-auto mb-16 max-w-sm">
            <h2 className="text-[28px] font-semibold leading-[1.2] text-white xl:text-[32px]">
              Aduan warga, ditangani bersama.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">
              Satu kanal untuk melaporkan persoalan di sekitar Anda dan memantau tindak lanjutnya.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="relative mb-8 h-40 overflow-hidden sm:h-44 lg:hidden">
            <AuthPhotoCarousel compact />
            <div className="absolute inset-x-0 top-0 z-10 p-4">
              <SigapLogo href="/" size="sm" />
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-[26px] font-semibold leading-tight text-ink">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-10 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">
              {footer}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
