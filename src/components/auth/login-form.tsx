"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * Tipe data untuk nilai input form login
 */
export interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Tipe data untuk status/state form login
 */
export interface LoginFormState {
  isLoading: boolean;
  errorMessage: string | null;
  isSuccess: boolean;
}

/**
 * Props untuk komponen LoginForm
 */
export interface LoginFormProps {
  /**
   * Callback opsional ketika form berhasil disubmit
   */
  onSuccess?: (values: LoginFormValues) => void;
  /**
   * Kelas CSS tambahan untuk kontainer form
   */
  className?: string;
}

export function LoginForm({ onSuccess, className = "" }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState<LoginFormState>({
    isLoading: false,
    errorMessage: null,
    isSuccess: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Tangani perubahan nilai input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset pesan error saat pengguna mulai mengetik ulang
    if (formState.errorMessage) {
      setFormState((prev) => ({
        ...prev,
        errorMessage: null,
      }));
    }
  };

  /**
   * Mock submit handler
   * Siap dihubungkan ke Server Action atau Supabase / Auth API.
   * Catatan sesuai Figma: Ketik "salah" pada password untuk memicu simulasi pesan galat.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormState({
      isLoading: true,
      errorMessage: null,
      isSuccess: false,
    });

    try {
      // Simulasi delay request jaringan (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Sesuai petunjuk visual Figma: Ketik "salah" untuk melihat pesan galat
      if (formData.password.trim().toLowerCase() === "salah") {
        setFormState({
          isLoading: false,
          errorMessage: "Email atau kata sandi yang Anda masukkan salah. Silakan coba lagi.",
          isSuccess: false,
        });
        return;
      }

      // Simulasi skenario sukses
      setFormState({
        isLoading: false,
        errorMessage: null,
        isSuccess: true,
      });

      if (onSuccess) {
        onSuccess(formData);
      }
    } catch {
      setFormState({
        isLoading: false,
        errorMessage: "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.",
        isSuccess: false,
      });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Banner Pesan Galat / Error Alert */}
      {formState.errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 animate-fadeIn"
        >
          <svg
            className="h-5 w-5 shrink-0 text-red-500 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1 font-medium">{formState.errorMessage}</div>
        </div>
      )}

      {/* Banner Pesan Sukses (Mock Feedback) */}
      {formState.isSuccess && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-800 animate-fadeIn"
        >
          <svg
            className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div className="flex-1 font-medium">
            Login berhasil! Selamat datang di SIGAP Surabaya.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Input Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              disabled={formState.isLoading}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 ${
                formState.errorMessage
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-[#183B7E] focus:ring-[#183B7E]/20"
              }`}
            />
          </div>
        </div>

        {/* Input Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={formState.isLoading}
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 ${
                formState.errorMessage
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-[#183B7E] focus:ring-[#183B7E]/20"
              }`}
            />
            {/* Tombol Toggle Show/Hide Password */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={formState.isLoading}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors cursor-pointer"
            >
              {showPassword ? (
                // Eye Off Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                // Eye Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Helper text petunjuk galat sesuai mockup Figma */}
          <p className="mt-1.5 text-xs text-gray-500">
            Ketik &quot;salah&quot; untuk melihat pesan galat.
          </p>
        </div>

        {/* Link Lupa Password */}
        <div className="flex justify-end pt-1">
          <Link
            href="/lupa-password"
            className="text-xs sm:text-sm font-medium text-[#183B7E] hover:text-[#132F66] hover:underline transition-colors"
          >
            Lupa password?
          </Link>
        </div>

        {/* Tombol Submit "Masuk" */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={formState.isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#183B7E] px-4 py-2.5 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#132F66] active:bg-[#0F2652] focus:outline-none focus:ring-2 focus:ring-[#183B7E]/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {formState.isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </div>
      </form>

      {/* Link Registrasi / Daftar Akun */}
      <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#183B7E] hover:text-[#132F66] hover:underline transition-colors"
        >
          Daftar
        </Link>
      </div>
    </div>
  );
}
