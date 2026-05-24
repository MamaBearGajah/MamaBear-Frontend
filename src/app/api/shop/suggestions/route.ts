import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/api/search";
import { getShopAccessToken } from "@/lib/auth/shop-access-token";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const accessToken = await getShopAccessToken();
    const result = await getSearchSuggestions(q, accessToken);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load suggestions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
