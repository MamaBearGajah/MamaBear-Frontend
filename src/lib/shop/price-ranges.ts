export interface ShopPriceRange {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
}

/** Quick-select price buckets (synced with URL minPrice / maxPrice). */
export const SHOP_PRICE_RANGES: ShopPriceRange[] = [
  {
    id: "25-50",
    label: "Rp 25.000 – Rp 50.000",
    minPrice: 25_000,
    maxPrice: 50_000,
  },
  {
    id: "50-75",
    label: "Rp 50.000 – Rp 75.000",
    minPrice: 50_000,
    maxPrice: 75_000,
  },
  {
    id: "75-100",
    label: "Rp 75.000 – Rp 100.000",
    minPrice: 75_000,
    maxPrice: 100_000,
  },
  {
    id: "100-125",
    label: "Rp 100.000 – Rp 125.000",
    minPrice: 100_000,
    maxPrice: 125_000,
  },
];

export function getActivePriceRangeId(
  minPrice?: number,
  maxPrice?: number,
): string | undefined {
  if (minPrice == null && maxPrice == null) return undefined;

  return SHOP_PRICE_RANGES.find(
    (range) => minPrice === range.minPrice && maxPrice === range.maxPrice,
  )?.id;
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
    minPrice: String(range.minPrice),
    maxPrice: String(range.maxPrice),
  };
}

export function getPriceRangeLabel(
  minPrice?: number,
  maxPrice?: number,
): string | undefined {
  const id = getActivePriceRangeId(minPrice, maxPrice);
  return SHOP_PRICE_RANGES.find((r) => r.id === id)?.label;
}
