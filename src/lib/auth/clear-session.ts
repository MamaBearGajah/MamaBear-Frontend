"use server";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./session";

/** Clears session cookie on logout. */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}