import { NextRequest, NextResponse } from "next/server";

const WISHLIST_COOKIE = "mb_wishlist";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readWishlistFromCookie(request: NextRequest): string[] {
  const raw = request.cookies.get(WISHLIST_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (id): id is string => typeof id === "string" && id.trim().length > 0
    );
  } catch {
    return [];
  }
}

function writeWishlistCookie(response: NextResponse, ids: string[]) {
  response.cookies.set(WISHLIST_COOKIE, JSON.stringify(Array.from(new Set(ids))), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
  });
}

export async function GET(request: NextRequest) {
  const ids = readWishlistFromCookie(request);
  return NextResponse.json({
    success: true,
    data: ids.map((productId) => ({ productId })),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid JSON body" },
      },
      { status: 400 }
    );
  }

  const productId =
    body && typeof body === "object"
      ? String((body as { productId?: unknown }).productId ?? "").trim()
      : "";

  if (!productId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "productId is required",
        },
      },
      { status: 400 }
    );
  }

  const current = readWishlistFromCookie(request);
  const updated = Array.from(new Set([...current, productId]));

  const response = NextResponse.json(
    {
      success: true,
      data: { productId },
      message: "Wishlist item added",
    },
    { status: 201 }
  );

  writeWishlistCookie(response, updated);
  return response;
}
