import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

/**
 * POST /api/auth/refresh
 *
 * Proxy ke backend /auth/refresh.
 * Ambil refreshToken dari cookie frontend, kirim ke backend,
 * lalu re-set accessToken + refreshToken baru di domain frontend.
 */
export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token tidak ditemukan" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Kirim refreshToken ke backend via Cookie header
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      const res = NextResponse.json(data, { status: backendRes.status });
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }

    const res = NextResponse.json(data, { status: 200 });

    // Re-set token baru dari Set-Cookie backend ke domain frontend
    const setCookieRaw = backendRes.headers.get("set-cookie") ?? "";

    const accessMatch = setCookieRaw.match(/(?:^|,\s*)accessToken=([^;,]+)/);
    if (accessMatch?.[1]) {
      res.cookies.set("accessToken", accessMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    const refreshMatch = setCookieRaw.match(/(?:^|,\s*)refreshToken=([^;,]+)/);
    if (refreshMatch?.[1]) {
      res.cookies.set("refreshToken", refreshMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (err) {
    console.error("[/api/auth/refresh] Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}