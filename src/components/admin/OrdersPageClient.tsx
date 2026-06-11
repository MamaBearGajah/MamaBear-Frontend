"use client";

import { Suspense } from "react";
import OrdersToolbar from "@/components/admin/OrdersToolbar";
import OrdersTable from "@/components/admin/OrdersTable";
import Pagination from "@/components/shared/Pagination";
import type { Order } from "@/types";

type OrderStatus = Order["status"] | "all";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface OrdersPageClientProps {
  orders: Order[];
  meta: PaginationMeta;
  activeStatus: OrderStatus;
}

function OrdersPageContent({
  orders,
  meta,
  activeStatus,
}: OrdersPageClientProps) {
  return (
    <>
      <OrdersToolbar meta={meta} activeStatus={activeStatus} />
      <OrdersTable orders={orders} />
      <div className="mt-6">{/* <Pagination meta={meta} /> */}</div>
    </>
  );
}

export default function OrdersPageClient(props: OrdersPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
          Memuat…
        </div>
      }
    >
      <OrdersPageContent {...props} />
    </Suspense>
  );
}
