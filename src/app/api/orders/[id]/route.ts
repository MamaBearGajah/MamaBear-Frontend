import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/api/orders";

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
