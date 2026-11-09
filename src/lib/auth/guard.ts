import { redirect } from 'next/navigation';
import { getSessionUser, type SessionUser } from './session';
import { homePathForRole, isUserRole, type UserRole } from './roles';

export type Role = UserRole;

export { isUserRole };

export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (!isUserRole(user.role)) redirect('/login');
  if (user.role !== role) redirect(homePathForRole(user.role));
  return user;
}

export async function getVerifiedWarga(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (user.role !== 'Warga') return null;
  if (user.statusAkun !== 'Terverifikasi') return null;
  return user;
}
