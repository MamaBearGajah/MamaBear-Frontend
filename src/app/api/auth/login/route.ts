import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

/**
 * POST /api/auth/login
 *
 * Proxy ke backend /auth/login.
 * Backend set accessToken + refreshToken sebagai HTTP-only cookie di domain-nya sendiri
 * (mamabear-backend.onrender.com) — browser tidak simpan cookie itu untuk domain frontend.
 *
 * Solusi: kita extract nilai token dari Set-Cookie header backend,
 * lalu re-set sebagai cookie di domain FRONTEND (vercel.app) sendiri.
 * Dengan begitu middleware Next.js bisa baca cookie-nya.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    const res = NextResponse.json(data, { status: 200 });

    // Backend set token via Set-Cookie header — extract nilainya
    // Set-Cookie bisa multiple values, Node fetch menggabung dengan ", "
    const setCookieRaw = backendRes.headers.get("set-cookie") ?? "";

    // Regex extract accessToken value
    const accessMatch = setCookieRaw.match(/(?:^|,\s*)accessToken=([^;,]+)/);
    if (accessMatch?.[1]) {
      res.cookies.set("accessToken", accessMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "lax",  // lax cukup untuk same-site redirect, lebih aman dari none
        path: "/",
        maxAge: 15 * 60, // 15 menit
      });
    }

    // Regex extract refreshToken value
    const refreshMatch = setCookieRaw.match(/(?:^|,\s*)refreshToken=([^;,]+)/);
    if (refreshMatch?.[1]) {
      res.cookies.set("refreshToken", refreshMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 hari
      });
    }

    return res;
  } catch (err) {
    console.error("[/api/auth/login] Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
