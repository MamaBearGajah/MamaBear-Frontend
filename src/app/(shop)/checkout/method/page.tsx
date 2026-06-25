"use client";

import { Truck, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/context/CheckoutContext";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { shippingApi } from "@/lib/api/shipping";
import { VoucherInput } from "@/components/checkout/VoucherInput";

// Berat minimum per item jika tidak ada data berat (gram)
const DEFAULT_ITEM_WEIGHT_GRAM = 500;

// Threshold cargo (gram) — 3kg
const CARGO_THRESHOLD_GRAM = 3000;

// Kurir yang tersedia
const COURIERS = ["jne", "jnt", "pos"] as const;

interface Shipping {
  courier: string;
  service: string;
  cost: number;
  etd: string;
}

const ORIGIN_CITY_ID = "577"; // Kota asal MamaBear

export default function CheckoutPageMethod() {
  const router = useRouter();
  const { state: checkoutState, prevStep, setMethod } = useCheckout();

  const [shippingOptions, setShippingOptions] = useState<Shipping[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const totalWeightGram = useMemo(() => {
    const items = checkoutState.items ?? [];
    if (items.length === 0) return DEFAULT_ITEM_WEIGHT_GRAM;
    const calculated = items.reduce((sum, item) => {
      const itemWeight = (item as any).weight ?? DEFAULT_ITEM_WEIGHT_GRAM;
      return sum + itemWeight * item.quantity;
    }, 0);
    return Math.max(calculated, 1);
  }, [checkoutState.items]);

  const isCargo = totalWeightGram >= CARGO_THRESHOLD_GRAM;

  const subtotal = checkoutState.items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!checkoutState.shipping?.cityId) {
      toast.error("Isi informasi pengiriman dulu");
      router.replace("/checkout/info");
      setLoading(false);
      return;
    }

    async function fetchShippingCost() {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          COURIERS.map((courier) =>
            shippingApi.calculateShipping({
              originCityId: ORIGIN_CITY_ID,
              destinationCityId: checkoutState.shipping!.cityId,
              weight: totalWeightGram,
              courier,
            })
          )
        );

        const options: Shipping[] = [];
        results.forEach((result, idx) => {
          if (result.status === "rejected") {
            console.warn(`Kurir ${COURIERS[idx]} gagal:`, result.reason);
            return;
          }

          const data = result.value.data?.data ?? [];
          data.forEach((item: any) => {
            const costArr = item.cost;
            const cost = Array.isArray(costArr)
              ? costArr[0]?.value ?? costArr[0] ?? 0
              : Number(costArr ?? 0);
            const etd = Array.isArray(costArr)
              ? costArr[0]?.etd ?? item.etd ?? "-"
              : item.etd ?? "-";

            options.push({
              courier: COURIERS[idx],
              service: item.service,
              cost: Number(cost),
              etd: String(etd).replace(/\s*HARI\s*/i, "").trim(),
            });
          });
        });

        const filtered = isCargo
          ? options
          : options.filter(
              (o) =>
                !o.service.toLowerCase().includes("cargo") &&
                !o.service.toLowerCase().includes("freight")
            );

        filtered.sort((a, b) => a.cost - b.cost);
        setShippingOptions(filtered);
      } catch (err) {
        console.error("Failed to fetch shipping options", err);
        toast.error("Gagal mengambil opsi pengiriman");
      } finally {
        setLoading(false);
      }
    }

    fetchShippingCost();
  }, [checkoutState.shipping?.cityId, totalWeightGram, isCargo, router]);

  const handleBack = () => {
    prevStep();
    router.push("/checkout/info");
  };

  const handleContinue = () => {
    if (!selectedShipping) {
      setError(true);
      toast.error("Pilih metode pengiriman dulu");
      return;
    }
    setError(false);
    router.push("/payment");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = JSON.parse(e.target.value) as Shipping;
    setSelectedShipping(value);
    setMethod(value);
    setError(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT - FORM */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Truck size={24} className="text-pink-600" />
              <h1 className="text-2xl font-bold">Metode Pengiriman</h1>
            </div>

            <p className="mb-2 text-sm text-gray-600">
              Pengiriman ke: {checkoutState.shipping?.address}
            </p>

            <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
              <Package size={14} />
              <span>
                Total berat:{" "}
                <strong className="text-gray-700">
                  {totalWeightGram >= 1000
                    ? `${(totalWeightGram / 1000).toFixed(1)} kg`
                    : `${totalWeightGram} gram`}
                </strong>
                {isCargo && (
                  <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Paket berat (&gt;3kg)
                  </span>
                )}
              </span>
            </div>

            {error && (
              <p className="mb-4 text-sm font-medium text-red-500">
                Pilih metode pengiriman untuk melanjutkan.
              </p>
            )}

            <div className="mt-2 space-y-3">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border-2 border-gray-200 rounded-xl p-4"
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
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                  Tidak ada opsi pengiriman tersedia untuk alamat ini.
                  {isCargo && (
                    <p className="mt-1 text-xs">
                      Paket di atas 3kg mungkin membutuhkan layanan kargo khusus.
                    </p>
                  )}
                </div>
              ) : (
                shippingOptions.map((option, index) => (
                  <label
                    key={`${option.courier}-${option.service}-${index}`}
                    className={`flex cursor-pointer items-center gap-3 border-2 rounded-xl p-4 transition-colors hover:border-pink-300 ${
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
                          {option.courier} — {option.service}
                        </span>
                        <span className="font-bold text-pink-600">
                          Rp {option.cost.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {option.etd ? `${option.etd} hari kerja` : "Estimasi tidak tersedia"}
                      </p>
                    </div>
                  </label>
                ))
              )}

              {/* FIX: VoucherInput ditambahkan di sini — setelah pilih kurir,
                  sebelum lanjut ke review. ShippingCost dari selectedShipping
                  dipass supaya voucher free_shipping bisa dihitung dengan benar. */}
              <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/30 p-4">
                <VoucherInput
                  subtotal={subtotal}
                  shippingCost={selectedShipping?.cost ?? 0}
                />
              </div>

              <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full cursor-pointer rounded-xl border border-gray-300 px-4 py-2 hover:bg-pink-50 sm:w-32"
                >
                  Kembali
                </button>
                <button
                  onClick={handleContinue}
                  className="w-full cursor-pointer rounded-xl bg-[var(--mamabear-dark-pink)] px-4 py-2 text-white hover:bg-pink-700 sm:flex-1"
                >
                  Lanjutkan
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
}