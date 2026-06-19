"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { safeFormatPrice } from "@/lib/utils";
import type { CartItem as CartItemData } from "@/types";

interface CartItemProps {
  item: CartItemData;
  selected?: boolean;
  onToggleSelected?: (checked: boolean) => void;
  onChangeQty?: (qty: number) => void;
  onRemove?: () => void;
}

export default function CartItem({
  item,
  selected = false,
  onToggleSelected,
  onChangeQty,
  onRemove,
}: CartItemProps) {
  const price = item.discountPrice ?? item.basePrice;

  return (
    <div className="w-full max-w-full overflow-hidden border-b border-pink-100 px-3 py-3 first:pt-3 last:pb-3 sm:px-5 sm:py-5 sm:first:pt-5 sm:last:pb-5">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onToggleSelected?.(event.target.checked)}
            aria-label={`Select ${item.name}`}
            className="h-5 w-5 shrink-0 rounded border border-[#F6B8CB] text-[var(--mamabear-dark-pink)] focus:ring-pink-500"
          />

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white sm:h-20 sm:w-20 md:h-24 md:w-24">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-[var(--mamabear-dark-pink)] sm:text-[13px]">
            {item.categoryName ?? item.variantName ?? "Product"}
          </p>

          <h2 className="line-clamp-2 text-[13px] leading-tight font-bold text-[#6C4735] sm:text-[14px] md:text-[15px]">
            {item.name}
          </h2>

          {item.variantLabel && (
            <p className="mt-1 line-clamp-2 text-[12px] text-[#7F6576] sm:text-[13px]">
              {item.variantLabel}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center overflow-hidden rounded-full border border-[#F6B8CB] bg-white shadow-sm">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onChangeQty?.(item.quantity - 1)}
                className="flex h-8 w-8 rounded-none border-0 bg-transparent p-0 text-[#8D6B5B] hover:bg-[#FFF5F8] hover:text-[#8D6B5B]"
              >
                <Minus className="size-4" />
              </Button>

              <div className="flex h-8 min-w-10 items-center justify-center px-2 text-[13px] leading-none font-semibold text-[#6C4735] sm:min-w-12 sm:text-[14px]">
                {item.quantity}
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => onChangeQty?.(item.quantity + 1)}
                className="flex h-8 w-8 rounded-none border-0 bg-transparent p-0 text-[#8D6B5B] hover:bg-[#FFF5F8] hover:text-[#8D6B5B]"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="min-w-0 text-[13px] font-bold whitespace-nowrap text-[#6C4735] sm:text-[15px] md:text-[15px]">
                {safeFormatPrice(price * item.quantity)}
              </div>

              <button
                type="button"
                onClick={onRemove}
                className="rounded-full p-1.5 transition hover:bg-pink-50 sm:p-2"
              >
                <Trash2 size={16} className="text-[#FF7D7D] sm:size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
