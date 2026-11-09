import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SIGAP — Sistem Informasi Gerak Aduan Publik",
    template: "%s | SIGAP Surabaya",
  },
  description:
    "Platform pengaduan masyarakat Kota Surabaya. Laporkan aduan, pantau status penanganan, dan dukung aduan warga di sekitar Anda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
