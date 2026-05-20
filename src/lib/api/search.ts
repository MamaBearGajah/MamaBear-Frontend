import type {
  ApiResponse,
  ProductListItem,
  ProductListParams,
  SearchSuggestion,
} from "@/types";
import { apiClient, authHeaders } from "./client";
import { filterStorefrontProducts } from "@/lib/shop/storefront-products";
import { isMockProductsEnabled, getMockProductsStore } from "./mock-data";
import { fetchMockProductList } from "./mock-products";

/** Guide §13 + API contract §7 — minimum chars before suggestions request */
export const SEARCH_SUGGESTIONS_MIN_LENGTH = 2;

/**
 * Contract §7 returns string[] ("Product A", …).
 * Some backends may return objects — normalize to SearchSuggestion for UI.
 */
export function normalizeSearchSuggestions(raw: unknown): SearchSuggestion[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `suggestion-${index}-${item}`,
          name: item,
          slug: "",
        };
      }
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const name = String(row.name ?? row.title ?? "");
        if (!name) return null;
        return {
          id: String(row.id ?? `suggestion-${index}`),
          name,
          slug: String(row.slug ?? ""),
          imageUrl:
            typeof row.imageUrl === "string" ? row.imageUrl : undefined,
        };
      }
      return null;
    })
    .filter((item): item is SearchSuggestion => item != null);
}

/** Search endpoint params per API contract §7 (+ shared list filters) */
function toSearchApiParams(params: ProductListParams) {
  const apiParams: Record<string, string | number | boolean> = {
    q: params.q?.trim() ?? "",
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? "desc",
  };

  if (params.categoryId) apiParams.categoryId = params.categoryId;
  if (params.minPrice != null) apiParams.minPrice = params.minPrice;
  if (params.maxPrice != null) apiParams.maxPrice = params.maxPrice;
  if (params.inStock === true) apiParams.inStock = true;
  if (params.status) apiParams.status = params.status;

  return apiParams;
}

export async function getSearchSuggestions(
  q: string,
  accessToken?: string,
): Promise<ApiResponse<SearchSuggestion[]>> {
  const trimmed = q.trim();
  if (trimmed.length < SEARCH_SUGGESTIONS_MIN_LENGTH) {
    return { success: true, data: [] };
  }

  if (isMockProductsEnabled()) {
    const needle = trimmed.toLowerCase();
    const data = filterStorefrontProducts(getMockProductsStore())
      .filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.slug.toLowerCase().includes(needle),
      )
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        imageUrl: p.images?.[0]?.imageUrl,
      }));
    return { success: true, data };
  }

  const { data } = await apiClient.get<ApiResponse<unknown>>(
    "/search/suggestions",
    { params: { q: trimmed }, headers: authHeaders(accessToken) },
  );

  return {
    ...data,
    data: normalizeSearchSuggestions(data.data),
  };
}

export async function getSearchResults(
  params: ProductListParams = {},
  accessToken?: string,
): Promise<ApiResponse<ProductListItem[]>> {
  if (isMockProductsEnabled()) {
    return fetchMockProductList(params);
  }

  const q = params.q?.trim();
  if (!q) {
    return {
      success: true,
      data: [],
      meta: {
        page: 1,
        limit: params.limit ?? 20,
        totalItems: 0,
        totalPages: 0,
      },
    };
  }

  const { data } = await apiClient.get<ApiResponse<ProductListItem[]>>(
    "/search",
    { params: toSearchApiParams({ ...params, q }), headers: authHeaders(accessToken) },
  );
  return data;
}
