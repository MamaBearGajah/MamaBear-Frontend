"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import { ORDER_STATUS_LABELS } from "@/config/order-status";
import { getOrderList } from "@/lib/api/orders";
import { getFallbackOrders } from "@/lib/shop/fallback-orders";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@/types";

const STATUS_MAP: Record<
  OrderStatus,
  { icon: React.ElementType; bg: string; text: string }
> = {
  pending: { icon: Clock, bg: "#FEF3C7", text: "#92400E" },
  paid: { icon: CheckCircle, bg: "#E0F2FE", text: "#075985" },
  processing: { icon: Package, bg: "#DBEAFE", text: "#1E40AF" },
  shipped: { icon: Truck, bg: "#EDE9FE", text: "#5B21B6" },
  delivered: { icon: CheckCircle, bg: "#D1FAE5", text: "#065F46" },
  cancelled: { icon: X, bg: "#FEE2E2", text: "#991B1B" },
};

function getItemName(item: OrderItem & { variant?: { product?: { name?: string } } }): string {
  return item.variant?.product?.name ?? item.name ?? "Product";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getOrderList({ page: 1, limit: 20 });
        setOrders(res.data ?? []);
      } catch {
        setOrders(getFallbackOrders());
      } finally {
        setIsLoading(false);
      }
    }
    void fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">Memuat pesanan...</div>
    );
  }

  return (
    <AccountPageWrapper title="My Orders" icon={ShoppingBag}>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#F8D7E3] bg-[#FDF2F5] py-20 text-center">
          <div className="mb-4 text-5xl">🛍️</div>
          <h3 className="mb-2 text-lg font-bold text-gray-800">
            Belum ada pesanan
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Sepertinya kamu belum membuat pesanan pertama.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-[#F05A89] px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = (order.status?.toLowerCase() ?? "pending") as OrderStatus;
            const status = STATUS_MAP[statusKey] ?? STATUS_MAP.pending;
            const StatusIcon = status.icon;
            const detailHref = `/account/orders/${order.id}`;

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-[#F8D7E3] bg-white p-5 transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <Link
                    href={detailHref}
                    className="group min-w-0 flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#F05A89]"
                  >
                    <p className="font-bold text-gray-800 group-hover:text-[#F05A89]">
                      {order.id}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Dipesan{" "}
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    <StatusIcon size={12} strokeWidth={2.5} />
                    {ORDER_STATUS_LABELS[statusKey] ?? statusKey}
                  </span>
                </div>

                <Link
                  href={detailHref}
                  className="mb-4 block space-y-3 border-b border-dashed border-[#F8D7E3] pb-4"
                >
                  {order.items.map((item, index) => (
                    <div
                      key={item.id ?? `${order.id}-item-${index}`}
                      className="flex items-center justify-between gap-4"
                    >
                      <p className="text-sm leading-snug text-gray-600">
                        {getItemName(item)}{" "}
                        <span className="ml-1 text-xs font-bold text-gray-400">
                          ×{item.quantity}
                        </span>
                      </p>
                      <p className="whitespace-nowrap text-sm font-bold text-gray-700">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-500">Total Belanja</span>
                    <p className="mt-0.5 text-lg font-black leading-none text-[#F05A89]">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={detailHref}
                      className="inline-flex items-center gap-1 rounded-full border border-[#F8D7E3] bg-white px-5 py-2 text-xs font-bold text-[#F05A89] transition-all hover:bg-[#FDF2F5]"
                    >
                      Lihat Detail
                      <ChevronRight className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      href="/products"
                      className="rounded-full border border-[#F8D7E3] px-5 py-2 text-xs font-bold text-[#F05A89] transition-all hover:bg-[#FDF2F5]"
                    >
                      Beli Lagi
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AccountPageWrapper>
  );
}
