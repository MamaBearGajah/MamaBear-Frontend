import { OrderCard } from "@/components/common/OrderCard";

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
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const origin = base.startsWith("http") ? base : `http://${base}`;
    const apiUrl = new URL("/api/orders", origin).toString();
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data as Order[];
    }
  } catch {
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
          <OrderCard
            key={order.id}
            id={order.id}
            date={order.date}
            status={order.status}
            total={order.total}
            href={`/account/orders/${order.id}`}
            itemCount={order.items.reduce((sum, item) => sum + item.quantity, 0)}
          />
        ))}
      </div>
    </main>
  );
}
