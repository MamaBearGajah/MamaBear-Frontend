"use client";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

import { CancelOrderDialog } from "@/components/common/CancelOrderDialog";
import { ReviewSection } from "@/components/common/ReviewSection";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderTimeline from "@/components/order/OrderTimeline";
import TrackingInfo from "@/components/order/TrackingInfo";
import { isOrderCancellable } from "@/config/order-status";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderDetailContentProps {
  order: Order;
}

export default function OrderDetailContent({ order }: OrderDetailContentProps) {
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <AccountPageWrapper
      title="Order Details"
      icon={Package}
      actionButton={
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#F8D7E3] bg-white px-4 py-2 text-sm font-bold text-[#F05A89] transition-colors hover:bg-[#FDF2F5]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to orders
        </Link>
      }
    >
      <div className="mb-6 space-y-3 border-b border-dashed border-[#F8D7E3] pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge
            status={order.status}
            paymentStatus={order.paymentStatus}
          />
        </div>
        <div>
          <p className="font-mono text-base font-bold text-gray-800 sm:text-lg">
            {order.id}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Dipesan{" "}
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {itemCount} item{itemCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#F8D7E3] bg-[#FFFBFC]">
            <div className="border-b border-[#F8D7E3] px-5 py-4">
              <h3 className="font-bold text-gray-800">Items in this order</h3>
            </div>
            <ul className="divide-y divide-[#F8D7E3] px-5">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-gray-800">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <OrderTimeline
            currentStatus={order.status}
            orderDate={order.createdAt}
          />

          <TrackingInfo order={order} />

          <ReviewSection order={order} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-[#F8D7E3] bg-white">
            <div className="border-b border-[#F8D7E3] px-5 py-4">
              <h3 className="font-bold text-gray-800">Order summary</h3>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="space-y-2 rounded-xl bg-[#FDF2F5] px-4 py-3 text-sm text-gray-700">
                <div className="flex justify-between gap-3">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(itemsSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between gap-3 border-t border-[#F8D7E3] pt-2 font-bold text-gray-900">
                  <span>Total paid</span>
                  <span className="text-[#F05A89]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Thank you for shopping with MamaBear.
              </p>
            </div>
          </section>

          {isOrderCancellable(order.status) && (
            <CancelOrderDialog orderId={order.id} />
          )}
        </aside>
      </div>
    </AccountPageWrapper>
  );
}
