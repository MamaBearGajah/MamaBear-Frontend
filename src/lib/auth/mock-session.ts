import type { Session } from "@/types";

/** Mock admin session for local UI development only. */
export function createMockAdminSession(): Session {
  return {
    accessToken: "mock-access-token-dev",
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      name: "Admin",
      email: "admin@mamabear.local",
      role: "admin",
      isVerified: true,
    },
  };
}

/** True when mock auth is allowed (development + explicit env flag). */
export function isMockAuthEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.MOCK_ADMIN_AUTH === "true"
  );
}