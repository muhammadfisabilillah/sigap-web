import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const KTP_BUCKET = 'verifikasi-domisili';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'application/pdf']);
export const MAX_KTP_SIZE = 2 * 1024 * 1024;

export type FileValidationResult =
  | { ok: true; buffer: Buffer; contentType: string }
  | { ok: false; error: string };

export async function validateKtpFile(file: File): Promise<FileValidationResult> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { ok: false, error: 'Jenis berkas harus JPG, PNG, atau PDF' };
  }
  if (file.size > MAX_KTP_SIZE) {
    return { ok: false, error: 'Ukuran berkas maksimal 2 MB' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'Berkas kosong' };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return { ok: true, buffer, contentType: file.type };
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

async function ensureBucket(bucket: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase.storage.createBucket(bucket, { public: true });
  if (error && !error.message.toLowerCase().includes('exists')) return false;
  return true;
}

export async function uploadKtp(userId: number, buffer: Buffer, contentType: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  if (!(await ensureBucket(KTP_BUCKET))) return null;
  const ext = contentType === 'application/pdf' ? 'pdf' : contentType === 'image/png' ? 'png' : 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(KTP_BUCKET)
    .upload(path, new Uint8Array(buffer), { contentType, upsert: false });
  if (error) return null;
  return supabase.storage.from(KTP_BUCKET).getPublicUrl(path).data.publicUrl;
}
