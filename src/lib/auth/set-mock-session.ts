"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createMockAdminSession } from "./mock-session";
import { SESSION_COOKIE } from "./session";

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function assertDevelopment() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Mock session is only available in development.");
  }
}

/** Sets a mock admin session cookie. Development only. */
export async function setMockAdminSession(): Promise<void> {
  assertDevelopment();

  const session = createMockAdminSession();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/** Sets mock session and redirects to admin dashboard. */
export async function loginAsMockAdmin(): Promise<void> {
  await setMockAdminSession();
  redirect("/admin");
}