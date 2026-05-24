"use client";

import {
  getActivePriceRangeId,
  priceRangeToParams,
  SHOP_PRICE_RANGES,
} from "@/lib/shop/price-ranges";
import { cn } from "@/lib/utils";

interface PriceRangePresetsProps {
  minPrice?: number;
  maxPrice?: number;
  onSelect: (min: number | null, max: number | null) => void;
}

export default function PriceRangePresets({
  minPrice,
  maxPrice,
  onSelect,
}: PriceRangePresetsProps) {
  const activeId = getActivePriceRangeId(minPrice, maxPrice);
  const isAnyPrice = minPrice == null && maxPrice == null;

  return (
    <ul className="space-y-2">
      <li>
        <label
          className={cn(
            "flex cursor-pointer items-center gap-2.5 text-sm text-brown",
            isAnyPrice && "font-medium text-dark-pink",
          )}
        >
          <input
            type="radio"
            name="shop-price-preset"
            checked={isAnyPrice}
            onChange={() => onSelect(null, null)}
            className="size-4 shrink-0 accent-dark-pink"
          />
          <span>Any price</span>
        </label>
      </li>

      {SHOP_PRICE_RANGES.map((range) => {
        const isSelected = activeId === range.id;
        return (
          <li key={range.id}>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2.5 text-sm text-brown",
                isSelected && "font-medium text-dark-pink",
              )}
            >
              <input
                type="radio"
                name="shop-price-preset"
                checked={isSelected}
                onChange={() => {
                  const params = priceRangeToParams(range.id);
                  onSelect(
                    params.minPrice != null ? Number(params.minPrice) : null,
                    params.maxPrice != null ? Number(params.maxPrice) : null,
                  );
                }}
                className="size-4 shrink-0 accent-dark-pink"
              />
              <span>{range.label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
