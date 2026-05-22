"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { formatPrice } from "@/lib/utils";
import type { ShopPriceBounds } from "@/types";

interface PriceRangeSliderProps {
  bounds: ShopPriceBounds;
  minPrice?: number;
  maxPrice?: number;
  onDebouncedChange: (min: number | null, max: number | null) => void;
}

export default function PriceRangeSlider({
  bounds,
  minPrice,
  maxPrice,
  onDebouncedChange,
}: PriceRangeSliderProps) {
  const floor = bounds.min;
  const ceiling = bounds.max;
  const resolvedMin = minPrice ?? floor;
  const resolvedMax = maxPrice ?? ceiling;

  const [minVal, setMinVal] = useState(resolvedMin);
  const [maxVal, setMaxVal] = useState(resolvedMax);
  const debouncedMin = useDebounce(minVal, 300);
  const debouncedMax = useDebounce(maxVal, 300);
  const syncingFromUrl = useRef(false);

  useEffect(() => {
    syncingFromUrl.current = true;
    setMinVal(resolvedMin);
    setMaxVal(resolvedMax);
  }, [resolvedMin, resolvedMax]);

  useEffect(() => {
    if (syncingFromUrl.current) {
      if (minVal === debouncedMin && maxVal === debouncedMax) {
        syncingFromUrl.current = false;
      }
      return;
    }

    if (minVal !== debouncedMin || maxVal !== debouncedMax) return;

    const nextMin = debouncedMin > floor ? debouncedMin : null;
    const nextMax = debouncedMax < ceiling ? debouncedMax : null;

    const currentMin =
      minPrice != null && minPrice > floor ? minPrice : null;
    const currentMax =
      maxPrice != null && maxPrice < ceiling ? maxPrice : null;

    if (nextMin === currentMin && nextMax === currentMax) return;

    onDebouncedChange(nextMin, nextMax);
  }, [
    debouncedMin,
    debouncedMax,
    minVal,
    maxVal,
    minPrice,
    maxPrice,
    floor,
    ceiling,
    onDebouncedChange,
  ]);

  const minPercent = ((minVal - floor) / (ceiling - floor)) * 100;
  const maxPercent = ((maxVal - floor) / (ceiling - floor)) * 100;

  return (
    <div className="space-y-4">
      <p className="text-xs text-brown/80">
        {formatPrice(minVal)} – {formatPrice(maxVal)}
      </p>

      <div className="relative h-2 rounded-full bg-light-pink">
        <div
          className="absolute h-full rounded-full bg-dark-pink/70"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="price-min"
            className="text-xs font-medium text-brown"
          >
            Minimum
          </label>
          <input
            id="price-min"
            type="range"
            min={floor}
            max={ceiling}
            step={5000}
            value={minVal}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMinVal(Math.min(v, maxVal));
            }}
            className="mt-1 h-2 w-full cursor-pointer accent-dark-pink"
          />
        </div>
        <div>
          <label
            htmlFor="price-max"
            className="text-xs font-medium text-brown"
          >
            Maximum
          </label>
          <input
            id="price-max"
            type="range"
            min={floor}
            max={ceiling}
            step={5000}
            value={maxVal}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxVal(Math.max(v, minVal));
            }}
            className="mt-1 h-2 w-full cursor-pointer accent-dark-pink"
          />
        </div>
      </div>
    </div>
  );
}
