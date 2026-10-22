import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "../../components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk ke SIGAP | Pemerintah Kota Surabaya",
  description:
    "Halaman autentikasi login warga untuk Sistem Informasi & Tanggap Aduan Warga Surabaya (SIGAP)",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* 
        ========================================================================
        PANEL KIRI: HERO & BRANDING SECTION (Desktop Split-screen)
        Sesuai desain Figma:
        - Background Jembatan Suroboyo / Suramadu dengan tint overlay biru gelap
        - Logo SIGAP Surabaya di kiri atas
        - Slogan "Bersama warga, membangun Surabaya yang lebih tanggap." di kiri bawah
        ========================================================================
      */}
      <section className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#132A50] select-none">
        {/* Background Image Jembatan dengan Overlay Biru Sesuai Figma */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/suramadu-bridge.svg"
            alt="Jembatan Suroboyo - SIGAP Surabaya"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          {/* Subtle gradient overlay to enhance typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1e38]/90 via-[#183B7E]/60 to-[#183B7E]/40" />
        </div>

        {/* Header Kiri Atas: Logo SIGAP Surabaya */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Icon Badge Oranye */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F59E0B] text-white shadow-md">
            {/* Megaphone / Loudspeaker Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m3 11 18-5v12L3 14v-3z" />
              <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
            </svg>
          </div>
          {/* Nama Aplikasi & Kota */}
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider text-white leading-tight">
              SIGAP
            </span>
            <span className="text-xs font-normal tracking-wide text-white/80 leading-tight">
              Surabaya
            </span>
          </div>
        </div>

        {/* Footer Kiri Bawah: Slogan Warga Surabaya */}
        <div className="relative z-10 max-w-md pb-4">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug drop-shadow-sm">
            Bersama warga, membangun Surabaya yang lebih tanggap.
          </h2>
        </div>
      </section>

      {/* 
        ========================================================================
        PANEL KANAN: FORM SECTION
        Sesuai desain Figma:
        - Layout bersih & centered
        - Judul: Masuk ke SIGAP
        - Subjudul: Gunakan email terdaftar Anda.
        - Form Login interaktif dengan toggle password, pesan galat, & link registrasi
        ========================================================================
      */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16 bg-white min-h-screen">
        <div className="w-full max-w-[400px] sm:max-w-[420px]">
          {/* Mobile-only Branding Header (tampil hanya di layar HP/tablet kecil) */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B] text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="m3 11 18-5v12L3 14v-3z" />
                <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-wider text-[#183B7E] leading-tight">
                SIGAP
              </span>
              <span className="text-[11px] font-medium text-gray-500 leading-tight">
                Surabaya
              </span>
            </div>
          </div>

          {/* Heading Form */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">
              Masuk ke SIGAP
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gunakan email terdaftar Anda.
            </p>
          </div>

          {/* Komponen Form Login */}
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
