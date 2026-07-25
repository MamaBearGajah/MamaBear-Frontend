import type { ProductListParams, ShopFiltersState } from "@/types";

/** API contract §5.1 / guide — default 20 items per page */
export const SHOP_DEFAULT_LIMIT = 20;
export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 500_000;
export const DEFAULT_PRICE_BOUNDS = {
  min: SHOP_PRICE_MIN,
  max: SHOP_PRICE_MAX,
} as const;

function parseParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Single active categoryId; legacy categoryIds uses first value only */
export function parseCategoryId(
  params: Record<string, string | string[] | undefined>,
): string | undefined {
  const single = parseParam(params.categoryId);
  if (single && !single.includes(",")) return single;

  const fromMulti = params.categoryIds;
  if (!fromMulti) return single?.split(",")[0]?.trim() || undefined;

  const raw = Array.isArray(fromMulti) ? fromMulti[0] : fromMulti;
  return raw.split(",")[0]?.trim() || undefined;
}

export function parseShopListParamsFromRecord(
  params: Record<string, string | string[] | undefined>,
): ShopFiltersState {
  const page = parseNumber(parseParam(params.page)) ?? 1;
  const limit = parseNumber(parseParam(params.limit)) ?? SHOP_DEFAULT_LIMIT;
  const q = parseParam(params.q);
  const categoryId = parseCategoryId(params);
  const minPrice = parseNumber(parseParam(params.minPrice));
  const maxPrice = parseNumber(parseParam(params.maxPrice));
  const inStockParam = parseParam(params.inStock);
  const variantName  = parseParam(params.variantName);
  const variantValue = parseParam(params.variantValue);
  const sortBy =
    (parseParam(params.sortBy) as ShopFiltersState["sortBy"] | undefined) ??
    "createdAt";
  const sortOrder =
    (parseParam(params.sortOrder) as ShopFiltersState["sortOrder"] | undefined) ??
    "desc";

  let inStock: boolean | undefined;
  if (inStockParam === "true") inStock = true;
  if (inStockParam === "false") inStock = false;

  return {
    page,
    limit,
    q,
    categoryId,
    minPrice,
    maxPrice,
    inStock,
    variantName,
    variantValue,
    sortBy,
    sortOrder,
  };
}

export function toProductListParams(
  filters: ShopFiltersState,
): ProductListParams {
  const params: ProductListParams = {
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  if (filters.q) params.q = filters.q;
  if (filters.categoryId && filters.categoryId !== "cat-root") {
    params.categoryId = filters.categoryId;
  }
  if (filters.minPrice != null) params.minPrice = filters.minPrice;
  if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
  if (filters.inStock === true) params.inStock = true;
  if (filters.variantName)  params.variantName  = filters.variantName;
  if (filters.variantValue) params.variantValue = filters.variantValue;

  return params;
}

/** Storefront list params — active filter applied client-side (BE rejects status param). */
export function toStorefrontProductListParams(
  filters: ShopFiltersState,
): ProductListParams {
  return toProductListParams(filters);
}

/** GET /search on storefront — q + filters + active products only */
export function toStorefrontSearchListParams(
  filters: ShopFiltersState,
): ProductListParams {
  const params = toStorefrontProductListParams(filters);
  const q = filters.q?.trim();
  if (q) params.q = q;
  return params;
}

/** @alias parseShopListParamsFromRecord — untuk backward compatibility */
export const parseShopListParams = parseShopListParamsFromRecord;

/** Determines if client-side catalog filtering is needed for complex filter combinations */
export function needsStorefrontClientCatalog(
  filters: ShopFiltersState,
): boolean {
  // Client-side catalog is needed when specific filter combinations require client-side processing
  // For example: variant filtering or effective-price filtering (discount-aware)
  return !!(
    filters.variantName ||
    filters.variantValue ||
    filters.minPrice != null ||
    filters.maxPrice != null
  );
}

/** Get full catalog params for client-side filtering — high limit to fetch comprehensive dataset */
export function toStorefrontClientCatalogParams(
  filters: ShopFiltersState,
): ProductListParams {
  const params: ProductListParams = {
    page: 1,
    limit: 1000, // Fetch large batch for client-side filtering
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  // Include search query if present
  if (filters.q) params.q = filters.q;
  
  // Include category filter for more targeted results
  if (filters.categoryId && filters.categoryId !== "cat-root") {
    params.categoryId = filters.categoryId;
  }

  return params;
}