"use client";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCart";
import { useCheckout } from "@/context/CheckoutContext";
import {voucherApi} from "@/lib/api/voucher";
// import { useCheckout } from "@/context/CheckoutContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";

import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Trash2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

const CartPage = () => {
  const { state, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { state: authState } = useAuth();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  // const { state: checkoutState, setShipping, nextStep } = useCheckout();
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const { setDiscount } = useCheckout();

  const { items, loading } = state;
  const checkoutHref = authState.user
    ? "/checkout/info"
    : "/auth/login?redirect=/checkout/info";

  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  const removeSelected = () => {
    setSelectedItemIds([]);
  };

  const selectedSubtotal = selectedItems.reduce((total, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return total + price * item.quantity;
  }, 0);

  const selectedCount = selectedItems.length;
  const discount = promoApplied ? appliedDiscount : 0;
  useEffect(() => {
    setDiscount(discount);
  }, [discount]);
  // const shipping =
  //   selectedSubtotal > 0 ? (selectedSubtotal >= 200000 ? 0 : 15000) : 0;
  // const finalTotal =
  //   selectedSubtotal > 0 ? selectedSubtotal - discount + shipping : 0;
  const finalTotal = selectedSubtotal > 0 ? selectedSubtotal - discount : 0;

  const handleToggleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItemIds((current) =>
      checked ? [...current, itemId] : current.filter((id) => id !== itemId)
    );
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((item) => removeItem(item.productId, item.variantId));
    setSelectedItemIds([]);
  };

  useEffect(() => {
    setSelectedItemIds((current) =>
      current.filter((id) => items.some((item) => item.id === id))
    );
  }, [items]);

  const handleClearCart = () => {
    clearCart();
    setSelectedItemIds([]);
  };

  type VoucherValidateResult = {
      success: boolean;
  data:{
    id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    source: string;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
  }
  discountAmount: number;
  finalShippingCost: number;


    // id: string;
    // code: string;
    // type: "percentage" | "fixed";
    // value: number;
    // source: string;
    // minPurchase?: number;
    // maxDiscount?: number;
    // usageLimit?: number;
    // usedCount: number;
    // isActive: boolean;
    // startDate?: string;
    // endDate?: string;
    // createdAt: string;
    // updatedAt: string;
    // code: string;
    // totalAmount: number;
    // shippingCost: number;
  }

  const handleApplyPromo = async () => {
    setPromoError("");
    setPromoApplied(false);
    setAppliedDiscount(0);
    setDiscount(0);
    if (!promoCode.trim()) {
      setPromoError("Masukkan kode voucher");
      return;
    }

    if (selectedSubtotal <= 0) {
      setPromoError("Pilih produk terlebih dahulu");
      return;
    }

    try {
      const res = await voucherApi.apply({
        code: promoCode.trim().toUpperCase(),
        totalAmount: selectedSubtotal,
      });

      console.log("voucher apply response", res);

      // API may return { success, data: { valid, voucher, discountAmount, ... } }
      const responseData = (res as any)?.data ?? res;
      const success = responseData?.success ?? true;
      const payload = responseData?.data ?? responseData;

      if (!success || !payload) {
        setPromoError("Voucher tidak valid");
        return;
      }

      const valid = payload.valid ?? true;
      const voucher = payload.voucher ?? payload;

      // ensure numeric values
      const minPurchase = Number(voucher?.minPurchase ?? 0) || 0;
      const rawValue = Number(voucher?.value ?? voucher?.discountValue ?? 0) || 0;
      const maxDiscount = Number(voucher?.maxDiscount ?? 0) || 0;

      if (!valid || !voucher || (typeof voucher.isActive === "boolean" && !voucher.isActive)) {
        setPromoError("Voucher tidak valid atau sudah tidak aktif");
        return;
      }

      if (minPurchase > 0 && selectedSubtotal < minPurchase) {
        setPromoError(`Minimal pembelian Rp ${minPurchase.toLocaleString("id-ID")}`);
        return;
      }

      // compute discount: percentage or fixed
      let computedDiscount = 0;
      if (voucher.type === "percentage") {
        computedDiscount = Math.floor((rawValue / 100) * selectedSubtotal);
        if (maxDiscount > 0) computedDiscount = Math.min(computedDiscount, maxDiscount);
      } else {
        computedDiscount = rawValue; // fixed nominal
      }

      // If API returned discountAmount, prefer it
      const apiDiscount = Number(payload.discountAmount ?? 0) || 0;
      if (apiDiscount > 0) computedDiscount = apiDiscount;

      // If API returned final total, align discount to it.
      const apiFinalPrice = Number(
        payload.finalPrice ?? payload.finalTotal ?? payload.totalAfterDiscount ?? 0
      ) || 0;
      if (apiFinalPrice > 0) {
        computedDiscount = Math.max(0, selectedSubtotal - apiFinalPrice);
      }

      // If apply response does not include usage count, try incrementing usage as best effort.
      const payloadUsedCount = Number(payload.usedCount);
      if (!Number.isFinite(payloadUsedCount) && voucher?.id) {
        const currentUsedCount = Number(voucher.usedCount ?? voucher.usageCount ?? 0) || 0;
        try {
          await voucherApi.update(String(voucher.id), {
            usedCount: currentUsedCount + 1,
            usageCount: currentUsedCount + 1,
          });
        } catch (updateErr: any) {
          const status = updateErr?.response?.status;
          if (status !== 403) {
            console.warn("Failed to update voucher usage count", updateErr);
          }
        }
      }

      setPromoApplied(true);
      setPromoError("");
      setAppliedDiscount(computedDiscount);
      setDiscount(computedDiscount);
    } catch (err) {
      console.error(err);
      setPromoApplied(false);
      setPromoError("Gagal memvalidasi voucher");
      setAppliedDiscount(0);
      setDiscount(0);
    }
  };

  if (!loading && items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden py-6 md:py-10"
      style={{
        backgroundColor: "#FFF5F8",
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div className="container-main space-y-4 md:space-y-8">
        {/* Breadcrumb */}
        <div
          className="mb-6 flex items-center gap-2 text-xs"
          style={{ color: "#8B6352" }}
        >
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#D5557E" }}>Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black" style={{ color: "#6C4735" }}>
            Shopping Cart 🛒
          </h1>
          <p className="text-sm" style={{ color: "#8B6352" }}>
            {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* Feature badges */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {[
            { icon: Truck, text: "Free shipping for orders > Rp 200K" },
            { icon: Shield, text: "Secure payment guaranteed" },
            { icon: RotateCcw, text: "7-day return & exchange" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2.5 rounded-xl border bg-white p-3 text-xs"
              style={{ borderColor: "#FACBD8", color: "#8B6352" }}
            >
              <badge.icon
                size={16}
                style={{ color: "#D5557E" }}
                className="shrink-0"
              />
              {badge.text}
            </div>
          ))}
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Cart items */}
          <div className="min-w-0 space-y-4 lg:col-span-2">
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm sm:rounded-3xl">
              <div className="flex items-center justify-between gap-3 border-b border-pink-100 px-3 py-3 sm:px-5 sm:py-4">
                <h2 className="text-[15px] font-bold text-[#6C4735]">
                  Products
                </h2>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleRemoveSelected}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-2xl border border-[#F6B8CB] bg-[#FFF5F8] px-3 py-2 text-xs font-medium text-[#D5557E] transition hover:bg-[#FDE7EE] sm:px-4 sm:text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="truncate">
                        Delete selected ({selectedCount})
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D5557E] transition hover:opacity-80 sm:text-sm"
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-pink-100">
                {items.map((item) => {
                  return (
                    <CartItem
                      key={item.id}
                      item={item}
                      selected={selectedItemIds.includes(item.id)}
                      onToggleSelected={(checked: boolean) =>
                        handleToggleItemSelection(item.id, checked)
                      }
                      onRemove={() =>
                        removeItem(item.productId, item.variantId)
                      }
                      onChangeQty={(qty: number) =>
                        updateQuantity(item.productId, item.variantId, qty)
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="px-1 pt-1">
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#D5557E] transition hover:underline"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="flex w-full min-w-0 lg:justify-end lg:pt-0">
            <CartSummary
              selectedItems={selectedItems}
              subtotal={selectedSubtotal}
              itemCount={selectedCount}
              discount={discount}
              // shipping={shipping}
              finalTotal={finalTotal}
              promoCode={promoCode}
              promoApplied={promoApplied}
              promoError={promoError}
              onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo}
              checkoutHref={checkoutHref}
              removeSelectedItems={removeSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
