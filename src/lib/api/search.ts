import type {
  ApiResponse,
  ProductListItem,
  ProductListParams,
  SearchSuggestion,
} from "@/types";
import { apiClient } from "./client";
import { filterStorefrontProducts } from "@/lib/shop/storefront-products";
import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import { isMockProductsEnabled, getMockProductsStore } from "./mock-data";
import { fetchMockProductList } from "./mock-products";
import { getProductList } from "./products";
import { normalizeApiResponse } from "./normalize-api-response";

/** Guide §13 + API contract §7 — minimum chars before suggestions request */
export const SEARCH_SUGGESTIONS_MIN_LENGTH = 2;

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
          imageUrl: typeof row.imageUrl === "string" ? row.imageUrl : undefined,
        };
      }
      return null;
    })
    .filter((item): item is SearchSuggestion => item != null);
}

function productsToSuggestions(items: ProductListItem[]): SearchSuggestion[] {
  return items.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    imageUrl: resolveProductImageUrl(p.images?.[0]?.imageUrl),
  }));
}

export async function getSearchSuggestions(
  q: string,
  accessToken?: string
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
          p.slug.toLowerCase().includes(needle)
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

  try {
    const { data } = await apiClient.get("/search/suggestions", {
      params: { q: trimmed },
    });
    const normalized = normalizeApiResponse<unknown>(data);
    return {
      success: normalized.success,
      data: normalizeSearchSuggestions(normalized.data),
    };
  } catch {
    const res = await getProductList({ q: trimmed, limit: 8, page: 1 });
    return { success: true, data: productsToSuggestions(res.data) };
  }
}

export async function getSearchResults(
  params: ProductListParams = {},
  accessToken?: string
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

  try {
    const { data } = await apiClient.get("/search", {
      params: {
        q,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        sortBy: params.sortBy ?? "createdAt",
        sortOrder: params.sortOrder ?? "desc",
      },
    });
    return normalizeApiResponse<ProductListItem[]>(data);
  } catch {
    return getProductList({ ...params, q });
  }
}
