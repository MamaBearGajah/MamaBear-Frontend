import type { Metadata } from "next";
import { cookies } from "next/headers";

import OrderSuccessView from "@/components/order/OrderSuccessView";
import { fetchOrderWithFallback } from "@/lib/shop/fetch-order";

export const metadata: Metadata = {
  title: "Order Confirmed | MamaBear",
  description: "Your MamaBear order confirmation",
};

interface OrderSuccessPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId?.trim();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const initialOrder = orderId
    ? await fetchOrderWithFallback(orderId, { cookieHeader })
    : null;

  return (
    <main className="min-h-[60vh] bg-light-pink/25 py-10 md:py-14">
      <div className="container-main">
        <OrderSuccessView orderId={orderId} initialOrder={initialOrder} />
      </div>
    </main>
  );
}
