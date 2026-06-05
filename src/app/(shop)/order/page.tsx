import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getOrderById, type Order as OrderType } from "@/lib/api/orders";

const SAMPLE_ORDER: OrderType = {
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
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

export default async function OrderConfirmationPage({ searchParams }: { searchParams?: { id?: string } }) {
  const id = searchParams?.id;
  let order: OrderType | undefined = undefined;

  if (id) {
    try {
      order = await getOrderById(id);
    } catch {
      order = undefined;
    }
  }

  const o = order ?? SAMPLE_ORDER;

  const subtotal = o.items.reduce((s, it) => s + it.price * it.quantity, 0);

  // Estimate delivery: if courier includes 'Express' assume 1-2 days otherwise 2-4 days
  const isExpress = (o.kurir ?? "").toLowerCase().includes("express");
  const etaText = isExpress ? "1-2 days" : "2-4 days";
  const estimatedDate = addDays(o.date, isExpress ? 1 : 3);

  // Mock delivery address (replace with real user address when available)
  const deliveryAddress = {
    name: "Nama Pembeli",
    line1: "Jl. Contoh No.123",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postal: "12345",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Order placed</p>
          <h1 className="text-2xl font-semibold text-slate-900">Thank you — your payment is confirmed</h1>
          <p className="mt-1 text-sm text-slate-600">Order {o.id} • {new Date(o.date).toLocaleDateString('id-ID')}</p>
        </div>
        <Link href="/" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50">Continue shopping</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="border border-pink-100 bg-white shadow-sm">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Items in this order</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-pink-100 px-5 py-4">
              {o.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-pink-100 bg-white shadow-sm">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Delivery</CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 space-y-3">
              <div>
                <p className="text-sm text-slate-600">Delivery address</p>
                <p className="font-medium text-slate-900">{deliveryAddress.name}</p>
                <p className="text-sm text-slate-700">{deliveryAddress.line1}</p>
                <p className="text-sm text-slate-700">{deliveryAddress.city}, {deliveryAddress.province} {deliveryAddress.postal}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600">Estimated delivery</p>
                <p className="font-medium text-slate-900">{estimatedDate.toLocaleDateString('id-ID')}</p>
                <p className="text-sm text-slate-500">Estimated time: {etaText}</p>
                {o.kurir && <p className="mt-2 text-sm text-slate-600">Kurir: {o.kurir} {o.resi ? `• Resi: ${o.resi}` : null}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border border-pink-100 bg-white shadow-sm">
            <CardHeader className="px-5 py-5">
              <CardTitle className="text-lg font-semibold text-slate-900">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-5 py-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">{o.kurir ? "Rp 25.000" : "Rp 0"}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(o.total)}</span>
              </div>
            </CardContent>
            <CardFooter className="px-5 py-4">
              <p className="text-xs text-slate-500">A confirmation email has been sent to your email address.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
