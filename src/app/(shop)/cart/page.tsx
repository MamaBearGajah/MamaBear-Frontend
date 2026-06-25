"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import CartItem from "../../../components/cart/CartItem";
import CartSummary from "../../../components/cart/CartSummary";
import EmptyCart from "../../../components/cart/EmptyCart";
import { useCheckout } from "@/context/CheckoutContext";
import { voucherApi } from "@/lib/api/voucher";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, ChevronRight, Trash2, Truck, Shield, RotateCcw } from "lucide-react";

const CartPage = () => {
  const { state, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { state: authState } = useAuth();
  const { setVoucher } = useCheckout();

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const { items, loading } = state;

  const checkoutHref = authState.user
    ? "/checkout/info"
    : "/auth/login?redirect=/checkout/info";

  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));

  const selectedSubtotal = selectedItems.reduce((total, item) => {
    const price = item.discountPrice ?? item.basePrice;
    return total + price * item.quantity;
  }, 0);

  const selectedCount = selectedItems.length;
  const discount = promoApplied ? appliedDiscount : 0;
  const finalTotal = selectedSubtotal > 0 ? selectedSubtotal - discount : 0;

  // Sync discount to context whenever it changes (e.g. item deselected)
  useEffect(() => {
    if (!promoApplied) setVoucher(0, null);
  }, [promoApplied]);

  useEffect(() => {
    setSelectedItemIds((current) =>
      current.filter((id) => items.some((item) => item.id === id))
    );
  }, [items]);

  const handleToggleItemSelection = (itemId: string, checked: boolean) => {
    setSelectedItemIds((current) =>
      checked ? [...current, itemId] : current.filter((id) => id !== itemId)
    );
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((item) => removeItem(item.productId, item.variantId));
    setSelectedItemIds([]);
  };

  const handleClearCart = () => {
    clearCart();
    setSelectedItemIds([]);
  };

  const handleApplyPromo = async () => {
    setPromoError("");
    setPromoApplied(false);
    setAppliedDiscount(0);
    setVoucher(0, null);

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

      if (!res.valid) {
        setPromoError("Voucher tidak valid atau sudah tidak aktif");
        return;
      }

      setPromoApplied(true);
      setPromoError("");
      setAppliedDiscount(res.discountAmount);
      // Simpan discount + voucherId ke context agar ikut ke createOrder
      setVoucher(res.discountAmount, res.voucher.id);
    } catch (err: any) {
      setPromoApplied(false);
      setAppliedDiscount(0);
      setVoucher(0, null);
      setPromoError(
        err?.response?.data?.error?.message ??
        err?.response?.data?.message ??
        "Voucher tidak valid atau sudah habis"
      );
    }
  };

  if (!loading && items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden py-6 md:py-10"
      style={{ backgroundColor: "#FFF5F8", fontFamily: "'Urbanist', sans-serif" }}
    >
      <div className="container-main space-y-4 md:space-y-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs" style={{ color: "#8B6352" }}>
          <Link href="/" className="hover:text-pink-600">Home</Link>
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
              <badge.icon size={16} style={{ color: "#D5557E" }} className="shrink-0" />
              {badge.text}
            </div>
          ))}
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-8">
          {/* Cart items */}
          <div className="min-w-0 space-y-4 lg:col-span-2">
            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm sm:rounded-3xl">
              <div className="flex items-center justify-between gap-3 border-b border-pink-100 px-3 py-3 sm:px-5 sm:py-4">
                <h2 className="text-[15px] font-bold text-[#6C4735]">Products</h2>
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleRemoveSelected}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-2xl border border-[#F6B8CB] bg-[#FFF5F8] px-3 py-2 text-xs font-medium text-[#D5557E] transition hover:bg-[#FDE7EE] sm:px-4 sm:text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="truncate">Delete selected ({selectedCount})</span>
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
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    selected={selectedItemIds.includes(item.id)}
                    onToggleSelected={(checked: boolean) =>
                      handleToggleItemSelection(item.id, checked)
                    }
                    onRemove={() => removeItem(item.productId, item.variantId)}
                    onChangeQty={(qty: number) =>
                      updateQuantity(item.productId, item.variantId, qty)
                    }
                  />
                ))}
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
              finalTotal={finalTotal}
              promoCode={promoCode}
              promoApplied={promoApplied}
              promoError={promoError}
              onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo}
              checkoutHref={checkoutHref}
              removeSelectedItems={() => setSelectedItemIds([])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;