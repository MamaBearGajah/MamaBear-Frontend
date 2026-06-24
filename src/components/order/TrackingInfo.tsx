"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Truck } from "lucide-react";
import { isTrackingVisible } from "@/config/order-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

// Map nama kurir → URL tracking (ganti {resi} dengan nomor resi)
const COURIER_TRACKING_URLS: Record<string, string> = {
  jne: "https://www.jne.co.id/id/tracking/trace?awbNumber={resi}",
  jnt: "https://www.jnt.id/id/tracking?awb={resi}",
  "j&t": "https://www.jnt.id/id/tracking?awb={resi}",
  sicepat: "https://www.sicepat.com/checkAwb?awb={resi}",
  anteraja: "https://anteraja.id/tracking?awb={resi}",
  tiki: "https://tiki.id/id/tracking?connote={resi}",
  pos: "https://www.posindonesia.co.id/id/tracking?stt_no={resi}",
  gosend: "https://www.gojek.com/gosend/",
  grab: "https://www.grab.com/id/express/",
  ninja: "https://www.ninjaxpress.co/id-id/tracking?id={resi}",
  wahana: "https://wahana.com/tracking?airwaybill={resi}",
  lion: "https://www.lionparcel.com/resi/{resi}",
};

function getCourierTrackingUrl(
  courier: string,
  trackingNumber: string,
): string | null {
  const key = courier.toLowerCase().replace(/\s+/g, "");
  for (const [name, url] of Object.entries(COURIER_TRACKING_URLS)) {
    if (key.includes(name) || name.includes(key)) {
      return url.replace("{resi}", encodeURIComponent(trackingNumber));
    }
  }
  return null;
}

interface TrackingInfoProps {
  order: Pick<
    Order,
    | "status"
    | "courier"
    | "service"
    | "trackingNumber"
    | "estimatedDelivery"
    | "deliveredAt"
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

  const trackingUrl =
    order.trackingNumber && order.courier
      ? getCourierTrackingUrl(order.courier, order.trackingNumber)
      : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Card className={cn("border border-[#F8D7E3] bg-white shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center gap-2 border-b border-[#F8D7E3] px-5 py-4">
        <Truck className="size-5 text-[#F05A89]" aria-hidden />
        <CardTitle className="text-base font-bold text-gray-800">
          Informasi Pengiriman
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4 rounded-2xl bg-sky-50 px-4 py-4">
          {order.courier && (
            <div>
              <p className="text-xs text-slate-500">Kurir</p>
              <p className="text-sm font-semibold text-slate-900">
                {order.courier.toUpperCase()}
                {order.service ? ` • ${order.service.toUpperCase()}` : ""}
              </p>
            </div>
          )}

          {order.trackingNumber && (
            <div>
              <p className="text-xs text-slate-500">Nomor Resi</p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <p className="font-mono text-sm font-semibold text-slate-900">
                  {order.trackingNumber}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-sky-200 bg-white p-1.5 text-sky-700 transition hover:bg-sky-100"
                  aria-label="Salin nomor resi"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                {trackingUrl && (
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    Lacak
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Estimasi tiba dari BE */}
          {order.estimatedDelivery && order.status !== "delivered" && (
            <div>
              <p className="text-xs text-slate-500">Estimasi Tiba</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          )}

          {/* Tanggal diterima kalau sudah delivered */}
          {order.deliveredAt && order.status === "delivered" && (
            <div>
              <p className="text-xs text-slate-500">Diterima pada</p>
              <p className="text-sm font-semibold text-emerald-700">
                {formatDate(order.deliveredAt)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}