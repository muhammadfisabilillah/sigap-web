'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sigap_onboarding_seen_v1';

const SLIDES = [
  {
    title: 'Selamat datang di SIGAP',
    body: 'Satu kanal resmi dari Pemerintah Kota Surabaya untuk melaporkan persoalan di sekitar Anda — jalan rusak, banjir, sampah, penerangan mati — dan memantau langsung bagaimana aduan Anda ditindaklanjuti.',
  },
  {
    title: 'Cara kerja SIGAP',
    body: 'Empat langkah sederhana: (1) Daftar dan verifikasi domisili dengan KTP, (2) buat aduan dengan foto dan lokasi, (3) aduan diteruskan ke kecamatan/instansi terkait, (4) petugas menindaklanjuti dan status berubah sampai selesai.',
  },
  {
    title: 'Dukung warga lain',
    body: 'Di Laporan Publik Anda bisa melihat aduan warga Surabaya lain dan mendukung yang paling penting dengan fitur Dukung. Makin banyak dukungan, makin diprioritaskan oleh petugas.',
  },
  {
    title: 'Gunakan dengan bijak',
    body: 'Tulis aduan sesuai fakta dan tidak mengandung ujaran kebencian. Sertakan foto yang jelas dan lokasi yang akurat. Jangan spam atau membuat aduan palsu — itu merugikan warga lain yang butuh ditindaklanjuti.',
  },
] as const;

export function OnboardingModal() {
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) === '1') return;
    const timer = window.setTimeout(() => setStep(0), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, '1');
    setStep(null);
  }

  if (step === null) return null;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Panduan singkat SIGAP"
    >
      <div className="absolute inset-0 bg-[#08192b]/70 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        <div className="relative h-36 w-full">
          <Image
            src="/images/pexels-pamanjoe-21896936.jpg"
            alt="Skyline Kota Surabaya"
            fill
            sizes="100vw"
            className="object-cover object-[50%_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08192b] via-[#0d2138]/40 to-transparent" />
          <p className="absolute bottom-3 left-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300">
            Panduan Singkat
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-medium text-muted">
              {step + 1} dari {SLIDES.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="cursor-pointer text-xs font-medium text-muted hover:text-ink"
            >
              Lewati
            </button>
          </div>

          <h2 className="mt-2 text-xl font-bold leading-snug text-ink">{slide.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{slide.body}</p>

          <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
            {SLIDES.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === step ? 'w-6 bg-brand' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, (s ?? 0) - 1))}
                className="cursor-pointer rounded-md border border-line px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => (isLast ? close() : setStep((s) => (s ?? 0) + 1))}
              className="cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
            >
              {isLast ? 'Mulai menggunakan SIGAP' : 'Lanjut'}
            </button>
          </div>

          <Link
            href="/panduan"
            onClick={close}
            className="mt-4 inline-block text-xs font-medium text-brand hover:underline"
          >
            Baca panduan lengkap →
          </Link>
        </div>
      </div>
    </div>
  );
}
