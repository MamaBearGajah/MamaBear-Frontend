import { Mail } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

interface OrderEmailPreviewProps {
  order: Order;
  recipientEmail?: string;
  recipientName?: string;
}

function formatOrderId(id: string): string {
  if (id.length <= 16) return id;
  return `${id.slice(0, 8).toUpperCase()}…`;
}

export default function OrderEmailPreview({
  order,
  recipientEmail = "you@email.com",
  recipientName = "Mama",
}: OrderEmailPreviewProps) {
  const itemPreview = order.items.slice(0, 3);
  const extraCount = Math.max(0, order.items.length - 3);

  return (
    <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
      <div className="border-b border-pink-100 bg-light-pink/40 px-4 py-2">
        <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-brown/60">
          Email preview
        </p>
      </div>

      <div className="space-y-4 p-4 text-left">
        <div className="flex items-center gap-2 border-b border-pink-50 pb-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-dark-pink text-xs font-bold text-white">
            MB
          </div>
          <div>
            <p className="text-sm font-semibold text-brown">MamaBear</p>
            <p className="text-xs text-brown/60">order@mamabear.id</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-brown">
            Hi {recipientName}, your order is confirmed!
          </p>
          <p className="mt-1 text-xs text-brown/70">
            To: {recipientEmail}
          </p>
        </div>

        <div className="rounded-xl bg-light-pink/30 px-3 py-2 text-center">
          <p className="text-xs text-brown/70">Order ID</p>
          <p className="font-mono text-sm font-bold text-dark-pink">
            {formatOrderId(order.id)}
          </p>
        </div>

        <div className="space-y-2 text-sm text-brown">
          {itemPreview.map((item) => {
            const itemPrice =
              item.variant?.discountPrice ?? item.discountPrice ?? item.price;
            return (
              <div
                key={item.id}
                className="flex justify-between gap-2 border-b border-pink-50 pb-2 last:border-0"
              >
                <span className="line-clamp-1">
                  {item.quantity}× {item.name}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(itemPrice * item.quantity)}
                </span>
              </div>
            );
          })}
          {extraCount > 0 && (
            <p className="text-xs text-brown/60">
              +{extraCount} more item{extraCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex justify-between border-t border-pink-100 pt-3 text-sm font-semibold text-brown">
          <span>Total</span>
          <span className="text-dark-pink">{formatPrice(order.total)}</span>
        </div>

        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Complete your payment within <strong>24 hours</strong> to avoid
          automatic cancellation.
        </p>
      </div>
    </div>
  );
}
