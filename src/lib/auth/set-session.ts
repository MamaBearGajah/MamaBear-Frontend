"use server";

import { cookies } from "next/headers";
import type { Session } from "@/types";
import { SESSION_COOKIE } from "./session";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Persist session for Server Components (shop + admin). */
export async function setServerSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearServerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
