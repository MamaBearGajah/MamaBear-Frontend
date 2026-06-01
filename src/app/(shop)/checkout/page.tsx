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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-3">Your cart is empty</h1>
          <Link href="/products" className="text-pink-600 underline">
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT - FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
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
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              name="address"
              placeholder="Full Address"
              value={form.address}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl h-28"
            />
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {/* ITEMS */}
          <div className="space-y-3 mb-6">
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
          <div className="space-y-2 text-sm border-t pt-4">
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

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{safeFormatPrice(total)}</span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Link href="/payment" className="flex items-center gap-2">
              Proceed to Payment
              <CreditCard size={18} />
            </Link>
            {loading ? "Processing..." : "Place Order"}
          </button>

          {/* SHIPPING INFO */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <Truck size={14} />
            Estimated delivery: 2–4 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;