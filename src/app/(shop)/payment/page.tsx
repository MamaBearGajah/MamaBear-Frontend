"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { CreditCard, Wallet, ArrowLeft, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const { state, clearCart } = useCart();
  const { items, subtotal } = state;

  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const discount = subtotal * 0.15;
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  const handlePayment = async () => {
    setLoading(true);

    try {
      // simulate payment processing
      await new Promise((res) => setTimeout(res, 2000));

      setPaid(true);
      clearCart();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // EMPTY CART GUARD
  if (items.length === 0 && !paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-3">No items to pay</h1>
          <Link href="/products" className="text-pink-600 underline">
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={50} />

          <h1 className="text-2xl font-bold mb-2">
            Payment Successful 🎉
          </h1>

          <p className="text-gray-500 mb-6">
            Your order has been confirmed
          </p>

          <Link
            href="/products"
            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT - PAYMENT METHOD */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/checkout" className="text-pink-600">
              <ArrowLeft size={18} />
            </Link>

            <h1 className="text-2xl font-bold">Payment</h1>
          </div>

          <h2 className="font-semibold mb-4">Choose Payment Method</h2>

          <div className="space-y-3">
            {/* CARD */}
            <button
              onClick={() => setMethod("card")}
              className={`w-full flex items-center gap-3 p-4 border rounded-xl ${
                method === "card" ? "border-pink-600 bg-pink-50" : ""
              }`}
            >
              <CreditCard />
              Credit / Debit Card
            </button>

            {/* E-WALLET */}
            <button
              onClick={() => setMethod("ewallet")}
              className={`w-full flex items-center gap-3 p-4 border rounded-xl ${
                method === "ewallet" ? "border-pink-600 bg-pink-50" : ""
              }`}
            >
              <Wallet />
              E-Wallet (GrabPay / PayNow / ShopeePay)
            </button>
          </div>

          {/* MOCK CARD INPUT */}
          {method === "card" && (
            <div className="mt-6 space-y-3">
              <input
                placeholder="Card Number"
                className="w-full border p-3 rounded-xl"
              />
              <div className="flex gap-3">
                <input
                  placeholder="MM/YY"
                  className="w-full border p-3 rounded-xl"
                />
                <input
                  placeholder="CVV"
                  className="w-full border p-3 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* E-WALLET MOCK */}
          {method === "ewallet" && (
            <div className="mt-6 text-sm text-gray-500">
              You will be redirected to your selected wallet provider.
            </div>
          )}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm mb-6">
            {items.map((item) => {
              const price = item.discountPrice ?? item.basePrice;

              return (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    Rp {(price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- Rp {discount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? "FREE"
                  : `Rp ${shipping.toLocaleString()}`}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-pink-600 text-white py-3 rounded-xl font-bold"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Secure payment simulation page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;