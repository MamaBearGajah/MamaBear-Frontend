"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Eye, SquarePen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import type { Order } from "@/types";

interface OrdersTableProps {
  orders: Order[];
}

type OrderStatus = Order["status"];

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Paid",
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-700 ring-green-200",
  },
  processing: {
    label: "Processing",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-purple-400",
    badge: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-700 ring-red-200",
  },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        style.badge,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

/** Format order ID as MB-YYYY-NNNN style if it looks like a UUID. */
function formatOrderId(id: string, index: number): string {
  if (id.startsWith("MB-")) return id;
  const year = new Date().getFullYear();
  return `MB-${year}-${String(index + 1).padStart(4, "0")}`;
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-16 text-center">
        <p className="text-muted-foreground">Tidak ada pesanan ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px]">Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            const displayId = formatOrderId(order.id, index);
            const date = format(new Date(order.createdAt), "yyyy-MM-dd");

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-foreground">
                  {displayId}
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {order.user?.name ?? "—"}
                    </p>
                    {order.user?.email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {order.user.email}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{date}</TableCell>
                <TableCell className="font-medium">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" asChild title="View order">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="size-4 text-blue-500" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon-sm" asChild title="Edit order">
                      <Link href={`/admin/orders/${order.id}/edit`}>
                        <SquarePen className="size-4 text-green-600" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
