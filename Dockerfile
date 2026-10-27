`# syntax=docker/dockerfile:1

# ============================================================
# SIGAP — Sistem Informasi Gerak Aduan Publik
# Multi-stage build Next.js (App Router) + Turbopack
# Target utama  : runner  -> image produksi (output standalone)
# Target opsional: tools  -> utility (prisma db init & seed)
# ============================================================

# ---------- Stage 1: deps (install dependency) ----------
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# postinstall menjalankan `prisma skills sync || exit 0` (aman di container).
# --legacy-peer-deps: lock file tidak memuat peer dev-tree transitive (vitest,
# vite, rolldown, dll) sehingga strict-check `npm ci` bawaan npm >= 11.19 gagal.
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# ---------- Stage 2: builder (build aplikasi) ----------
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Telemetry Next.js dimatikan karena container tidak selalu punya akses keluar
ENV NEXT_TELEMETRY_DISABLED=1

# DATABASE_URL hanya dummy untuk memuaskan evaluasi env saat build
# (klien prisma-orm-postgres bersifat lazy: tidak membuka koneksi saat build).
# URL asli disuntik di runtime oleh compose.yaml / .env
# dan tidak ikut di-bake karena tidak dipakai per-route saat build.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"

RUN npm run build

# ---------- Stage 3: tools (utility DB: init & seed) ----------
# Dipakai service one-shot `setup-db` di compose.yaml (profile "setup").
# Bukan image produksi — berisi devDependencies (prisma CLI, dll).
# Jalankan sebagai root: container sekali pakai, butuh tulis refs migrasi.
FROM node:24-alpine AS tools
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json prisma.config.ts tsconfig.json ./
COPY src/prisma ./src/prisma
CMD ["node", "src/prisma/seed.mjs"]

# ---------- Stage 4: runner (image produksi minimal) ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# output standalone: server + node_modules hasil trace saja
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

RUN chown node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
