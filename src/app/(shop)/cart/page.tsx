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

// FIX: Semua voucher ongkir membership menggunakan prefix "SHIP-".
// Voucher ini punya usageLimit:1, sehingga backend akan throw "Voucher sudah habis"
// bahkan sebelum sempat return tipe voucher — kita cegat di sini sebelum hit API
// agar pesan error yang ditampilkan jelas dan tidak menyesatkan user.
const isShippingVoucherCode = (code: string) => /^SHIP-/i.test(code.trim());

const CartPage = () => {
  const { state, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { state: authState } = useAuth();
  const { setVoucher, clearVoucher } = useCheckout();

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
    clearVoucher();

    const trimmedCode = promoCode.trim().toUpperCase();

    if (!trimmedCode) {
      setPromoError("Masukkan kode voucher");
      return;
    }

    if (selectedSubtotal <= 0) {
      setPromoError("Pilih produk terlebih dahulu");
      return;
    }

    // FIX: cek prefix SHIP- sebelum hit API.
    // Voucher ongkir (SHIP-SILVER, SHIP-GOLD, SHIP-PLATINUM) punya usageLimit:1 —
    // backend langsung throw "Voucher sudah habis" tanpa sempat return tipe voucher,
    // sehingga catch menampilkan pesan yang menyesatkan. Kita blokir di sini duluan.
    if (isShippingVoucherCode(trimmedCode)) {
      setPromoError(
        "Voucher ongkir tidak bisa dipakai di sini. Masukkan kode voucher ongkir di halaman pilih metode pengiriman saat checkout."
      );
      return;
    }

    try {
      const res = await voucherApi.validate(
        trimmedCode,
        selectedSubtotal,
        0, // shippingCost belum diketahui di cart
      );

      if (!res.valid) {
        setPromoError("Voucher tidak valid atau sudah tidak aktif");
        return;
      }

      // Double-check tipe dari response (untuk voucher ongkir non-SHIP- jika ada)
      if (res.voucher.type === "free_shipping") {
        setPromoError(
          "Voucher ongkir tidak bisa dipakai di sini. Masukkan kode voucher ongkir di halaman pilih metode pengiriman saat checkout."
        );
        return;
      }

      setPromoApplied(true);
      setPromoError("");
      setAppliedDiscount(res.discountAmount);
      setVoucher(trimmedCode, res.voucher.id, res.discountAmount);
    } catch (err: any) {
      setPromoApplied(false);
      setAppliedDiscount(0);
      clearVoucher();

      const serverMsg: string =
        err?.response?.data?.error?.message ??
        err?.response?.data?.message ??
        "";

      // FIX: jika backend throw error untuk kode ongkir (lolos pre-check karena alasan lain),
      // tetap tampilkan pesan yang benar, bukan "Voucher sudah habis"
      if (isShippingVoucherCode(trimmedCode)) {
        setPromoError(
          "Voucher ongkir tidak bisa dipakai di sini. Masukkan kode voucher ongkir di halaman pilih metode pengiriman saat checkout."
        );
      } else {
        setPromoError(serverMsg || "Voucher tidak valid atau sudah habis");
      }
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