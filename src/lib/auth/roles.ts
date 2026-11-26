export type UserRole = 'Warga' | 'Admin' | 'Petugas';

const HOME_BY_ROLE: Record<UserRole, string> = {
  Warga: '/warga',
  Admin: '/admin',
  Petugas: '/petugas',
};

export function isUserRole(value: string): value is UserRole {
  return value === 'Warga' || value === 'Admin' || value === 'Petugas';
}

export function homePathForRole(role: string): string {
  return isUserRole(role) ? HOME_BY_ROLE[role] : '/login';
}
