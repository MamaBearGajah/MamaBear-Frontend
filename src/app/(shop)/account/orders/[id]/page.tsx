import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import OrderDetailContent from "@/components/order/OrderDetailContent";
import { fetchOrderWithFallback } from "@/lib/shop/fetch-order";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const order = await fetchOrderWithFallback(id, { cookieHeader });

  if (!order) {
    notFound();
  }

  return <OrderDetailContent order={order} />;
}
