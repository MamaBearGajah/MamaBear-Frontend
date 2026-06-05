"use client";

import Link from "next/link";
import React, { useState } from "react";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCart";
import { useCart } from "@/hooks/useCart";
import { safeFormatPrice } from "@/lib/utils";
import {
  ArrowRight,
  ArrowLeft,
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

  if (!loading && items.length === 0) {
    return <EmptyCart />;
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
            <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4">
                <h2 className="text-[15px] font-bold text-[#6C4735]">
                  Products
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D5557E] transition hover:opacity-80"
                >
                  <span className="text-base leading-none">🗑</span>
                  Clear Cart
                </button>
              </div>

              <div className="px-5">
                {items.map((item) => {
                  return (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() =>
                        removeItem(item.productId, item.variantId)
                      }
                      onChangeQty={(qty: number) =>
                        updateQuantity(item.productId, item.variantId, qty)
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="px-1 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#D5557E] transition hover:underline"
              >
                <ArrowLeft size={16} />
                Lanjut Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <CartSummary
              subtotal={subtotal}
              itemCount={itemCount}
              discount={discount}
              shipping={shipping}
              finalTotal={finalTotal}
              promoCode={promoCode}
              promoApplied={promoApplied}
              promoError={promoError}
              onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
