import { NextResponse } from 'next/server';
import { destroyCurrentSession } from '@/src/lib/auth/session';

export async function POST() {
  await destroyCurrentSession();
  return NextResponse.json({ ok: true, message: 'Logout berhasil' });
}
