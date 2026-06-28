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
import { useAuth } from "../../../../context/AuthContext";
import { Card } from "../../../../components/ui/card";

interface UserAddress {
  id: string;
  userId: string;
  label: string;
  receiverName: string;
  phone: string;
  address: string;
  provinceId: string;
  cityId: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const CheckoutPageInfo = () => {
  const { state } = useCart();
  const { items } = state;
  const { state: checkoutState, setShipping, clearCheckout } = useCheckout();
  const router = useRouter();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [addressCitiesMap, setAddressCitiesMap] = useState<
    Record<number, string>
  >({});

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState(
    checkoutState?.shipping?.deliveryNotes ?? ""
  );
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    label: checkoutState?.shipping?.label ?? "",
    receiverName: checkoutState?.shipping?.receiverName ?? "",
    phone: checkoutState?.shipping?.phone ?? "",
    provinceId: checkoutState?.shipping?.provinceId ?? "",
    cityId: checkoutState?.shipping?.cityId ?? "",
    postalCode: checkoutState?.shipping?.postalCode ?? "",
    address: checkoutState?.shipping?.address ?? "",
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const provinceRes = await shippingApi.getProvinces();
        setProvinces(provinceRes.data.data);

        const res = await shippingApi.getUserAddress();
        const userAddresses: UserAddress[] = res.data.data;
        setAddresses(userAddresses);

        const defaultAddress = userAddresses.find((a) => a.isDefault);
        if (defaultAddress && !checkoutState?.shipping?.receiverName) {
          setSelectedAddress(defaultAddress);
          setForm((prev) => ({
            ...prev,
            receiverName: defaultAddress.receiverName,
            phone: defaultAddress.phone,
            provinceId: defaultAddress.provinceId.toString(),
            cityId: defaultAddress.cityId.toString(),
            postalCode: defaultAddress.postalCode,
            address: defaultAddress.address,
          }));
        }

        if (userAddresses.length === 0) {
          setShowNewAddressForm(true);
        }

        // Fetch cities for unique provinces to display in address cards
        const uniqueProvinceIds = Array.from(
          new Set(userAddresses.map((a) => a.provinceId))
        );
        const cityMap: Record<number, string> = {};

        await Promise.all(
          uniqueProvinceIds.map(async (provinceId) => {
            try {
              const cityRes = await shippingApi.getCities(provinceId);
              const provinceCities: City[] = cityRes.data.data;
              provinceCities.forEach((city) => {
                cityMap[city.id] = city.name;
              });
            } catch (error) {
              console.error(
                `Failed to fetch cities for province ${provinceId}`,
                error
              );
            }
          })
        );

        setAddressCitiesMap(cityMap);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!form.provinceId) return;
    async function fetchCity() {
      const res = await shippingApi.getCities(form.provinceId);
      setCities(res.data.data);
    }
    fetchCity();
  }, [form.provinceId, provinces]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddress(address);
    setShowNewAddressForm(false);
    setForm((prev) => ({
      ...prev,
      label: address.label,
      receiverName: address.receiverName,
      phone: address.phone,
      provinceId: address.provinceId.toString(),
      cityId: address.cityId.toString(),
      postalCode: address.postalCode,
      address: address.address,
    }));
    setErrors({});
  };

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddress(null);
    setForm((prev) => ({
      ...prev,
      receiverName: "",
      phone: "",
      provinceId: "",
      cityId: "",
      postalCode: "",
      address: "",
    }));
    setErrors({});
  };

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
  // BACK BUTTON TO CART
  // =========================
  useEffect(() => {
    const handlePopState = () => {
      clearCheckout();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearCheckout]);

  // =========================
  // PLACE ORDER
  // =========================

  const handleContinue = async (
    e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent,
    notes?: string
  ) => {
    if (e) e.preventDefault();

    const {
      receiverName,
      phone,
      provinceId,
      cityId,
      postalCode,
      address,
      label,
    } = form;

    const newErrors: Record<string, string> = {};
    if (!label) newErrors.label = "Address Label is required";
    if (!receiverName) newErrors.receiverName = "Full Name is required";
    if (!phone) newErrors.phone = "Phone Number is required";
    if (!provinceId) newErrors.provinceId = "Province is required";
    if (!cityId) newErrors.cityId = "City is required";
    if (!postalCode) newErrors.postalCode = "Zip Code is required";
    if (!address) newErrors.address = "Full Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setErrors({});

    if (showNewAddressForm) {
      try {
        await shippingApi.addNewAddress({
          ...form,
          label: form.label, // Passed via the button group
        });
      } catch (error) {
        console.error("Failed to save new address:", error);
        // Continue anyway or return? Usually better to just continue.
      }
    }

    setShipping({ ...form, deliveryNotes: notes });
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

            {loading ? (
              <div className="mb-4">
                <label className="text-sm font-medium">
                  Select Saved Address
                </label>
                <div className="mt-2 space-y-2">
                  {[1, 2].map((i) => (
                    <Card key={i} className="mb-2 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200" />
                        <div className="w-full space-y-3">
                          <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-2/5 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : addresses.length > 0 ? (
              <div className="mb-4">
                <label className="text-sm font-medium">
                  Select Saved Address
                </label>
                <ul className="mt-2">
                  {addresses.map((address: UserAddress) => (
                    <li key={address.id}>
                      <Card
                        className={`mb-2 cursor-pointer transition-colors hover:border-pink-300 ${
                          selectedAddress?.id === address.id
                            ? "border-pink-500 bg-pink-50/50 ring-1 ring-pink-500"
                            : ""
                        }`}
                        onClick={() => handleSelectAddress(address)}
                      >
                        <div className="flex items-start gap-3 p-4">
                          <div className="mt-1 flex h-5 items-center">
                            <input
                              type="checkbox"
                              checked={selectedAddress?.id === address.id}
                              onChange={() => handleSelectAddress(address)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-semibold">
                                {address.label}
                              </p>
                              {address.isDefault && (
                                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-1 font-medium text-gray-900">
                              {address.receiverName}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {address.phone}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {address.address}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {
                                provinces.find(
                                  (p: Province) =>
                                    p.id === Number(address.provinceId)
                                )?.name
                              }
                              , {addressCitiesMap[Number(address.cityId)]},{" "}
                              {address.postalCode}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>
            ) : null}

            {!showNewAddressForm && !loading && (
              <button
                type="button"
                onClick={handleAddNewAddress}
                className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-pink-300 p-4 font-medium text-pink-600 transition-colors hover:bg-pink-50"
              >
                + Add New Address
              </button>
            )}

            {showNewAddressForm && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h2 className="mb-2 text-lg font-semibold">
                    {addresses.length > 0 ? "Alamat Baru" : "Detail Pengiriman"}
                  </h2>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Alamat Label</label>
                  <div className="mt-2 flex gap-3">
                    {["Rumah", "Kantor", "Lainnya"].map((labelType) => (
                      <button
                        key={labelType}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, label: labelType }))
                        }
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          form.label === labelType
                            ? "border-pink-600 bg-pink-50 text-pink-600 ring-1 ring-pink-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {labelType}
                      </button>
                    ))}
                  </div>
                  {errors.label && (
                    <p className="mt-1 text-xs text-red-500">{errors.label}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    required
                    name="receiverName"
                    placeholder="Full Name"
                    value={form.receiverName}
                    onChange={handleChange}
                    className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.receiverName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                  />
                  {errors.receiverName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
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
                    name="provinceId"
                    id="province"
                    className={`w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.provinceId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                    value={form.provinceId}
                    onChange={handleChange}
                  >
                    <option value="">Select Province</option>
                    {provinces.map((province: Province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.province}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <select
                    required
                    name="cityId"
                    id="cityId"
                    className={` ${
                      form.provinceId === "" ? "bg-gray-100 text-gray-500" : ""
                    } w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.cityId ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                    value={form.cityId}
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
                    name="address"
                    placeholder="Full Address"
                    className={`h-28 w-full rounded-xl border p-3 focus:ring-1 focus:outline-none ${errors.address ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "focus:border-pink-600 focus:ring-pink-600"}`}
                    value={form.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="deliveryNotes" className="text-sm font-medium">
                  Note (Optional)
                </label>
                <input
                  name="deliveryNotes"
                  id="deliveryNotes"
                  placeholder="Note"
                  className="w-full rounded-xl border p-3"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  onClick={(e) => handleContinue(e, deliveryNotes)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--mamabear-dark-pink)] py-3 font-bold text-white"
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
