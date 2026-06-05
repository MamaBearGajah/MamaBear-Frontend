"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { safeFormatPrice } from "@/lib/utils";
import { ChevronLeft, ClipboardList, Info, Lock } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OrderSummary from "@/components/checkout/OrderSummary";

const CheckoutPageReview = () => {
  const { state: checkoutState, prevStep, clearCheckout } = useCheckout();
  const { method, shipping } = checkoutState;
  const { state: cartState } = useCart();
  const { items } = cartState;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showSuccessOrder, setShowSuccessOrder] = useState(false);

  const handlePlaceOrder = () => {
    if (!agreed) {
      setShowWarning(true);
      return;
    }
    setLoading(true);
    // Simulate API call
    // setTimeout(() => {
    //   setLoading(false);
    //   toast.success("Order placed successfully");
    //   router.push("/checkout/success");
    // }, 1000);
    setLoading(false);
    setShowSuccessOrder(true);
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  const calculateSubtotal = () =>
    items.reduce(
      (sum, item) =>
        sum + (item.discountPrice ?? item.basePrice) * item.quantity,
      0
    );
  const total = calculateSubtotal() + (method?.cost ?? 9000);

  return (
    <div className="min-h-screen bg-[#fff0f3] px-4 py-10 text-gray-800">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT - FORM */}
          <div className="col-span-2 flex flex-col gap-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList size={22} className="text-pink-600" />
              <h1 className="text-xl font-bold text-gray-800">Order Review</h1>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="flex flex-col gap-2 rounded-xl border border-pink-100 bg-[#fff5f7] p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  Shipping Address
                </span>
              </div>
              <div className="flex flex-col text-sm text-gray-600">
                <span className="font-medium">
                  {shipping?.fullName || "No Full Name"}
                </span>
                <span>{shipping?.phone || "No Phone Number"}</span>
                <span>{shipping?.streetAddress || "No Street Address"}</span>
                <span>{shipping?.deliveryNotes || "No Delivery notes"}</span>
              </div>
            </div>

            {/* SHIPPING */}
            <div className="flex flex-col gap-2 rounded-xl border border-pink-100 bg-[#fff5f7] p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-gray-800">Shipping</span>
              </div>
              <div className="flex flex-col text-sm text-gray-600">
                <span>{method?.courier || "POS Indonesia"}</span>
                <span>{method?.estimatedDays || "4-6 days"}</span>
                <span className="mt-1 font-medium text-pink-600">
                  {method?.cost ? safeFormatPrice(method.cost) : "Rp 9.000"}
                </span>
              </div>
            </div>

            {/* TERMS & CONDITIONS */}
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) setShowWarning(false);
                  }}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-700 accent-[#555]"
                />
                <span className="leading-snug">
                  I agree to Mamabear's{" "}
                  <Link href="/terms" className="text-pink-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-pink-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  . I confirm my order details are correct.
                </span>
              </label>
              {showWarning && (
                <div className="ml-6 flex items-center gap-1 text-xs text-orange-500">
                  <Info size={14} />
                  <span>Please agree to the terms to place your order</span>
                </div>
              )}
            </div>

            <hr className="my-2 border-gray-100" />

            {/* ACTION BUTTONS */}
            <div className="flex w-full gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 rounded-full border border-pink-200 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-pink-50"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading || !agreed}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-colors ${
                  agreed
                    ? "cursor-pointer bg-[#6c757d] hover:bg-gray-600"
                    : "cursor-not-allowed bg-[#ced4da]"
                }`}
              >
                <Lock size={14} />
                {loading
                  ? "Processing..."
                  : `Place Order — ${safeFormatPrice(total)}`}
              </button>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <OrderSummary />
          {/* Temporary Modal Success Order */}
          <dialog
            id="success-order"
            className={`fixed inset-0 z-50 h-full w-full bg-black/60 transition-opacity duration-300 ${
              showSuccessOrder
                ? "flex items-center justify-center opacity-100"
                : "hidden opacity-0"
            }`}
          >
            <div className="modal-box max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff5f7]">
                <svg
                  className="h-10 w-10 text-pink-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800">
                Success!
              </h3>
              <p className="text-sm text-gray-600">
                Your order has been placed successfully. Thank you for shopping
                with us!
              </p>
              <div className="modal-action mt-8 flex justify-center">
                <form method="dialog" className="w-full">
                  <button
                    onClick={() => {
                      router.push("/products");
                      clearCheckout();
                    }}
                    className="w-full rounded-full bg-pink-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-pink-700"
                  >
                    Continue Shopping
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageReview;
