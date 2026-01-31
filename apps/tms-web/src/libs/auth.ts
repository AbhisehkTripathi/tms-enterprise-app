export type Role = "admin" | "employee";

export interface AuthUser {
  id: string;
  role: Role;
}

const STORAGE_KEY = "tms-auth";

export function getAuth(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuth(user: AuthUser): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return getAuth() != null;
}
