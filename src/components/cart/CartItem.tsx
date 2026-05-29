"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    variant?: string;
    meta?: string;
    imageUrl?: string;
    unitPrice?: number;
    qty?: number;
  };
  onChangeQty?: (qty: number) => void;
  onRemove?: () => void;
}

export default function CartItem({
  item,
  onChangeQty,
  onRemove,
}: CartItemProps) {
  const { name, variant, meta, imageUrl, unitPrice, qty = 1 } = item;
  const lineTotal = (unitPrice ?? 0) * qty;

  return (
    <div className="flex items-start justify-between gap-4 py-5 md:py-6">
      <div className="flex min-w-0 items-start gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="text-[13px] font-medium text-[var(--mamabear-dark-pink)]">
            ASI Booster Tea
          </div>
          <div className="truncate text-[14px] font-semibold text-[#6C4735] md:text-[15px]">
            {name}
          </div>
          {variant ? (
            <div className="text-[13px] text-[#7F6576]">{variant}</div>
          ) : null}
          {meta ? (
            <div className="mt-1 text-[13px] text-[#8D97B2]">{meta}</div>
          ) : null}

          <div className="mt-3 inline-flex h-7 items-center overflow-hidden rounded-full border border-[#F6B8CB] bg-white text-[#6C4735] shadow-sm">
            <Button
              variant="ghost"
              onClick={() => onChangeQty?.(Math.max(1, (qty || 1) - 1))}
              className="h-7 w-7 rounded-none border-0 bg-transparent p-0 text-[#8D6B5B] hover:bg-[#FFF5F8] hover:text-[#8D6B5B]"
            >
              <Minus className="size-4" />
            </Button>
            <div className="flex h-7 min-w-10 items-center justify-center px-2 text-[14px] leading-none font-medium">
              {qty}
            </div>
            <Button
              variant="ghost"
              onClick={() => onChangeQty?.((qty || 1) + 1)}
              className="h-7 w-7 rounded-none border-0 bg-transparent p-0 text-[#8D6B5B] hover:bg-[#FFF5F8] hover:text-[#8D6B5B]"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 pt-[104px] md:pt-[100px]">
        <div className="text-[15px] font-bold text-[#6C4735]">
          Rp {lineTotal.toLocaleString()}
        </div>
        <button onClick={onRemove} className="text-[#F26B6B]">
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
