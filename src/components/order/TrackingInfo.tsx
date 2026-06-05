"use client";

import { useState } from "react";
import { Check, Copy, Truck } from "lucide-react";
import { isTrackingVisible } from "@/config/order-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

interface TrackingInfoProps {
  order: Pick<
    Order,
    "status" | "courier" | "service" | "trackingNumber"
  >;
  className?: string;
}

export default function TrackingInfo({ order, className }: TrackingInfoProps) {
  const [copied, setCopied] = useState(false);

  if (!isTrackingVisible(order.status)) return null;
  if (!order.trackingNumber && !order.courier) return null;

  const handleCopy = async () => {
    if (!order.trackingNumber) return;
    try {
      await navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <Card
      className={cn(
        "border border-[#F8D7E3] bg-white shadow-sm",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 border-b border-[#F8D7E3] px-5 py-4">
        <Truck className="size-5 text-[#F05A89]" aria-hidden />
        <CardTitle className="text-base font-bold text-gray-800">
          Tracking Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4 rounded-2xl bg-sky-50 px-4 py-4">
          {order.courier && (
            <div>
              <p className="text-sm text-slate-600">Kurir</p>
              <p className="text-sm font-semibold text-slate-900">
                {order.courier.toUpperCase()}
                {order.service ? ` • ${order.service.toUpperCase()}` : ""}
              </p>
            </div>
          )}
          {order.trackingNumber && (
            <div>
              <p className="text-sm text-slate-600">Nomor Resi</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="font-mono text-sm font-semibold text-slate-900">
                  {order.trackingNumber}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-sky-200 bg-white p-1.5 text-sky-700 transition hover:bg-sky-100"
                  aria-label="Copy tracking number"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
