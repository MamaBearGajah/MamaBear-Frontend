"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { safeFormatPrice } from "@/lib/utils";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OrderSummary from "../../../../components/checkout/OrderSummary";
import { shippingApi } from "../../../../lib/api/shipping";

const CheckoutPageInfo = () => {
  const { state, clearCart } = useCart();
  const { items, subtotal } = state;
  const { state: checkoutState, setShipping, nextStep } = useCheckout();
  const router = useRouter();

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: checkoutState?.shipping?.fullName ?? "",
    phone: checkoutState?.shipping?.phone ?? "",
    province: checkoutState?.shipping?.province ?? "",
    city: checkoutState?.shipping?.city ?? "",
    postalCode: checkoutState?.shipping?.postalCode ?? "",
    streetAddress: checkoutState?.shipping?.streetAddress ?? "",
    deliveryNotes: checkoutState?.shipping?.deliveryNotes ?? null,
  });

  useEffect(() => {
    async function fetchProvince() {
      const res = await shippingApi.getProvinces();
      setProvinces(res.data.data);
    }
    fetchProvince();
  }, []);

  useEffect(() => {
    if (!form.province) return;
    async function fetchCity() {
      const res = await shippingApi.getCities(form.province);
      setCities(res.data.data);
    }
    fetchCity();
  }, [form.province]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handleContinue = (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent
  ) => {
    if (e) e.preventDefault();

    const { fullName, phone, province, city, postalCode, streetAddress } = form;

    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = "Full Name is required";
    if (!phone) newErrors.phone = "Phone Number is required";
    if (!province) newErrors.province = "Province is required";
    if (!city) newErrors.city = "City is required";
    if (!postalCode) newErrors.postalCode = "Zip Code is required";
    if (!streetAddress) newErrors.streetAddress = "Full Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});
    console.log(form);
    setShipping(form);
    nextStep();
    router.push("/checkout/method");
  };

  // =========================
  // EMPTY CART GUARD
  // =========================

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="max-w-4xl rounded-2xl bg-white text-center shadow-sm">
          <h1 className="mb-3 p-6 text-xl font-bold">Your cart is empty</h1>
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
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT - FORM */}
          <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Link href="/cart" className="text-pink-600">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold">Shipping Information</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  required
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <input
                  required
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="province" className="text-sm font-medium">
                  Province
                </label>
                <select
                  required
                  name="province"
                  id="province"
                  className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.province ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                  value={form.province}
                  onChange={handleChange}
                >
                  <option value="">Select Province</option>
                  {provinces.map((province: any) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="mt-1 text-xs text-red-500">{errors.province}</p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <select
                  required
                  name="city"
                  id="city"
                  className={` ${
                    form.province === "" ? "bg-gray-100 text-gray-500" : ""
                  } w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.city ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                  value={form.city}
                  onChange={handleChange}
                >
                  <option value="">Select City</option>
                  {cities.map((city: any) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="zip" className="text-sm font-medium">
                  Zip Code
                </label>
                <input
                  required
                  name="postalCode"
                  placeholder="Zip Code"
                  className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.postalCode ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                  value={form.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.postalCode}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Full Address
                </label>
                <textarea
                  required
                  name="streetAddress"
                  placeholder="Full Address"
                  className={`h-28 w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.streetAddress ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                  value={form.streetAddress}
                  onChange={handleChange}
                />
                {errors.streetAddress && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.streetAddress}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label htmlFor="deliveryNotes" className="text-sm font-medium">
                  Note (Optional)
                </label>
                <input
                  name="deliveryNotes"
                  id="deliveryNotes"
                  placeholder="Note"
                  className="w-full rounded-xl border p-3"
                  value={form.deliveryNotes || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  onClick={handleContinue}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 font-bold text-white"
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

export default CheckoutPageInfo;
