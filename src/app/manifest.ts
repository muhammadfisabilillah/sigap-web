import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SIGAP — Sistem Informasi Gerak Aduan Publik Kota Surabaya',
    short_name: 'SIGAP',
    description:
      'Platform pengaduan masyarakat Kota Surabaya. Laporkan aduan, pantau status penanganan, dan dukung aduan warga di sekitar Anda.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f7f5f0',
    theme_color: '#0f3d2e',
    lang: 'id',
    categories: ['government', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
