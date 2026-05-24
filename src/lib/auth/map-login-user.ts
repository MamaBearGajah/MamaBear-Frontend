import type { User, UserRole } from "@/types";

export interface BackendLoginUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function mapLoginUser(raw: BackendLoginUser): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role as UserRole,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
