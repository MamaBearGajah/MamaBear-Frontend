import { NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/api/orders";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: Params) {
  const order = await getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const patch: any = {};
    if (body.status) patch.status = body.status;
    if (body.kurir !== undefined) patch.kurir = body.kurir;
    if (body.resi !== undefined) patch.resi = body.resi;

    const updated = await updateOrder(params.id, patch);
    if (!updated) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
