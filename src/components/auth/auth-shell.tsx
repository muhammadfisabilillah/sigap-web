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
    <main className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      <section className="relative hidden select-none flex-col justify-between overflow-hidden bg-[#132A50] p-10 lg:flex lg:w-1/2 xl:w-[52%] xl:p-14">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/suramadu-bridge.svg"
            alt="Jembatan Surabaya"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1e38]/95 via-[#183B7E]/65 to-[#183B7E]/40" />
        </div>

        <div className="relative z-10">
          <SigapLogo href="/" />
        </div>

        <div className="relative z-10 max-w-md pb-4">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            Pemerintah Kota Surabaya
          </p>
          <h2 className="text-3xl font-bold leading-snug text-white xl:text-4xl">
            Bersama warga, membangun Surabaya yang lebih tanggap.
          </h2>
          <ul className="mt-6 space-y-2.5 text-sm text-white/80">
            <li className="flex items-center gap-2.5">
              <CheckIcon />
              Laporkan aduan dengan cepat dan mudah
            </li>
            <li className="flex items-center gap-2.5">
              <CheckIcon />
              Pantau status penanganan secara transparan
            </li>
            <li className="flex items-center gap-2.5">
              <CheckIcon />
              Dukung aduan penting di sekitar Anda
            </li>
          </ul>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 flex-col items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <SigapLogo href="/" size="sm" variant="dark" />
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          {children}

          {footer ? (
            <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
              {footer}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-[#F59E0B]"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
