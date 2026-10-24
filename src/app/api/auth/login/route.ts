import { NextResponse } from 'next/server';
import { db } from '@/src/prisma/db';
import { verifyPassword } from '@/src/lib/auth/password';
import { getSessionUser, issueSession } from '@/src/lib/auth/session';

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: 'Email dan password wajib diisi' },
      { status: 422 },
    );
  }

  const user = await db.orm.public.User.where((u) => u.email.eq(email)).first();
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ ok: false, error: 'Email atau password salah' }, { status: 401 });
  }

  await issueSession(user.id);
  const sessionUser = await getSessionUser();

  return NextResponse.json({ ok: true, user: sessionUser });
}
