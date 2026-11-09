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
    <main className="min-h-screen w-full bg-paper lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden min-h-screen lg:block">
        <Image
          src="/images/pexels-pamanjoe-21896936.jpg"
          alt="Skyline Kota Surabaya dari udara"
          fill
          priority
          sizes="52vw"
          className="object-cover object-[50%_55%]"
        />
        <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 xl:p-12">
          <SigapLogo href="/" />

          <div className="max-w-md">
            <h2 className="text-[30px] font-semibold leading-[1.2] text-white xl:text-[34px]">
              Aduan warga, ditangani bersama.
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
              Satu kanal untuk melaporkan persoalan di sekitar Anda dan memantau tindak lanjutnya.
            </p>
          </div>

          <p className="bg-black/35 px-3 py-2 text-[11px] leading-relaxed text-white/85 backdrop-blur-sm w-fit">
            Kota Surabaya dari udara
          </p>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[380px]">
          <div className="relative mb-8 h-44 overflow-hidden lg:hidden">
            <Image
              src="/images/pexels-pamanjoe-21896936.jpg"
              alt="Skyline Kota Surabaya dari udara"
              fill
              sizes="100vw"
              className="object-cover object-[50%_55%]"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <SigapLogo href="/" size="sm" />
              <p className="bg-black/35 px-2.5 py-1.5 text-[11px] text-white/85 w-fit backdrop-blur-sm">
                Kota Surabaya dari udara
              </p>
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
