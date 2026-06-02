import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/api/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  try {
    const result = await getSearchSuggestions(q);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load suggestions";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
