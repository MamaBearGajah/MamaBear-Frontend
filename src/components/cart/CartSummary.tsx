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
  const {
    state: checkoutState,
    postItems,
    setShipping,
    nextStep,
  } = useCheckout();
  const router = useRouter();

  return (
    <div className="sticky top-5 w-full rounded-[22px] border border-[#F6B8CB] bg-white p-3 shadow-sm sm:p-6 lg:max-w-[340px]">
      <h2
        className="mb-4 text-[20px] leading-tight font-black sm:mb-5 sm:text-[28px]"
        style={{ color: "#6C4735" }}
      >
        Order Summary
      </h2>

      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col gap-2 sm:flex-row">
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
            className="h-11 w-full rounded-2xl bg-[var(--mamabear-dark-pink)] px-6 text-sm font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90 sm:w-auto"
          >
            Apply
          </Button>
        </div>
        {/* FIX: ganti MAMABEAR15 → MAMABEAR10 (yang ada di seed) */}
        <p className="mt-3 flex items-start gap-2 text-sm text-[#8D6B5B]">
          <Ticket className="size-4 text-[#D5557E]" />
          <span>
            Try:{" "}
            <strong className="text-[#6C4735] underline">MAMABEAR10</strong> for
            10% off
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

      <div className="space-y-2.5 pt-1 sm:space-y-3">
        <div className="flex flex-col gap-1 text-sm text-[#6C4735] sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <span className="min-w-0 pr-2 break-words">
            Subtotal ({itemCount} items)
          </span>
          <strong className="min-w-0 text-left break-words sm:text-right">
            Rp {subtotal.toLocaleString()}
          </strong>
        </div>
        <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <span className="text-[#6C4735]">Discount</span>
          <strong className="min-w-0 text-left break-words text-[#00A651] sm:text-right">
            {discount === 0 ? "Rp 0" : `Rp ${discount.toLocaleString()}`}
          </strong>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#F6B8CB] pt-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <span className="min-w-0 text-base font-semibold break-words text-[#6C4735] sm:text-lg">
            Total
          </span>
          <span className="min-w-0 text-left text-base font-bold break-words text-[var(--mamabear-dark-pink)] sm:text-right sm:text-lg">
            Rp {finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <Button
          disabled={!hasSelection}
          onClick={() => {
            postItems(selectedItems);
            selectedItems = [];
            router.push(checkoutHref ?? "/checkout/info");
          }}
          className={`h-11 w-full rounded-full bg-[var(--mamabear-dark-pink)] text-sm font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90 sm:h-12 sm:text-base ${!hasSelection ? "cursor-not-allowed opacity-50" : ""}`}
        >
          Proceed to Checkout <ArrowRight className="size-5" />
        </Button>

        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8D6B5B]">
          <Lock size={12} />
          Secured by SSL encryption
        </p>
      </div>
    </div>
  );
}