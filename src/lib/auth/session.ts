import { cookies } from "next/headers";
import type { Session, UserRole } from "@/types";
import { createMockAdminSession, isMockAuthEnabled } from "./mock-session";

/** Cookie set after login (server action / API route). Wired when backend is ready. */
export const SESSION_COOKIE = "mamabear_session";

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (!raw) {
    if (isMockAuthEnabled()) return createMockAdminSession();
    return null;
  }

  try {
    const session = JSON.parse(raw) as Session;
    if (!session?.user?.role || !session?.accessToken) return null;
    return session;
  } catch {
    return null;
  }
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}
