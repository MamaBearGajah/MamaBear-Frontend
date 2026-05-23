"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
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
  const {
    state,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const { items, subtotal, guestCartId, loading } = state;

  // =========================
  // CALCULATIONS
  // =========================

  const discount = promoApplied ? subtotal * 0.15 : 0;

  const shipping = subtotal >= 200000 ? 0 : 15000;

  const finalTotal = subtotal - discount + shipping;

  // =========================
  // HELPERS
  // =========================

  const getPrice = (item: {
    basePrice: number;
    discountPrice?: number;
  }) => {
    return item.discountPrice ?? item.basePrice;
  };

  // =========================
  // PROMO
  // =========================

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MAMABEAR15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid promo code. Try MAMABEAR15");
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (!loading && items.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundColor: "#FFF5F8",
          fontFamily: "'Urbanist', sans-serif",
        }}
      >
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-sm border border-pink-100">
          <ShoppingBag
            size={70}
            className="mx-auto mb-5"
            style={{ color: "#D5557E" }}
          />

          <h1
            className="text-3xl font-black mb-3"
            style={{ color: "#6C4735" }}
          >
            Your Cart is Empty
          </h1>

          <p className="text-sm mb-6" style={{ color: "#8B6352" }}>
            Looks like you haven’t added anything yet.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
            style={{ backgroundColor: "#D5557E" }}
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: "#FFF5F8",
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-xs mb-6"
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
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: "#6C4735" }}
          >
            Shopping Cart 🛒
          </h1>

          <p className="text-sm" style={{ color: "#8B6352" }}>
            {itemCount} item{itemCount > 1 ? "s" : ""} in your cart
          </p>

          {guestCartId && (
            <p
              className="text-xs mt-2 px-3 py-1 inline-block rounded-full bg-pink-100"
              style={{ color: "#D5557E" }}
            >
              Guest Cart ID: {guestCartId}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-3 mb-8">
          {[
            {
              icon: Truck,
              text: "Free shipping for orders > Rp 200K",
            },
            {
              icon: Shield,
              text: "Secure payment guaranteed",
            },
            {
              icon: RotateCcw,
              text: "7-day return & exchange",
            },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white border text-xs"
              style={{
                borderColor: "#FACBD8",
                color: "#8B6352",
              }}
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

        {/* MAIN */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = getPrice(item);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-pink-100"
                >
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-pink-50 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                      <div className="flex justify-between gap-3">
                        <div>
                          <h2
                            className="font-bold text-lg"
                            style={{ color: "#6C4735" }}
                          >
                            {item.name}
                          </h2>

                          <div className="flex items-center gap-2 mt-1">
                            {item.discountPrice && (
                              <span
                                className="text-sm line-through"
                                style={{ color: "#B9998D" }}
                              >
                                Rp {item.basePrice.toLocaleString()}
                              </span>
                            )}

                            <span
                              className="font-bold"
                              style={{ color: "#D5557E" }}
                            >
                              Rp {price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 rounded-full hover:bg-pink-50 transition"
                        >
                          <Trash2
                            size={18}
                            style={{ color: "#D5557E" }}
                          />
                        </button>
                      </div>

                      {/* QUANTITY */}
                      <div className="flex items-center justify-between mt-5">
                        <div className="flex items-center border rounded-full overflow-hidden border-pink-200">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-pink-50"
                          >
                            <Minus size={16} />
                          </button>

                          <div className="w-12 text-center font-bold">
                            {item.quantity}
                          </div>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-pink-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* TOTAL */}
                        <div
                          className="font-black text-lg"
                          style={{ color: "#D5557E" }}
                        >
                          Rp {(price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* CLEAR CART */}
            <button
              onClick={clearCart}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#D5557E" }}
            >
              Clear Cart
            </button>
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-pink-100 sticky top-5">
              <h2
                className="text-2xl font-black mb-5"
                style={{ color: "#6C4735" }}
              >
                Order Summary
              </h2>

              {/* PROMO */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#D5557E" }}
                    />

                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-full border outline-none"
                      style={{
                        borderColor: "#FACBD8",
                      }}
                    />
                  </div>

                  <button
                    onClick={handleApplyPromo}
                    className="px-5 rounded-full font-bold text-white"
                    style={{ backgroundColor: "#D5557E" }}
                  >
                    Apply
                  </button>
                </div>

                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    Promo applied successfully 🎉
                  </p>
                )}

                {promoError && (
                  <p className="text-red-500 text-sm mt-2">
                    {promoError}
                  </p>
                )}
              </div>

              {/* SUMMARY */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>
                    Subtotal
                  </span>

                  <span className="font-bold">
                    Rp {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>
                    Discount
                  </span>

                  <span className="font-bold text-green-600">
                    - Rp {discount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span style={{ color: "#8B6352" }}>
                    Shipping
                  </span>

                  <span className="font-bold">
                    {shipping === 0
                      ? "FREE"
                      : `Rp ${shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="border-t border-pink-100 pt-4 flex justify-between">
                  <span
                    className="font-black text-lg"
                    style={{ color: "#6C4735" }}
                  >
                    Total
                  </span>

                  <span
                    className="font-black text-2xl"
                    style={{ color: "#D5557E" }}
                  >
                    Rp {finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CHECKOUT */}
              <button
                className="w-full mt-6 py-4 rounded-full font-black text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                style={{ backgroundColor: "#D5557E" }}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;