import Image from 'next/image';
import type { ReactNode } from 'react';
import { SigapLogo } from '@/src/components/brand/sigap-logo';

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen w-full bg-[#fbfaf7] lg:grid lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#0d2138] lg:block">
        <Image
          src="/images/Surabaya.jpg"
          alt="Patung Sura dan Baya, ikon Kota Surabaya"
          fill
          priority
          sizes="55vw"
          className="object-cover object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08192b]/50 via-[#08192b]/5 to-[#08192b]/90" />

        <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 xl:p-14">
          <SigapLogo href="/" />

          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-400" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                Kota Surabaya
              </span>
            </div>
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-tight text-white xl:text-[38px]">
              Aduan warga,
              <br />
              ditangani bersama.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Satu kanal untuk melaporkan persoalan di sekitar Anda dan memantau tindak
              lanjutnya.
            </p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="text-[11px] leading-relaxed text-white/55">
              Patung Sura dan Baya — ikon Kota Surabaya
            </p>
            <span className="text-[11px] font-medium tabular-nums text-white/40">01 / 01</span>
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="relative mb-8 h-44 overflow-hidden rounded-md lg:hidden">
            <Image
              src="/images/Surabaya.jpg"
              alt="Patung Sura dan Baya, ikon Kota Surabaya"
              fill
              sizes="100vw"
              className="object-cover object-[50%_36%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#08192b]/45 via-[#08192b]/5 to-[#08192b]/80" />
            <div className="absolute inset-x-0 top-0 p-4">
              <SigapLogo href="/" size="sm" />
            </div>
            <p className="absolute inset-x-0 bottom-0 p-4 text-[11px] text-white/70">
              Patung Sura dan Baya — ikon Kota Surabaya
            </p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              SIGAP Surabaya
            </p>
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-10 border-t border-slate-200 pt-4 text-[11px] leading-relaxed text-slate-400">
              {footer}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
