import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const KTP_BUCKET = 'verifikasi-domisili';
export const ADUAN_BUCKET = 'aduan';

const KTP_ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const ADUAN_ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const MAX_KTP_SIZE = 2 * 1024 * 1024;
export const MAX_ADUAN_PHOTO_SIZE = 5 * 1024 * 1024;
export const MAX_ADUAN_PHOTOS = 3;

export type FileValidationResult =
  | { ok: true; buffer: Buffer; contentType: string }
  | { ok: false; error: string };

async function validateFile(
  file: File,
  allowedTypes: Set<string>,
  maxSize: number,
  typeMessage: string,
  sizeMessage: string,
): Promise<FileValidationResult> {
  if (!allowedTypes.has(file.type)) {
    return { ok: false, error: typeMessage };
  }
  if (file.size > maxSize) {
    return { ok: false, error: sizeMessage };
  }
  if (file.size === 0) {
    return { ok: false, error: 'Berkas kosong' };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return { ok: true, buffer, contentType: file.type };
}

export async function validateKtpFile(file: File): Promise<FileValidationResult> {
  return validateFile(
    file,
    KTP_ALLOWED_TYPES,
    MAX_KTP_SIZE,
    'Jenis berkas harus JPG, PNG, atau PDF',
    'Ukuran berkas maksimal 2 MB',
  );
}

export async function validateAduanPhoto(file: File): Promise<FileValidationResult> {
  return validateFile(
    file,
    ADUAN_ALLOWED_TYPES,
    MAX_ADUAN_PHOTO_SIZE,
    'Foto harus JPG, PNG, atau WebP',
    'Ukuran foto maksimal 5 MB',
  );
}

let cached: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  const url = process.env['SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!url || !serviceKey) return null;
  if (!cached) cached = createClient(url, serviceKey, { auth: { persistSession: false } });
  return cached;
}

export function isStorageConfigured(): boolean {
  return getSupabase() !== null;
}

async function ensureBucket(bucket: string, isPublic: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.storage.createBucket(bucket, { public: isPublic });
  if (!error) return true;
  if (!error.message.toLowerCase().includes('exists')) return false;
  if (!isPublic) {
    // Bucket sudah ada — pastikan sifatnya privat (KTP tidak boleh publik).
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: false,
    });
    if (updateError) return false;
  }
  return true;
}

async function uploadToBucket(
  bucket: string,
  folder: string,
  buffer: Buffer,
  contentType: string,
  isPublic: boolean,
): Promise<{ path: string; publicUrl: string | null } | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  if (!(await ensureBucket(bucket, isPublic))) return null;
  const ext =
    contentType === 'application/pdf'
      ? 'pdf'
      : contentType === 'image/png'
        ? 'png'
        : contentType === 'image/webp'
          ? 'webp'
          : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, new Uint8Array(buffer), { contentType, upsert: false });
  if (error) return null;
  const publicUrl = isPublic
    ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    : null;
  return { path, publicUrl };
}

/** Ambil path penyimpanan dari nilai lama yang berupa URL publik penuh. */
export function extractStoragePath(bucket: string, value: string): string {
  const marker = `/${bucket}/`;
  const index = value.indexOf(marker);
  if (index === -1) return value;
  return value.slice(index + marker.length);
}

/**
 * Buat URL akses sementara (1 jam) untuk berkas di bucket privat.
 * Jika bucket publik/gagal, kembalikan nilai aslinya.
 */
export async function getSignedFileUrl(
  bucket: string,
  storedValue: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) return storedValue;
  const path = extractStoragePath(bucket, storedValue);
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) return storedValue;
  return data.signedUrl;
}

/**
 * Upload KTP ke bucket PRIVAT. Mengembalikan path penyimpanan (bukan URL),
 * karena URL publik tidak boleh dipakai untuk dokumen pribadi.
 */
export async function uploadKtp(
  userId: number,
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  const result = await uploadToBucket(KTP_BUCKET, String(userId), buffer, contentType, false);
  return result?.path ?? null;
}

/** Upload foto aduan ke bucket publik. Mengembalikan URL publik. */
export async function uploadAduanPhoto(
  userId: number,
  buffer: Buffer,
  contentType: string,
): Promise<string | null> {
  const result = await uploadToBucket(ADUAN_BUCKET, String(userId), buffer, contentType, true);
  return result?.publicUrl ?? null;
}
