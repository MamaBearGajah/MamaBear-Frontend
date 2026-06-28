import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api";

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Fire-and-forget ke backend (hapus refreshToken di DB)
    if (accessToken) {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // Kirim juga cookie refresh supaya backend bisa invalidate
          Cookie: refreshToken ? `refreshToken=${refreshToken}` : "",
        },
      }).catch((err) => {
        console.error("[/api/auth/logout] Backend logout error (non-fatal):", err);
      });
    }

    // Hapus cookie dari domain frontend (yang penting ini)
    const res = NextResponse.json({ success: true, message: "Logout berhasil" });
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  } catch (err) {
    console.error("[/api/auth/logout] Error:", err);
    // Tetap hapus cookie walaupun error
    const res = NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }
}