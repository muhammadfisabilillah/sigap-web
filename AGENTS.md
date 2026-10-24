<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SIGAP — Sistem Informasi Gerak Aduan Publik

PWA pengaduan masyarakat Kota Surabaya. Tiga aktor: **Warga**, **Admin** (verifikasi aduan & domisili), **Petugas Kecamatan** (tindak lanjut lapangan). Detail fungsional & arsitektur ada di `README.md`.

## Status scaffold

Proyek masih tahap awal: hanya `src/app/{layout.tsx,page.tsx,globals.css}` yang berisi. Folder `(auth)`, `(dashboard)/admin|petugas|warga`, `api/aduan|auth|verifikasi`, `components/*`, `lib`, `services`, `types`, dan `prisma/` masih kosong — namanya adalah rencana arsitektur, bukan kode yang jalan. Jangan asumsikan perilaku dari nama folder.

## Commands

```powershell
npm run dev      # next dev (Turbopack)
npm run build    # verifikasi utama
npm run lint     # eslint (flat config); satu-satunya check — tidak ada test framework
```

Jalankan `npm run lint` dan `npm run build` sebelum menyerahkan pekerjaan.

## Toolchain gotchas

- **Tailwind CSS v4** dimuat lewat loader `@tailwindcss/turbopack` di `next.config.ts` — tidak ada `tailwind.config` / postcss config.
- **Next.js 16.4.2** dengan `cacheComponents: true` dan `partialPrefetching: true`. Sebelum menulis kode App Router, baca docnya di `node_modules/next/dist/docs/` (lihat blok di atas).
- **Prisma 8 (CLI RC)**: data model ada di `src/prisma/contract.prisma` (bukan `prisma/schema.prisma` lama). Workflow: edit contract → `npx prisma contract emit` → regenerate `contract.json` + `contract.d.ts` (keduanya di-commit). Query via `import { db } from '@/src/prisma/db'`. Quickref: `prisma-8.md`. Status akun/aduan memakai enum PSL.
- `npm install` menjalankan `postinstall: prisma skills sync || exit 0` yang men-generate folder `.agents/.claude/.cursor/.devin` — jangan edit manual.
- Path alias: `@/*` → root repo.

## Workflow team (dari README — wajib)

- **Dilarang commit/push langsung ke `main`.** Kode stabil dipresentasikan lewat `main`.
- Branch kerja: `feature/<nama-fitur>`, dibuat dari `origin/development`.
- Commit style: `feat: <deskripsi fitur>` / `fix: ...` / `chore: ...`.
- Semua PR merujuk task Jira project **`SCRUM`** (`https://student-team-pfi1mhqz.atlassian.net`), format judul: `SCRUM-<id> <deskripsi>`.

## Jira (SCRUM board)

- MCP Atlassian (`mcp-atlassian`) dikonfigurasi di `opencode.json` dengan filter project `SCRUM` — token Jira ada di environment var `JIRA_API_TOKEN`, jangan hardcode.
- `opencode.json` **tidak ter-track** dan berisi kredensial — jangan pernah di-commit atau disalin isinya.
- `.env*` di-gitignore (kredensial Supabase: Postgres DB + Storage).

## Git state gotcha

Remote `origin/main` hanya berisi README; seluruh kode ada di `origin/development`. Selalu kerja dari `development`, bukan `main`.
