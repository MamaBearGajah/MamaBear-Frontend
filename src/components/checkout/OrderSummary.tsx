"use client";
import { Lock, Package } from "lucide-react";
import { safeFormatPrice } from "../../lib/utils";
import Image from "next/image";
import { useCheckout } from "../../context/CheckoutContext";

function OrderSummary() {
  const { state: checkoutState, subtotal } = useCheckout();
  const { items, method, discount, shipping } = checkoutState;

  const shippingCost = method ? method.cost : 0;
  const total = subtotal - (discount ?? 0) + shippingCost;

  return (
    <div className="h-fit rounded-2xl border border-pink-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Package size={22} className="text-pink-600" />
        <h2 className="text-xl font-bold text-gray-800">Ringkasan Pesanan</h2>
      </div>

      {/* ITEMS */}
      <div className="mb-6 space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const price = item.discountPrice ?? item.basePrice;
            return (
              <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white">
                      {item.quantity}
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="line-clamp-1 font-medium text-gray-800">
                      {item.name}
                    </span>
                    {(item.variantLabel || item.variantName) && (
                      <span className="line-clamp-1 text-xs text-gray-500">
                        {item.variantLabel || item.variantName}
                      </span>
                    )}
                    {/* Notes per item — dari CartItem.notes */}
                    {item.notes && (
                      <span className="mt-0.5 line-clamp-2 text-xs text-amber-600 italic">
                        📝 {item.notes}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-medium text-gray-800 shrink-0">
                  {safeFormatPrice(price * item.quantity)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            Tidak ada item
          </p>
        )}
      </div>

      {/* COSTS */}
      <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">{safeFormatPrice(subtotal)}</span>
        </div>

        {(discount ?? 0) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Diskon</span>
            <span className="font-medium">- {safeFormatPrice(discount ?? 0)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Ongkos kirim</span>
          <span className="font-medium text-gray-800">
            {method ? safeFormatPrice(method.cost) : "—"}
          </span>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-800">
          <span>Total</span>
          <span className="text-pink-600">{safeFormatPrice(total)}</span>
        </div>
      </div>

      {/* Catatan pengiriman */}
      {shipping?.deliveryNotes && (
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700 mb-1">Catatan Pengiriman</p>
          <p>{shipping.deliveryNotes}</p>
        </div>
      )}

      {/* Keamanan */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Lock className="size-3.5 shrink-0" />
        Pembayaran aman & terenkripsi
      </div>
    </div>
  );
}

export default OrderSummary;