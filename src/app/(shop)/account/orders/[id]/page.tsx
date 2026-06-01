import Link from "next/link";

import { CancelOrderDialog } from "@/components/common/CancelOrderDialog";
import { ReviewSection } from "@/components/common/ReviewSection";
import { StatusTimeline } from "@/components/common/StatusTimeline";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById, type Order as OrderType } from "@/lib/api/orders";

const MOCK_ORDERS: OrderType[] = [
  {
    id: "MB-2026-1001",
    date: "2026-05-28",
    items: [
      { id: "p10", name: "MamaBear Protein Mix", quantity: 1, price: 125000 },
    ],
    total: 125000,
    status: "Pending",
  },
  {
    id: "MB-2026-1002",
    date: "2026-05-25",
    items: [
      { id: "p11", name: "Kookie Bites – Peanut", quantity: 2, price: 49000 },
    ],
    total: 98000,
    status: "Processing",
    kurir: "JNE Regular",
    resi: "JNE123456789",
  },
  {
    id: "MB-2026-1003",
    date: "2026-05-20",
    items: [
      { id: "p12", name: "Zaya Mix – Vanilla", quantity: 1, price: 55000 },
    ],
    total: 55000,
    status: "Cancelled",
  },
  {
    id: "MB-2026-5001",
    date: "2026-05-30",
    items: [
      { id: "p4", name: "MamaBear Prenatal Vitamin", quantity: 1, price: 185000 },
      { id: "p5", name: "Kookie Bites – Almond", quantity: 2, price: 42000 },
    ],
    total: 269000,
    status: "Delivered",
    kurir: "JNE Express",
    resi: "JNE987654321",
  },
  {
    id: "MB-2025-4521",
    date: "2025-03-15",
    items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
    total: 98000,
    status: "Delivered",
    kurir: "JNE Express",
    resi: "1234567890123",
  },
  {
    id: "MB-2025-3892",
    date: "2025-02-28",
    items: [
      { id: "p2", name: "Kookie Bites – Chocolate Chip", quantity: 3, price: 39000 },
      { id: "p3", name: "Almon Mix – Vanilla", quantity: 1, price: 59000 },
    ],
    total: 176000,
    status: "Delivered",
    kurir: "TIKI Overnight",
    resi: "9876543210987",
  },
];

async function fetchOrder(id: string): Promise<OrderType> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const origin = base.startsWith("http") ? base : `http://${base}`;
    const apiUrl = new URL(`/api/orders/${id}`, origin).toString();
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        return data as OrderType;
      }
    }
  } catch {
    // ignore and fallback to local mock
  }

  const localOrder = await getOrderById(id);
  return localOrder ?? MOCK_ORDERS.find((order) => order.id === id) ?? MOCK_ORDERS[0];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = await fetchOrder(params.id);

  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);
  const isCancelable = order.status === "Pending" || order.status === "Processing";
  const isShipped = order.status === "Processing" || order.status === "Delivered";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-slate-500">Order details</p>
            <h1 className="text-2xl font-semibold text-slate-900">Order {order.id}</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
            order.status === "Processing" ? "bg-amber-50 text-amber-700 border border-amber-100" :
            order.status === "Pending" ? "bg-sky-50 text-sky-700 border border-sky-100" :
            "bg-rose-50 text-rose-700 border border-rose-100"
          }`}>
            {order.status}
          </div>
        </div>
        <Link href="/account/orders" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50">
          Back to orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card className="border border-pink-100 bg-white shadow-sm">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Items in this order</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-pink-100 px-5 py-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <StatusTimeline currentStatus={order.status} orderDate={order.date} />

          {isShipped && order.kurir && (
            <Card className="border border-pink-100 bg-white shadow-sm">
              <CardHeader className="px-5 py-5">
                <CardTitle className="text-lg font-semibold text-slate-900">Tracking Information</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-4">
                <div className="rounded-3xl bg-blue-50 px-4 py-4 space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Kurir</p>
                    <p className="text-sm font-semibold text-slate-900">{order.kurir}</p>
                  </div>
                  {order.resi && (
                    <div>
                      <p className="text-sm text-slate-600">Nomor Resi</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono">{order.resi}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <ReviewSection order={order} />
        </div>

        <div className="space-y-4">
          <Card className="border border-pink-100 bg-white shadow-sm">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-5 py-4">
              <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-medium text-slate-900 font-mono text-xs">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order date</span>
                  <span className="font-medium text-slate-900">
                    {new Date(order.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Item count</span>
                  <span className="font-medium text-slate-900">{itemCount}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>Total paid</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-5 py-4">
              <p className="text-xs text-slate-500">Thank you for shopping with MamaBear.</p>
            </CardFooter>
          </Card>

          {isCancelable && <CancelOrderDialog orderId={order.id} />}
        </div>
      </div>
    </main>
  );
}
