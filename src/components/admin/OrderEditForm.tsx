"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  updateOrderStatusAction,
  type OrderActionState,
} from "@/lib/actions/orders";
import type { Order } from "@/types";

/* ── Types ────────────────────────────────────────────────── */

type OrderStatus = Order["status"];

const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "text-amber-600" },
  { value: "paid", label: "Paid", color: "text-green-600" },
  { value: "processing", label: "Processing", color: "text-blue-600" },
  { value: "shipped", label: "Shipped", color: "text-purple-600" },
  { value: "delivered", label: "Delivered", color: "text-emerald-600" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600" },
];

const STATUS_DOT: Record<OrderStatus, string> = {
  pending: "bg-amber-400",
  paid: "bg-green-400",
  processing: "bg-blue-400",
  shipped: "bg-purple-400",
  delivered: "bg-emerald-400",
  cancelled: "bg-red-400",
};

/* ── Props ────────────────────────────────────────────────── */

interface OrderEditFormProps {
  order: Order;
}

/* ── Component ────────────────────────────────────────────── */

const initialState: OrderActionState = { success: false };

export default function OrderEditForm({ order }: OrderEditFormProps) {
  // bind the order id to the server action
  const action = updateOrderStatusAction.bind(null, order.id);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Show toast on error (success redirects server-side)
  if (state.success === false && state.message) {
    toast.error(state.message);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Error banner */}
      {state.success === false && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Order Status */}
      <fieldset className="border-border bg-card rounded-xl border p-5">
        <legend className="text-foreground mb-4 px-1 text-sm font-semibold">
          Status Pesanan <span className="text-red-500">*</span>
        </legend>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ORDER_STATUSES.map(({ value, label, color }) => (
            <label
              key={value}
              className={cn(
                "relative flex cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3.5 py-3 text-sm font-medium transition-all",
                "has-[:checked]:border-[var(--mamabear-dark-pink)] has-[:checked]:bg-pink-50",
                "border-border hover:border-muted-foreground/40"
              )}
            >
              <input
                type="radio"
                name="status"
                value={value}
                defaultChecked={order.status === value}
                className="sr-only"
              />
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  STATUS_DOT[value]
                )}
              />
              <span className={color}>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Tracking Number */}
      <div className="border-border bg-card space-y-3 rounded-xl border p-5">
        <label
          htmlFor="trackingNumber"
          className="text-foreground block text-sm font-semibold"
        >
          Nomor Resi{" "}
          <span className="text-muted-foreground font-normal">(opsional)</span>
        </label>
        <input
          id="trackingNumber"
          name="trackingNumber"
          type="text"
          defaultValue={order.trackingNumber ?? ""}
          placeholder="Contoh: JX1234567890"
          className={cn(
            "border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus:border-[var(--mamabear-dark-pink)] focus:ring-2 focus:ring-[var(--mamabear-dark-pink)]/40 focus:outline-none",
            "transition-colors"
          )}
        />
        <p className="text-muted-foreground text-xs">
          Isi jika status diubah menjadi <strong>Shipped</strong>.
        </p>
      </div>

      {/* Note */}
      <div className="border-border bg-card space-y-3 rounded-xl border p-5">
        <label
          htmlFor="note"
          className="text-foreground block text-sm font-semibold"
        >
          Catatan Internal{" "}
          <span className="text-muted-foreground font-normal">(opsional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Tambahkan catatan untuk perubahan status ini..."
          className={cn(
            "border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm",
            "placeholder:text-muted-foreground resize-none",
            "focus:border-[var(--mamabear-dark-pink)] focus:ring-2 focus:ring-[var(--mamabear-dark-pink)]/40 focus:outline-none",
            "transition-colors"
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 bg-[var(--mamabear-dark-pink)] text-white hover:bg-[var(--mamabear-dark-pink)]/90"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isPending ? "Menyimpan…" : "Simpan Perubahan"}
        </Button>

        <Link
          href={`/admin/orders/${order.id}`}
          className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Batal
        </Link>
      </div>
    </form>
  );
}
