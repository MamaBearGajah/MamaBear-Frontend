import { NextRequest, NextResponse } from "next/server";

const WISHLIST_COOKIE = "mb_wishlist";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
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
  const count = current.includes(productId) ? 1 : 0;

  return NextResponse.json({
    success: true,
    data: {
      productId,
      count,
    },
  });
}
