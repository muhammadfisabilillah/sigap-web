// src/app/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    // Simple client‑side validation
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg("Semua kolom wajib diisi.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          noHp: phone?.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push("/login");
      } else {
        setErrorMsg(data.error ?? "Terjadi kesalahan saat mendaftar.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* ========================================================================
           PANEL KIRI: HERO & BRANDING SECTION (Desktop Split-screen)
           ======================================================================== */}
      <section className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#132A50] select-none">
        {/* Background Image Jembatan dengan Overlay Biru */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/suramadu.jpg"
            alt="Jembatan Suramadu – SIGAP Surabaya"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Layer overlay tint & gradient warna biru khas SIGAP */}
          <div className="absolute inset-0 bg-blue-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-blue-950/60" />
        </div>
        {/* Header Kiri Atas: Logo SIGAP Surabaya */}
        <div className="relative z-10 flex items-center gap-3">
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
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider text-white leading-tight">SIGAP</span>
            <span className="text-xs font-normal tracking-wide text-white/80 leading-tight">Surabaya</span>
          </div>
        </div>
        {/* Footer Kiri Bawah: Slogan */}
        <div className="relative z-10 max-w-md pb-4">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug drop-shadow-sm">
            Bersama warga, membangun Surabaya yang lebih tanggap.
          </h2>
        </div>
      </section>

      {/* ========================================================================
           PANEL KANAN: FORM SECTION
           ======================================================================== */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-10 lg:px-12 xl:px-16 bg-white min-h-screen">
        <div className="w-full max-w-[400px] sm:max-w-[420px]">
          {/* Mobile-only Branding Header */}
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
              <span className="text-base font-bold tracking-wider text-[#183B7E] leading-tight">SIGAP</span>
              <span className="text-[11px] font-medium text-gray-500 leading-tight">Surabaya</span>
            </div>
          </div>

          {/* Heading Form */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">Daftar Akun SIGAP</h1>
            <p className="mt-1 text-sm text-gray-500">
              Lengkapi data diri Anda untuk mulai melaporkan masalah di sekitar Anda.
            </p>
          </div>

          {/* Registrasi Form (dynamic) */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Error message */}
            {errorMsg && (
              <p className="text-sm text-red-600" role="alert">
                {errorMsg}
              </p>
            )}
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#183B7E] focus:ring-2 focus:ring-[#183B7E]/20"
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#183B7E] focus:ring-2 focus:ring-[#183B7E]/20"
              />
            </div>
            {/* Nomor HP (opsional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor HP (opsional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+62 812‑3456‑7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#183B7E] focus:ring-2 focus:ring-[#183B7E]/20"
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#183B7E] focus:ring-2 focus:ring-[#183B7E]/20"
              />
            </div>
            {/* Konfirmasi Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#183B7E] focus:ring-2 focus:ring-[#183B7E]/20"
              />
            </div>
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#172f6c] focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </button>
            </div>
          </form>

          {/* Navigasi ke Login */}
          <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-[#183B7E] hover:text-[#132F66] hover:underline transition-colors">
              Masuk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
