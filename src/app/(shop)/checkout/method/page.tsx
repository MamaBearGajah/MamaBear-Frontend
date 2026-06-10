"use client";

import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { shippingApi } from "../../../../lib/api/shipping";
import { useCart } from "../../../../context/CartContext";

interface Shipping {
  courier: string;
  service: string;
  cost: number;
  etd: string;
}

const CheckoutPageMethod = () => {
  const router = useRouter();
  const { state: cartState } = useCart();
  const {
    state: checkoutState,
    prevStep,
    nextStep,
    setMethod,
    clearCheckout,
  } = useCheckout();
  const ORIGIN_CITY_ID = "577";

  const [shippingOptions, setShippingOptions] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!checkoutState.shipping?.cityId) {
      toast.error("Please provide shipping information first");
      router.replace("/checkout/info");
      setLoading(false);
      return;
    }

    async function fetchShippingCost() {
      setLoading(true);
      try {
        const jneRes = await shippingApi.calculateShipping({
          originCityId: ORIGIN_CITY_ID,
          destinationCityId: checkoutState.shipping!.cityId,
          weight: 100,
          courier: "jne",
        });
        const jntRes = await shippingApi.calculateShipping({
          originCityId: ORIGIN_CITY_ID,
          destinationCityId: checkoutState.shipping!.cityId,
          weight: 100,
          courier: "jnt",
        });
        const posRes = await shippingApi.calculateShipping({
          originCityId: ORIGIN_CITY_ID,
          destinationCityId: checkoutState.shipping!.cityId,
          weight: 100,
          courier: "pos",
        });
        const jneShipping = jneRes.data.data.map((item: Partial<Shipping>) => {
          return {
            courier: "jne",
            service: item.service,
            cost: item.cost,
            etd: item.etd,
          };
        });
        const jntShipping = jntRes.data.data.map((item: Partial<Shipping>) => {
          return {
            courier: "jnt",
            service: item.service,
            cost: item.cost,
            etd: item.etd,
          };
        });
        const posShipping = posRes.data.data.map((item: Partial<Shipping>) => {
          return {
            courier: "pos",
            service: item.service,
            cost: item.cost,
            etd: item.etd,
          };
        });
        setShippingOptions([...jneShipping, ...jntShipping, ...posShipping]);
      } catch (error) {
        console.error("Failed to fetch shipping options", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShippingCost();
  }, [checkoutState.shipping?.cityId]);

  const handleBack = () => {
    prevStep();
    router.push("/checkout/info");
  };

  const handleContinue = () => {
    if (!selectedShipping) {
      setError(true);
      toast.error("Please select a shipping method");
      return;
    }
    setError(false);
    console.log(checkoutState);
    // nextStep();
    // clearCheckout();
    // router.push("/checkout/review");
    // router.push("/payment");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value);
    setSelectedShipping(value);
    setMethod(value); // Update context synchronously for the Order Summary
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
              Shipping To: {checkoutState.shipping?.address}
            </p>
            {error && (
              <p className="mb-4 text-sm font-medium text-red-500">
                Please select a shipping method to continue.
              </p>
            )}
            <div className="mt-2 space-y-5">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border-2 border-gray-200 p-4"
                    >
                      <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
                        </div>
                        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </>
              ) : shippingOptions.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No shipping options available for this address.
                </p>
              ) : (
                shippingOptions.map((option, index) => (
                  <label
                    key={`${option.courier}-${option.service}-${index}`}
                    className={`flex cursor-pointer items-center gap-2 border-2 p-4 transition-colors hover:border-pink-300 ${
                      selectedShipping?.courier === option.courier &&
                      selectedShipping?.service === option.service
                        ? "border-pink-500 bg-pink-50/50 ring-1 ring-pink-500"
                        : "border-gray-200"
                    }`}
                    htmlFor={`${option.courier}-${option.service}`}
                  >
                    <input
                      checked={
                        selectedShipping?.courier === option.courier &&
                        selectedShipping?.service === option.service
                      }
                      id={`${option.courier}-${option.service}`}
                      type="radio"
                      name="courier"
                      onChange={handleOnChange}
                      className="h-4 w-4 cursor-pointer text-pink-600 focus:ring-pink-600"
                      value={JSON.stringify(option)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 uppercase">
                          {option.courier} - {option.service}
                        </span>
                        <span className="font-bold text-pink-600">
                          Rp {option.cost.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {option.etd
                          ? `${option.etd} days`
                          : "Estimation not available"}
                      </p>
                    </div>
                  </label>
                ))
              )}
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
