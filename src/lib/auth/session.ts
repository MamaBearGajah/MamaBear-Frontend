import { cookies } from "next/headers";
import type { Session, UserRole } from "@/types";

/** Cookie set after login (server action / API route). Wired when backend is ready. */
export const SESSION_COOKIE = "mamabear_session";

const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

type TokenPayload = {
  sub?: string;
  exp?: number;
  role?: UserRole;
  email?: string;
  name?: string;
  phone?: string;
  isVerified?: boolean;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
};

function decodeAccessToken(token: string): TokenPayload | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(Buffer.from(base64, "base64url").toString("utf-8")) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const rawSession = cookieStore.get(SESSION_COOKIE)?.value;

  if (accessToken) {
    const payload = decodeAccessToken(accessToken);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    const tokenUser = payload?.user;
    const role = payload?.role ?? tokenUser?.role;

    if (role) {
      return {
        accessToken,
        user: {
          id: String(tokenUser?.id ?? payload?.sub ?? ""),
          name: String(tokenUser?.name ?? payload?.name ?? "Admin"),
          email: String(tokenUser?.email ?? payload?.email ?? ""),
          phone: tokenUser?.phone ?? payload?.phone,
          role,
          isVerified: tokenUser?.isVerified ?? payload?.isVerified ?? true,
          createdAt: tokenUser?.createdAt ?? "",
          updatedAt: tokenUser?.updatedAt ?? "",
        },
      };
    }
  }

  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Session;
    if (!session?.user?.role || !session?.accessToken) return null;
    return session;
  } catch {
    return null;
  }
}

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}