"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { safeFormatPrice } from "@/lib/utils";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const { items, subtotal } = state;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  // =========================
  // CALCULATIONS
  // =========================

  const discount = subtotal * 0.15; // example promo logic
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // simulate API call
      await new Promise((res) => setTimeout(res, 1500));

      alert("Order placed successfully 🎉");

      clearCart();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART GUARD
  // =========================

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="mb-3 text-xl font-bold">Your cart is empty</h1>
          <Link href="/products" className="text-pink-600 underline">
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT - FORM */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Link href="/cart" className="text-pink-600">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold">Checkout</h1>
            </div>

            <div className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />

              <textarea
                name="address"
                placeholder="Full Address"
                value={form.address}
                onChange={handleChange}
                className="h-28 w-full rounded-xl border p-3"
              />
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            {/* ITEMS */}
            <div className="mb-6 space-y-3">
              {items.map((item) => {
                const price = item.discountPrice ?? item.basePrice;

                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span className="font-semibold">
                      {safeFormatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* COSTS */}
            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{safeFormatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {safeFormatPrice(discount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : safeFormatPrice(shipping)}
                </span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>{safeFormatPrice(total)}</span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 font-bold text-white"
            >
              <Link href="/payment" className="flex items-center gap-2">
                Proceed to Payment
                <CreditCard size={18} />
              </Link>
              {loading ? "Processing..." : "Place Order"}
            </button>

            {/* SHIPPING INFO */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Truck size={14} />
              Estimated delivery: 2–4 days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
