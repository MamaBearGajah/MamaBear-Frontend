import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/api/orders";

async function updateOrder(id: string, patch: any) {
  // Placeholder: actual update logic should be implemented based on your backend
  // For now, return null to indicate order not found
  return null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order, { status: 200 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch: any = {};
    if (body.status) patch.status = body.status;
    if (body.kurir !== undefined) patch.kurir = body.kurir;
    if (body.resi !== undefined) patch.resi = body.resi;

    const updated = await updateOrder(id, patch);
    if (!updated)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
