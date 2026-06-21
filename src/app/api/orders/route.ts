import { NextResponse } from "next/server";
import { getOrderList, createOrder } from "@/lib/api/orders";

export async function GET() {
  const orders = await getOrderList();
  return NextResponse.json(orders, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.items) || typeof body.total !== "number") {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const orderPayload = {
      date: body.date || new Date().toISOString().slice(0, 10),
      items: body.items,
      total: body.total,
      status: body.status || "Processing",
      kurir: body.kurir,
      resi: body.resi,
    };

    const created = await createOrder(orderPayload);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
