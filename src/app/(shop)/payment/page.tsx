"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PaymentSelector, { PaymentMethod } from "@/components/checkout/PaymentSelector";
import { useCheckout } from "@/context/CheckoutContext";
import QRCode from "react-qr-code";
import { safeFormatPrice } from "@/lib/utils";
import { placeShopOrder } from "@/lib/shop/place-order";

const DEV_FALLBACK_ORDER_ID = "ORD-2026-8921";

const PaymentPage = () => {
  const { state, clearCart } = useCart();
  const [paymentData, setPaymentData] = useState<any>(null);
  // const router = useRouter();
  const router = useRouter();
  const { state: checkoutState, setShipping, clearCheckout, subtotal } = useCheckout();
  const { items, method:shippingmethod } = checkoutState;
  console.log("items", items)

  console.log("checkoutState", checkoutState)

  console.log("shippingmethod", shippingmethod)

  const shippingCost = checkoutState.method?.cost ?? 0;

  console.log("shippingCost", shippingCost)


  // const [method, setMethod] = useState<PaymentMethod>("gopay");
  // const [gateway, setGateway] = useState<"xendit" | "midtrans">("xendit");
  const [method, setMethod] = useState<PaymentMethod>("gopay");
  const [gateway, setGateway] = useState<"xendit" | "midtrans">("xendit");
  const [loading, setLoading] = useState(false);

  // const discount = subtotal * 0.15;
  const discount = 0
  const shipping = shippingmethod?.cost ?? 0;
  const total = subtotal - discount + shipping;

const handlePayment = async () => {
  try {
    setLoading(true);

    const orderId = `ORD-${Date.now()}`;

    const response = await fetch("../lib/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        amount: total,
      }),
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }

    toast.error("Failed to get payment URL");
  } catch (error) {
    console.error(error);
    toast.error("Payment failed");
  } finally {
    setLoading(false);
  }
};

  // const handlePayment = async () => {
  //   setLoading(true);

  //   try {
  //     const result = await placeShopOrder({
  //       courier: "jne",
  //       service: "reg",
  //       provider: gateway,
  //     });

  //     clearCart();

  //     if (result.paymentUrl) {
  //       window.location.href = result.paymentUrl;
  //       return;
  //     }

  //     router.push(
  //       // `/order-success?orderId=${encodeURIComponent(result.orderId)}`,
  //       `/checkout/review`,
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     toast.info("Backend belum siap — menampilkan pesanan demo.");
  //     clearCart();
  //     router.push(
  //       `/order-success?orderId=${encodeURIComponent(DEV_FALLBACK_ORDER_ID)}`,
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // EMPTY CART GUARD
  if (items.length === 0) {
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

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      {
  paymentData?.payment_method?.qr_code?.qr_string && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-2xl">

        <h2 className="font-bold text-xl mb-4">
          Scan to Pay
        </h2>

        <QRCode
          value={
            paymentData.payment_method.qr_code.qr_string
          }
        />

        <p className="mt-4 text-center text-sm">
          Scan using GoPay, OVO, Dana,
          ShopeePay, Mobile Banking
        </p>
      </div>
    </div>
  )
}
      
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex transform flex-col items-center gap-3 rounded-lg bg-white/95 px-6 py-8 shadow-lg">
            {/* Loading state */}
            <svg className="h-10 w-10 animate-spin text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>

            <div className="text-center">
              <div className="text-lg font-semibold text-slate-900">Processing payment</div>
              <div className="text-sm text-slate-500">Please wait while we initiate your payment...</div>
            </div>
          </div>
        </div>
      )}
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

          <PaymentSelector selected={method} onSelect={setMethod} />

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Choose Integration Gateway</h3>
            <div className="grid grid-cols-2 gap-3">
              {(["xendit", "midtrans"] as const).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setGateway(provider)}
                  className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                    gateway === provider
                      ? "border-pink-600 bg-pink-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-pink-300"
                  }`}
                >
                  <div className="text-base font-semibold">{provider.toUpperCase()}</div>
                  <div className="text-xs text-slate-500">
                    {provider === "xendit"
                      ? "Xendit payment gateway"
                      : "Midtrans payment gateway"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
            <strong>{gateway.toUpperCase()} integration:</strong> use your backend to create a payment session for {method === "va" ? "Virtual Account" : method === "card" ? "Credit / Debit Card" : method.toUpperCase()}.
            For example, Xendit can create e-wallet charges, card payments, and VA invoices, while Midtrans can generate Snap tokens for GoPay, OVO, DANA, card checkout and bank transfer.
          </div>
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
                    {safeFormatPrice(price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
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
                {shipping === 0
                  ? "FREE"
                  : safeFormatPrice(shipping)}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{safeFormatPrice(total)}</span>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-3 bg-pink-600 text-white py-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>

                Processing payment...
              </>
            ) : (
              `Continue with ${method.toUpperCase()} via ${gateway.toUpperCase()}`
            )}
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