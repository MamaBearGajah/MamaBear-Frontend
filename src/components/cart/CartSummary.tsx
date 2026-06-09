"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Tag, Ticket } from "lucide-react";
import { useCheckout } from "@/context/CheckoutContext";
import { Button } from "@/components/ui/button";
import { CheckoutItem } from "@/types";

interface CartSummaryProps {
  selectedItems: any[];
  subtotal: number;
  itemCount: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  promoCode: string;
  promoApplied: boolean;
  promoError: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
  checkoutHref?: string;
  removeSelectedItems: () => void;
}

export default function CartSummary({
  selectedItems,
  subtotal,
  itemCount,
  discount,
  shipping,
  finalTotal,
  promoCode,
  promoApplied,
  promoError,
  onPromoCodeChange,
  onApplyPromo,
  checkoutHref,
  removeSelectedItems,
}: CartSummaryProps) {
  const PAYMENT_METHODS = ["BCA", "Mandiri", "GoPay", "OVO", "Dana", "QRIS"];
  const hasSelection = itemCount > 0;
  const { state: checkoutState, postItems, setShipping, nextStep } = useCheckout();
  const router = useRouter();
  return (
    <div className="sticky top-5 rounded-[22px] border border-[#F6B8CB] bg-white p-6 shadow-sm">
      <h2
        className="mb-5 text-[28px] leading-tight font-black"
        style={{ color: "#6C4735" }}
      >
        Order Summary
      </h2>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-[#6C4735]">
          Promo Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2"
              style={{ color: "#D5557E" }}
            />
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              className="h-11 w-full rounded-2xl border border-[#F6B8CB] pr-4 pl-10 text-sm text-[#8D6B5B] outline-none placeholder:text-[#B892A1]"
            />
          </div>
          <Button
            type="button"
            onClick={onApplyPromo}
            className="h-11 rounded-2xl bg-[var(--mamabear-dark-pink)] px-6 text-sm font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90"
          >
            Apply
          </Button>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#8D6B5B]">
          <Ticket className="size-4 text-[#D5557E]" />
          <span>
            Try:{" "}
            <strong className="text-[#6C4735] underline">MAMABEAR15</strong> for
            15% off
          </span>
        </p>
        {promoApplied && (
          <p className="mt-2 text-sm text-green-600">
            Promo applied successfully 🎉
          </p>
        )}
        {promoError && (
          <p className="mt-2 text-sm text-red-500">{promoError}</p>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-sm text-[#6C4735]">
          <span>Subtotal ({itemCount} items)</span>
          <strong>Rp {subtotal.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6C4735]">Shipping</span>
          <strong className="text-[#00A651]">
            {shipping === 0 ? "FREE" : `Rp ${shipping.toLocaleString()}`}
          </strong>
        </div>

        <div className="flex items-center justify-between border-t border-[#F6B8CB] pt-3">
          <span className="text-lg font-semibold text-[#6C4735]">Total</span>
          <span className="text-lg font-bold text-[var(--mamabear-dark-pink)]">
            Rp {finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          disabled={!hasSelection}
          onClick={() => {
            postItems(selectedItems);
            removeSelectedItems();
            router.push(checkoutHref ?? "/checkout/info");
          }}
          className={`h-12 w-full rounded-full bg-[var(--mamabear-dark-pink)] text-base font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90 ${!hasSelection ? "cursor-not-allowed opacity-50" : ""}`}
        >
          Proceed to Checkout <ArrowRight className="size-5" />
        </Button>

        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8D6B5B]">
          <Lock className="size-3 text-[#E3A63D]" />
          Secured by SSL encryption
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="flex h-6 items-center justify-center rounded-lg border border-[#E6C1CD] px-2 text-[12px] font-bold text-[#6C4735]"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
