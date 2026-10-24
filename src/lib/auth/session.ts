import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from '@/src/prisma/db';

export const SESSION_COOKIE = 'sigap_session';
const SESSION_TTL_DAYS = 14;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function issueSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.orm.public.Session.create({ userId, tokenHash: hashToken(token), expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
  return token;
}

export async function destroyCurrentSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return;
  await db.orm.public.Session.where({ tokenHash: hashToken(token) }).delete();
  jar.delete(SESSION_COOKIE);
}

export type SessionUser = {
  id: number;
  nama: string;
  email: string;
  role: string;
  statusAkun: string;
  kecamatanId: number | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const now = new Date().toISOString();
  const session = await db.orm.public.Session
    .where((s) => s.tokenHash.eq(hashToken(token)) && s.expiresAt.gt(now))
    .first();
  if (!session) return null;
  const user = await db.orm.public.User.first({ id: session.userId });
  if (!user) return null;
  return {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    statusAkun: user.statusAkun,
    kecamatanId: user.kecamatanId ?? null,
  };
}
