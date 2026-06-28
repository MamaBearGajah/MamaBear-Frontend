"use client";
import { Lock, Package } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { safeFormatPrice } from "../../lib/utils";
import Image from "next/image";
import { useCheckout } from "../../context/CheckoutContext";

function OrderSummary() {
  const { state } = useCart();
  const { state: checkoutState } = useCheckout();
  const { method } = checkoutState;
  // const { items } = state;
  const {items} = checkoutState;
  const discount = 0;
  const subtotal =
    items.reduce(
      (sum, item) =>
        sum + (item.discountPrice ?? item.basePrice) * item.quantity,
      0
    ) || 65000;
  const total = subtotal - (discount ?? 0) + (method?.cost ?? 0);

  return (
    <div className="h-fit rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Package size={22} className="text-pink-600" />
        <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
      </div>

      {/* ITEMS */}
      <div className="mb-6 space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const price = item.discountPrice ?? item.basePrice;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200"></div>
                    )}
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="line-clamp-1 font-medium text-gray-800">
                      {item.name}
                    </span>
                    <span className="line-clamp-1 text-xs text-gray-500">
                      {item.variantLabel ||
                        item.variantName ||
                        "Hazelnut Milk Tea"}
                    </span>
                  </div>
                </div>
                <span className="font-medium text-gray-800">
                  {safeFormatPrice(price * item.quantity)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-200">
                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white">
                  1
                </div>
              </div>
              <div className="flex flex-col">
                <span className="line-clamp-1 font-medium text-gray-800">
                  ASI Booster Tea - Lychee...
                </span>
                <span className="line-clamp-1 text-xs text-gray-500">
                  Hazelnut Milk Tea
                </span>
              </div>
            </div>
            <span className="font-medium text-gray-800">Rp 65.000</span>
          </div>
        )}
      </div>

      {/* COSTS */}
      <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">
            {safeFormatPrice(subtotal)}
          </span>
        </div>

        <div className={`flex justify-between ${!discount ? "hidden" : ""}`}>
          <span>Discount</span>
          <span className="font-medium text-gray-800">
            - {safeFormatPrice(discount)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium text-gray-800">
            {safeFormatPrice(method?.cost || 0)}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-800">
          <span>Total</span>
          <span className="text-pink-600">{safeFormatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
