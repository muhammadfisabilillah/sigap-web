#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/23bd5c0867124915f2b1b65cbecabebc7f4e26898bf2e96e6527fa33f8a930be/contract';
import endContract from '../../snapshots/23bd5c0867124915f2b1b65cbecabebc7f4e26898bf2e96e6527fa33f8a930be/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Aduan',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('deskripsi', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('instansiId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('judul', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('kategoriId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('kecamatanId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('latitude', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('longitude', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('nomorTiket', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pelaporId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('MenungguVerifikasi'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('totalUpvote', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Aduan_status_check_89dfb16a',
            sql`"status" IN ('MenungguVerifikasi', 'Diproses', 'DiteruskanKecamatan', 'MenungguTinjauan', 'Selesai', 'Ditolak')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'FotoAduan',
        columns: [
          col('aduanId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Instansi',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nama', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Kategori',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nama', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Kecamatan',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('nama', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Notifikasi',
        columns: [
          col('aduanId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dibaca', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('judul', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pesan', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'RiwayatStatus',
        columns: [
          col('aduanId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('catatan', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('olehId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('statusAduan', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'RiwayatStatus_statusAduan_check_8b682ad5',
            sql`"statusAduan" IN ('MenungguVerifikasi', 'Diproses', 'DiteruskanKecamatan', 'MenungguTinjauan', 'Selesai', 'Ditolak')`,
          ),
          checkExpression(
            'RiwayatStatus_status_check_004ac9c9',
            sql`"status" IN ('Dibuat', 'Diverifikasi', 'Dikembalikan', 'Diteruskan', 'DitindakLanjuti', 'DitetapkanSelesai')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Upvote',
        columns: [
          col('aduanId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('kecamatanId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('nama', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('noHp', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('Warga'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('statusAkun', 'text', {
            notNull: true,
            default: lit('BelumTerverifikasi'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('User_role_check_cc221145', sql`"role" IN ('Warga', 'Admin', 'Petugas')`),
          checkExpression(
            'User_statusAkun_check_b8e109b6',
            sql`"statusAkun" IN ('BelumTerverifikasi', 'MenungguVerifikasi', 'Terverifikasi')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'VerifikasiDomisili',
        columns: [
          col('catatan', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('fileKtpUrl', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('Menunggu'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'VerifikasiDomisili_status_check_60e8bb19',
            sql`"status" IN ('Menunggu', 'Diterima', 'Ditolak')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Aduan',
        constraint: 'Aduan_nomorTiket_key',
        columns: ['nomorTiket'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Instansi',
        constraint: 'Instansi_nama_key',
        columns: ['nama'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Kategori',
        constraint: 'Kategori_nama_key',
        columns: ['nama'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Kecamatan',
        constraint: 'Kecamatan_nama_key',
        columns: ['nama'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Session',
        constraint: 'Session_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Upvote',
        constraint: 'Upvote_aduanId_userId_key',
        columns: ['aduanId', 'userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'VerifikasiDomisili',
        constraint: 'VerifikasiDomisili_userId_key',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Aduan',
        index: 'Aduan_instansiId_idx_8bad60fa',
        columns: ['instansiId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Aduan',
        index: 'Aduan_kategoriId_idx_807b1d04',
        columns: ['kategoriId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Aduan',
        index: 'Aduan_kecamatanId_idx_b56575e3',
        columns: ['kecamatanId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Aduan',
        index: 'Aduan_pelaporId_idx_bf2820df',
        columns: ['pelaporId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'FotoAduan',
        index: 'FotoAduan_aduanId_idx_1278931e',
        columns: ['aduanId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Notifikasi',
        index: 'Notifikasi_aduanId_idx_1278931e',
        columns: ['aduanId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Notifikasi',
        index: 'Notifikasi_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RiwayatStatus',
        index: 'RiwayatStatus_aduanId_idx_1278931e',
        columns: ['aduanId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RiwayatStatus',
        index: 'RiwayatStatus_olehId_idx_1ef59b2b',
        columns: ['olehId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Session',
        index: 'Session_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Upvote',
        index: 'Upvote_aduanId_idx_1278931e',
        columns: ['aduanId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Upvote',
        index: 'Upvote_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_kecamatanId_idx_b56575e3',
        columns: ['kecamatanId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Aduan',
        foreignKey: {
          name: 'Aduan_pelaporId_fkey',
          columns: ['pelaporId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Aduan',
        foreignKey: {
          name: 'Aduan_kategoriId_fkey',
          columns: ['kategoriId'],
          references: { schema: 'public', table: 'Kategori', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Aduan',
        foreignKey: {
          name: 'Aduan_kecamatanId_fkey',
          columns: ['kecamatanId'],
          references: { schema: 'public', table: 'Kecamatan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Aduan',
        foreignKey: {
          name: 'Aduan_instansiId_fkey',
          columns: ['instansiId'],
          references: { schema: 'public', table: 'Instansi', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'FotoAduan',
        foreignKey: {
          name: 'FotoAduan_aduanId_fkey',
          columns: ['aduanId'],
          references: { schema: 'public', table: 'Aduan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Notifikasi',
        foreignKey: {
          name: 'Notifikasi_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Notifikasi',
        foreignKey: {
          name: 'Notifikasi_aduanId_fkey',
          columns: ['aduanId'],
          references: { schema: 'public', table: 'Aduan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RiwayatStatus',
        foreignKey: {
          name: 'RiwayatStatus_aduanId_fkey',
          columns: ['aduanId'],
          references: { schema: 'public', table: 'Aduan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RiwayatStatus',
        foreignKey: {
          name: 'RiwayatStatus_olehId_fkey',
          columns: ['olehId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Session',
        foreignKey: {
          name: 'Session_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Upvote',
        foreignKey: {
          name: 'Upvote_aduanId_fkey',
          columns: ['aduanId'],
          references: { schema: 'public', table: 'Aduan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Upvote',
        foreignKey: {
          name: 'Upvote_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'User',
        foreignKey: {
          name: 'User_kecamatanId_fkey',
          columns: ['kecamatanId'],
          references: { schema: 'public', table: 'Kecamatan', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'VerifikasiDomisili',
        foreignKey: {
          name: 'VerifikasiDomisili_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
