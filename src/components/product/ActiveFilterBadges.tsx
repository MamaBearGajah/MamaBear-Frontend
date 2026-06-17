"use client";

import { X } from "lucide-react";
import { useShopFilters } from "@/hooks/useShopFilters";
import {
  DEFAULT_PRICE_BOUNDS,
  SHOP_PRICE_MIN,
} from "@/lib/shop/product-list-params";
import { getPriceRangeLabel } from "@/lib/shop/price-ranges";
import { cn, formatPrice } from "@/lib/utils";
import type { Category } from "@/types";

interface ActiveFilterBadgesProps {
  categories: Category[];
  className?: string;
}

interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

function getPriceChipLabel(
  minPrice?: number,
  maxPrice?: number,
): string | undefined {
  const hasMin = minPrice != null && minPrice > SHOP_PRICE_MIN;
  const hasMax =
    maxPrice != null && maxPrice < DEFAULT_PRICE_BOUNDS.max;

  if (!hasMin && !hasMax) return undefined;

  const preset = getPriceRangeLabel(minPrice, maxPrice);
  if (preset) return preset;

  if (hasMin && hasMax) {
    return `${formatPrice(minPrice!)} – ${formatPrice(maxPrice!)}`;
  }
  if (hasMin) return `From ${formatPrice(minPrice!)}`;
  if (hasMax) return `Up to ${formatPrice(maxPrice!)}`;

  return undefined;
}

function FilterChipButton({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full bg-light-pink px-3 py-1 text-xs font-medium text-brown transition-colors hover:bg-dark-pink/15"
    >
      {label}
      <X className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only">Remove filter {label}</span>
    </button>
  );
}

export default function ActiveFilterBadges({
  categories,
  className,
}: ActiveFilterBadgesProps) {
  const { filters, updateFilter, clearAllFilters } = useShopFilters();

  const chips: FilterChip[] = [];

  const category =
    filters.categoryId && filters.categoryId !== "cat-root"
      ? categories.find((c) => c.id === filters.categoryId)
      : undefined;

  if (category) {
    chips.push({
      key: "category",
      label: category.name,
      onRemove: () =>
        updateFilter({ categoryId: null, categoryIds: null, variantName: null, variantValue: null }),
    });
  }

  const priceLabel = getPriceChipLabel(filters.minPrice, filters.maxPrice);
  if (priceLabel) {
    chips.push({
      key: "price",
      label: priceLabel,
      onRemove: () =>
        updateFilter({ minPrice: null, maxPrice: null }),
    });
  }

  if (filters.inStock === true) {
    chips.push({
      key: "inStock",
      label: "In Stock Only",
      onRemove: () => updateFilter({ inStock: null }),
    });
  }

  if (filters.q?.trim()) {
    chips.push({
      key: "q",
      label: `"${filters.q.trim()}"`,
      onRemove: () => updateFilter({ q: null }),
    });
  }

  // Variant filter chip
  if (filters.variantValue) {
    chips.push({
      key: "variant",
      label: filters.variantName
        ? `${filters.variantName}: ${filters.variantValue}`
        : filters.variantValue,
      onRemove: () => updateFilter({ variantName: null, variantValue: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 pb-4",
        className,
      )}
    >
      {chips.map((chip) => (
        <FilterChipButton
          key={chip.key}
          label={chip.label}
          onRemove={chip.onRemove}
        />
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs font-medium text-dark-pink hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}