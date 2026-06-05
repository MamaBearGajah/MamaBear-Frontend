"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Truck, Clock, CheckCircle, X, ShoppingBag } from "lucide-react";
import { profileApi } from "@/lib/api/profile";
import {getOrders} from "@/lib/api/profile";
import { AccountPageWrapper } from "@/components/layout/AccountPageWrapper";
import { OrderItem } from "@/lib/api/orders";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
};

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  delivered:  { label: "Delivered",  icon: CheckCircle, bg: "#D1FAE5", text: "#065F46" },
  shipped:    { label: "Shipped",    icon: Truck,       bg: "#EDE9FE", text: "#5B21B6" },
  processing: { label: "Processing", icon: Package,     bg: "#DBEAFE", text: "#1E40AF" },
  pending:    { label: "Pending",    icon: Clock,       bg: "#FEF3C7", text: "#92400E" },
  cancelled:  { label: "Cancelled",  icon: X,           bg: "#FEE2E2", text: "#991B1B" },
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
  {
    id: "MB-2024-9811",
    date: "2024-12-12",
    items: [
      { id: "p5", name: "Zaya Mix – Chocolate", quantity: 2, price: 55000 },
      { id: "p6", name: "Kookie Bites – Matcha", quantity: 2, price: 39000 },
    ],
    total: 188000,
    status: "Cancelled",
  },
  {
    id: "MB-2025-9111",
    date: "2025-12-12",
    items: [
      { id: "p5", name: "Zaya Mix – Chocolate", quantity: 2, price: 55000 },
      { id: "p6", name: "Kookie Bites – Matcha", quantity: 2, price: 39000 },
    ],
    total: 210000,
    status: "Processing",
  },
];


export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        // const res = MOCK_ORDERS;
        // setOrders(res.data || [MOCK_ORDERS]);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) return <div className="py-20 text-center text-gray-500">Memuat pesanan...</div>;

  return (
    <AccountPageWrapper title="My Orders" icon={ShoppingBag}>
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#FDF2F5] rounded-2xl border border-dashed border-[#F8D7E3]">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">Belum ada pesanan</h3>
          <p className="text-sm mb-6 text-gray-500">Sepertinya kamu belum membuat pesanan pertama.</p>
          <Link href="/products" className="inline-flex items-center px-6 py-3 rounded-full font-bold text-sm text-white transition-transform hover:-translate-y-0.5 bg-[#F05A89]">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = STATUS_MAP[order.status] || STATUS_MAP.pending;
            const StatusIcon = status.icon;
            
            return (
              <div key={order.id} className="bg-white rounded-2xl border p-5 sm:p-6 hover:shadow-md transition-shadow border-[#F8D7E3]">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-bold text-gray-800">{order.id}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      Dipesan {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: status.bg, color: status.text }}>
                    <StatusIcon size={12} strokeWidth={2.5} /> {status.label}
                  </span>
                </div>

                <div className="space-y-3 pb-4 mb-4 border-b border-dashed border-[#F8D7E3]">
                  {order.items.map((item: any, i: number) => {
                    const productName = item.variant?.product?.name || item.name || "Product";
                    return (
                      <div key={i} className="flex justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 leading-snug">
                          {productName} <span className="text-xs font-bold text-gray-400 ml-1">×{item.quantity}</span>
                        </p>
                        <p className="text-sm font-bold text-gray-700 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500">Total Belanja</span>
                    <p className="font-black text-lg text-[#F05A89] leading-none mt-0.5">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <Link href="/products" className="px-5 py-2 rounded-full text-xs font-bold border transition-all hover:bg-[#FDF2F5] border-[#F8D7E3] text-[#F05A89]">
                    Beli Lagi
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountPageWrapper>
  );
}