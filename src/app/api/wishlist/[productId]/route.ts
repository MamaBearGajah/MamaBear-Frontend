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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId: productIdParam } = await params;
  const productId = String(productIdParam ?? "").trim();

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
  const updated = current.filter((id) => id !== productId);

  const response = NextResponse.json({
    success: true,
    data: { productId },
    message: "Wishlist item removed",
  });

  writeWishlistCookie(response, updated);
  return response;
}
