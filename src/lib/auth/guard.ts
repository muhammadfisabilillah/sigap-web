import { redirect } from 'next/navigation';
import { getSessionUser, type SessionUser } from './session';

export type Role = 'Warga' | 'Admin' | 'Petugas';

export function isRole(value: string): value is Role {
  return value === 'Warga' || value === 'Admin' || value === 'Petugas';
}

export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isRole(user.role)) redirect('/login');
  if (user.role !== role) {
    redirect(user.role === 'Admin' ? '/admin' : user.role === 'Petugas' ? '/petugas' : '/warga');
  }
  return user;
}
