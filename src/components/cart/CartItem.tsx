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
    <div className="flex gap-4 py-5 first:pt-6 last:pb-6 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-pink-100">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onToggleSelected?.(event.target.checked)}
          aria-label={`Select ${item.name}`}
          className="h-5 w-5 shrink-0 rounded border border-[#F6B8CB] text-[var(--mamabear-dark-pink)] focus:ring-pink-500"
        />
      </div>

      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white md:h-24 md:w-24">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[var(--mamabear-dark-pink)] md:text-[13px]">
              {item.categoryName ?? item.variantName ?? "Product"}
            </p>

            <h2 className="truncate text-[14px] leading-tight font-bold text-[#6C4735] md:text-[15px]">
              {item.name}
            </h2>

            {item.variantLabel && (
              <p className="mt-1 text-[13px] text-[#7F6576] md:text-[13px]">
                {item.variantLabel}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex items-center overflow-hidden rounded-full border border-[#F6B8CB] bg-white shadow-sm">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onChangeQty?.(item.quantity - 1)}
              className="flex h-8 w-8 rounded-none border-0 bg-transparent p-0 text-[#8D6B5B] hover:bg-[#FFF5F8] hover:text-[#8D6B5B]"
            >
              <Minus className="size-4" />
            </Button>

            <div className="flex h-8 min-w-12 items-center justify-center px-2 text-[14px] leading-none font-semibold text-[#6C4735]">
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

          <div className="flex items-center gap-3">
            <div className="text-[15px] font-bold text-[#6C4735] md:text-[15px]">
              {safeFormatPrice(price * item.quantity)}
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="rounded-full p-2 transition hover:bg-pink-50"
            >
              <Trash2 size={18} className="text-[#FF7D7D]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
