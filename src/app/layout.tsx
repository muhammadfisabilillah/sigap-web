import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ServiceWorkerRegister } from "@/src/components/pwa/service-worker-register";
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
  applicationName: "SIGAP Surabaya",
  appleWebApp: {
    capable: true,
    title: "SIGAP Surabaya",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f3d2e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
