import { NextResponse } from "next/server";
import { getOrderList, createOrder } from "@/lib/api/orders";

export async function GET() {
  const orders = await getOrderList();
  return NextResponse.json(orders, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.addressId || !body.courier || !body.service) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const orderPayload = {
      addressId: body.addressId,
      courier: body.courier,
      service: body.service,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
    };

    const created = await createOrder(orderPayload);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
