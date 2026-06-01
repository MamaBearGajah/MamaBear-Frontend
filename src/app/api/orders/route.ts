import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/api/orders";

export async function GET() {
  const orders = await getAllOrders();
  return NextResponse.json(orders, { status: 200 });
}
