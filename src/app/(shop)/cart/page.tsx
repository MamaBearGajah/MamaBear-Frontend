"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { safeFormatPrice } from "@/lib/utils";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

const CartPage = () => {
  const { state, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const { items, subtotal, loading } = state;

  const discount = promoApplied ? subtotal * 0.15 : 0;
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const finalTotal = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MAMABEAR15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try MAMABEAR15");
    }
  };

  console.log("Cart items state:", items);

  if (!loading && items.length === 0) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{
          backgroundColor: "#FFF5F8",
          fontFamily: "'Urbanist', sans-serif",
        }}
      >
        <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-sm">
          <ShoppingBag
            size={70}
            className="mx-auto mb-5"
            style={{ color: "#D5557E" }}
          />
          <h1 className="mb-3 text-3xl font-black" style={{ color: "#6C4735" }}>
            Your Cart is Empty
          </h1>
          <p className="mb-6 text-sm" style={{ color: "#8B6352" }}>
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition hover:scale-105"
            style={{ backgroundColor: "#D5557E" }}
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{
        backgroundColor: "#FFF5F8",
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: "#8B6352" }}
        >
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#D5557E" }}>Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black" style={{ color: "#6C4735" }}>
            Shopping Cart 🛒
          </h1>
          <p className="text-sm" style={{ color: "#8B6352" }}>
            {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Feature badges */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: Truck, text: "Free shipping for orders > Rp 200K" },
            { icon: Shield, text: "Secure payment guaranteed" },
            { icon: RotateCcw, text: "7-day return & exchange" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 rounded-xl border bg-white p-3 text-xs"
              style={{ borderColor: "#FACBD8", color: "#8B6352" }}
            >
              <badge.icon
                size={16}
                style={{ color: "#D5557E" }}
                className="shrink-0"
              />
              {badge.text}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const price = item.discountPrice ?? item.basePrice;
              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-pink-100 bg-white p-5"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-pink-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h2
                            className="text-lg font-bold"
                            style={{ color: "#6C4735" }}
                          >
                            {item.name}
                          </h2>
                          {item.variantLabel && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.variantLabel}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            {item.discountPrice != null && (
                              <span
                                className="text-sm line-through"
                                style={{ color: "#B9998D" }}
                              >
                                {safeFormatPrice(item.basePrice)}
                              </span>
                            )}
                            <span
                              className="font-bold"
                              style={{ color: "#D5557E" }}
                            >
                              {safeFormatPrice(price)}
                            </span>
                          </div>
                        </div>
                        {/* FIX: pakai item.id bukan item.productId */}
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="rounded-full p-2 transition hover:bg-pink-50"
                        >
                          <Trash2 size={18} style={{ color: "#D5557E" }} />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-full border border-pink-200">
                          {/* FIX: pakai item.id bukan item.productId + variantId */}
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            className="flex h-10 w-10 items-center justify-center hover:bg-pink-50"
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-12 text-center font-bold">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            className="flex h-10 w-10 items-center justify-center hover:bg-pink-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div
                          className="text-lg font-black"
                          style={{ color: "#D5557E" }}
                        >
                          {safeFormatPrice(price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#D5557E" }}
            >
              Clear Cart
            </button>
          </div>

          {/* Order summary */}
          <div>
            <div className="sticky top-5 rounded-3xl border border-pink-100 bg-white p-6">
              <h2
                className="mb-5 text-2xl font-black"
                style={{ color: "#6C4735" }}
              >
                Order Summary
              </h2>

              {/* Promo */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={16}
                      className="absolute top-1/2 left-3 -translate-y-1/2"
                      style={{ color: "#D5557E" }}
                    />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full rounded-full border py-3 pr-4 pl-10 outline-none"
                      style={{ borderColor: "#FACBD8" }}
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="rounded-full px-5 font-bold text-white"
                    style={{ backgroundColor: "#D5557E" }}
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    Promo applied successfully 🎉
                  </p>
                )}
                {promoError && (
                  <p className="mt-2 text-sm text-red-500">{promoError}</p>
                )}
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>Subtotal</span>
                  <span className="font-bold">{safeFormatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>Discount</span>
                  <span className="font-bold text-green-600">
                    - {safeFormatPrice(discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? "FREE" : safeFormatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-pink-100 pt-4">
                  <span
                    className="text-lg font-black"
                    style={{ color: "#6C4735" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{ color: "#D5557E" }}
                  >
                    {safeFormatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout/info"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 font-black text-white transition hover:scale-[1.02]"
                style={{ backgroundColor: "#D5557E" }}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
