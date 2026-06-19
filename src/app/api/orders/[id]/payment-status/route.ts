import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${params.orderId}`,
    {
      headers: {
        // forward cookie/token dari request
        cookie: req.headers.get("cookie") ?? "",
      },
    }
  );
  const data = await res.json();
  return NextResponse.json({ paymentStatus: data?.data?.paymentStatus });
}