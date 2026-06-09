"use client";

import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CheckoutPageMethod = () => {
  const router = useRouter();
  const { state: checkoutState, prevStep, nextStep, setMethod, clearCheckout } = useCheckout();

  const [shipping, setShipping] = useState({
    courier: checkoutState?.method?.courier ?? "",
    service: checkoutState?.method?.service ?? "",
    cost: checkoutState?.method?.cost ?? 0,
    estimatedDays: checkoutState?.method?.estimatedDays ?? "",
  });

  const [error, setError] = useState(false);

  const handleBack = () => {
    prevStep();
    router.push("/checkout/info");
  };

  const handleContinue = () => {
    if (!shipping.courier) {
      setError(true);
      toast.error("Please select a shipping method");
      return;
    }
    setError(false);
    setMethod(shipping);
    nextStep();
    // router.push("/checkout/review");
    router.push("/payment");
  };



  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value);
    setShipping(value);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT - FORM */}
          <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Truck size={24} className="text-pink-600" />
              <h1 className="text-2xl font-bold">Shipping Method </h1>
            </div>
            <p className="mb-2 text-sm text-gray-600">
              Shipping To: {checkoutState.shipping?.streetAddress}
            </p>
            {error && (
              <p className="mb-4 text-sm font-medium text-red-500">
                Please select a shipping method to continue.
              </p>
            )}
            <div className="mt-2 space-y-5">
              <label
                className="flex cursor-pointer items-center gap-2 border-2 p-4"
                htmlFor="jne"
              >
                <input
                  checked={shipping.courier === "JNE"}
                  id="jne"
                  type="radio"
                  name="courier"
                  onChange={handleOnChange}
                  value={JSON.stringify({
                    courier: "JNE",
                    service: "REG",
                    cost: 15000,
                    estimatedDays: "2-3 days",
                  })}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>JNE</span> <span>15000</span>
                  </div>
                  <p className="text-sm text-gray-600">2-3 days</p>
                </div>
              </label>
              <label
                className="flex cursor-pointer items-center gap-2 border-2 p-4"
                htmlFor="sicepat"
              >
                <input
                  checked={shipping.courier === "SiCepat"}
                  id="sicepat"
                  type="radio"
                  name="courier"
                  onChange={handleOnChange}
                  value={JSON.stringify({
                    courier: "SiCepat",
                    service: "REG",
                    cost: 12000,
                    estimatedDays: "2-3 days",
                  })}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>SiCepat</span> <span>12000</span>
                  </div>
                  <p className="text-sm text-gray-600">2-3 days</p>
                </div>
              </label>
              <div className="mt-5 flex w-full justify-between gap-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-[25%] cursor-pointer rounded-xl border border-gray-300 px-4 py-2 hover:bg-pink-50"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="w-[75%] cursor-pointer rounded-xl bg-[var(--mamabear-dark-pink)] px-4 py-2 text-white hover:bg-pink-700"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageMethod;
