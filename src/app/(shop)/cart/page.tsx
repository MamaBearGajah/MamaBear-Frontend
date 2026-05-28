"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCart";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById } from "../../../lib/api/products";

const mockItems = [
  {
    id: "1",
    name: "ASI Booster Tea – Lychee Milk Tea",
    variant: "Flavor: Hazelnut Milk Tea",
    meta: "150g (15 sachets)",
    imageUrl:
      "https://images.unsplash.com/photo-1604908177522-97e3f9f0f6b8?w=400&q=60",
    unitPrice: 65000,
    qty: 1,
  },
  {
    id: "2",
    name: "ASI Booster Tea – Thai Milk Tea",
    variant: "Flavor: Hazelnut Milk Tea",
    meta: "150g (15 sachets)",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=60",
    unitPrice: 65000,
    qty: 1,
  },
  {
    id: "3",
    name: "ASI Booster Capsules – Regular",
    variant: "Flavor: Regular",
    meta: "60 capsules",
    imageUrl:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=60",
    unitPrice: 120000,
    qty: 1,
  },
];

type CartRow = {
  id: string;
  name: string;
  variant?: string;
  meta?: string;
  imageUrl?: string;
  unitPrice?: number;
  qty?: number;
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addId = searchParams.get("add");
  const [items, setItems] = useState<CartRow[]>(mockItems);
  const [hasLoadedAdd, setHasLoadedAdd] = useState(false);

  useEffect(() => {
    if (!addId || hasLoadedAdd) return;

    let canceled = false;

    const loadProduct = async () => {
      try {
        const product = await getProductById(addId);
        if (canceled) return;

        const imageUrl =
          product.images?.find((image) => image.isFeatured)?.imageUrl ??
          product.images?.[0]?.imageUrl ??
          "";

        const nextItem: CartRow = {
          id: product.id,
          name: product.name,
          variant: product.categoryId
            ? `Category: ${product.categoryId}`
            : undefined,
          meta: product.weight ? `${product.weight}g` : undefined,
          imageUrl,
          unitPrice: Number(product.discountPrice ?? product.basePrice),
          qty: 1,
        };

        setItems((prev) => {
          const existing = prev.find((item) => item.id === nextItem.id);
          if (existing) {
            return prev.map((item) =>
              item.id === nextItem.id
                ? { ...item, qty: (item.qty ?? 1) + 1 }
                : item
            );
          }
          return [nextItem, ...prev];
        });

        setHasLoadedAdd(true);
        router.replace("/cart");
      } catch {
        setHasLoadedAdd(true);
      }
    };

    void loadProduct();

    return () => {
      canceled = true;
    };
  }, [addId, hasLoadedAdd, router]);

  const handleChangeQty = (id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = items.reduce(
    (s, it) => s + (it.unitPrice || 0) * (it.qty || 1),
    0
  );

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + (item.qty ?? 1), 0),
    [items]
  );

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "#FEF2F5" }}
    >
      <div className="w-full px-[1cm] py-8">
        <div className="mb-6 flex items-end gap-3">
          <h1 className="flex items-center gap-3 font-['Quicksand'] text-2xl leading-none font-bold text-[#6C4735] md:text-3xl">
            Shopping Cart
            <img
              src="/cart.svg"
              alt="Cart"
              className="h-[1.05em] w-auto shrink-0"
            />
          </h1>
        </div>
        <p className="mb-8 text-sm text-[#B88A9A]">
          {itemCount} items in your cart
        </p>

        {items.length === 0 ? (
          // Empty cart view
          <div className="px-6">
            {/* Lazy-load small EmptyCart UI component */}
            <React.Suspense>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <EmptyCart />
            </React.Suspense>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <section className="overflow-hidden rounded-[24px] border border-[#F6B8CB] bg-white">
              <div className="flex items-center justify-between border-b border-[#F6B8CB] px-6 py-4">
                <h2 className="text-[15px] font-bold text-[#6C4735]">
                  Products
                </h2>
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#FF6B6B]"
                >
                  <Trash2 className="size-4" />
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-[#F6B8CB] px-6">
                {items.map((it) => (
                  <CartItem
                    key={it.id}
                    item={it}
                    onChangeQty={(newQty) => handleChangeQty(it.id, newQty)}
                    onRemove={() => handleRemove(it.id)}
                  />
                ))}
              </div>
            </section>

            <div className="lg:pt-[2px]">
              <CartSummary subtotal={subtotal} itemCount={itemCount} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
