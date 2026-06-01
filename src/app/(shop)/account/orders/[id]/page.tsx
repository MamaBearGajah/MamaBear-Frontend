import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderById, type Order as OrderType } from "@/lib/api/orders";

const MOCK_ORDERS: OrderType[] = [
  {
    id: "MB-2025-4521",
    date: "2025-03-15",
    items: [{ id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 }],
    total: 98000,
    status: "Delivered",
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
  },
  {
    id: "MB-2025-2107",
    date: "2025-01-10",
    items: [{ id: "p4", name: "ASI Booster Capsules – Premium", quantity: 1, price: 125000 }],
    total: 125000,
    status: "Delivered",
  },
  {
    id: "MB-2024-9934",
    date: "2024-12-05",
    items: [
      { id: "p5", name: "Zaya Mix – Chocolate", quantity: 2, price: 55000 },
      { id: "p6", name: "Kookie Bites – Matcha", quantity: 2, price: 39000 },
    ],
    total: 188000,
    status: "Delivered",
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
  if (!order) {
    notFound();
  }

  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Order details</p>
          <h1 className="text-2xl font-semibold text-slate-900">Order {order.id}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-slate-100 text-slate-800 border-slate-200" variant="outline">
            {order.status}
          </Badge>
          <Link href="/account/orders" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50">
            Back to orders
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
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

        <Card className="border border-pink-100 bg-white shadow-sm">
          <CardHeader className="px-5 py-5">
            <CardTitle className="text-lg font-semibold text-slate-900">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 py-4">
            <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Order ID</span>
                <span className="font-medium text-slate-900">{order.id}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Order date</span>
                <span className="font-medium text-slate-900">{new Date(order.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
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
            <p className="text-sm text-slate-500">Thank you for shopping with MamaBear.</p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
