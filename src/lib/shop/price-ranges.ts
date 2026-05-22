export interface ShopPriceRange {
  id: string;
  label: string;
  minPrice?: number;
  maxPrice?: number;
}

export const SHOP_PRICE_RANGES: ShopPriceRange[] = [
  { id: "under-70", label: "Under Rp 70.000", maxPrice: 70_000 },
  {
    id: "70-100",
    label: "Rp 70.000 - Rp 100.000",
    minPrice: 70_000,
    maxPrice: 100_000,
  },
  {
    id: "100-150",
    label: "Rp 100.000 - Rp 150.000",
    minPrice: 100_000,
    maxPrice: 150_000,
  },
  {
    id: "150-200",
    label: "Rp 150.000 - Rp 200.000",
    minPrice: 150_000,
    maxPrice: 200_000,
  },
  { id: "above-200", label: "Above Rp 200.000", minPrice: 200_000 },
];

export function getActivePriceRangeId(
  minPrice?: number,
  maxPrice?: number,
): string | undefined {
  if (minPrice == null && maxPrice == null) return undefined;

  return SHOP_PRICE_RANGES.find((range) => {
    const expectedMin = range.minPrice;
    const expectedMax = range.maxPrice;

    if (expectedMin == null && expectedMax != null) {
      return maxPrice === expectedMax && (minPrice == null || minPrice === 0);
    }
    if (expectedMax == null && expectedMin != null) {
      return minPrice === expectedMin && maxPrice == null;
    }
    return minPrice === expectedMin && maxPrice === expectedMax;
  })?.id;
}

export function priceRangeToParams(rangeId: string): {
  minPrice: string | null;
  maxPrice: string | null;
} {
  const range = SHOP_PRICE_RANGES.find((r) => r.id === rangeId);
  if (!range) {
    return { minPrice: null, maxPrice: null };
  }
  return {
    minPrice: range.minPrice != null ? String(range.minPrice) : null,
    maxPrice: range.maxPrice != null ? String(range.maxPrice) : null,
  };
}

export function getPriceRangeLabel(
  minPrice?: number,
  maxPrice?: number,
): string | undefined {
  const id = getActivePriceRangeId(minPrice, maxPrice);
  return SHOP_PRICE_RANGES.find((r) => r.id === id)?.label;
}
