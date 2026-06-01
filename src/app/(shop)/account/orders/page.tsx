import Link from "next/link";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  date: string; // ISO or readable
  items: OrderItem[];
  total: number;
  status: "Delivered" | "Processing" | "Cancelled" | "Pending";
  customerName?: string;
};

const MOCK_ORDERS: Order[] = [
  {
    id: "MB-2025-4521",
    date: "2025-03-15",
    items: [
      { id: "p1", name: "ASI Booster Tea – Thai Milk Tea", quantity: 2, price: 49000 },
    ],
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

async function fetchOrders(): Promise<Order[]> {
  // Try to fetch from an API route if available, otherwise fall back to mock data.
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE || "";
    const apiUrl = base ? `${base}/api/orders` : `/api/orders`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data as Order[];
    }
  } catch (err) {
    // ignore and fallback to mock
  }

  return MOCK_ORDERS;
}

export default async function Page() {
  const orders = await fetchOrders();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="mt-2 text-sm text-slate-500">A list of recent orders placed on the store.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-500">{order.id}</div>
                  <div className="text-xs text-slate-400">• Ordered {new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  {order.items.slice(0, 2).map((it) => (
                    <div key={it.id} className="flex items-center justify-between border-b border-pink-50 py-2">
                      <div className="text-sm text-slate-800">{it.name} {it.quantity > 1 ? `×${it.quantity}` : ""}</div>
                      <div className="text-sm text-slate-800">Rp {(it.price * it.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {order.status}
                </div>
                <div className="text-sm font-semibold">Rp {order.total.toLocaleString()}</div>
                <Link href={`/order/${order.id}`} className="rounded-full border border-pink-200 px-3 py-1 text-xs text-pink-600">Reorder</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
