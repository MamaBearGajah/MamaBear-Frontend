import type { ApiResponse, Category } from "@/types";
import { apiClient, authHeaders } from "./client";
import { isMockProductsEnabled, MOCK_CATEGORIES } from "./mock-data";
import {
  ALL_PRODUCTS_CATEGORY,
  flattenCategories,
} from "@/lib/categories/flattenCategories";
import { normalizeApiResponse } from "./normalize-api-response";

export async function getCategoryList(
  accessToken?: string,
): Promise<ApiResponse<Category[]>> {
  if (isMockProductsEnabled()) {
    return { success: true, data: MOCK_CATEGORIES };
  }

  const { data } = await apiClient.get("/categories", {
    headers: authHeaders(accessToken),
  });

  const normalized = normalizeApiResponse<Category[]>(data);
  const raw = normalized.data as unknown;
  const nodes = Array.isArray(raw) ? raw : [];
  const flat = flattenCategories(nodes as Category[]);

  return {
    success: normalized.success,
    data: [ALL_PRODUCTS_CATEGORY, ...flat],
    meta: normalized.meta,
  };
}
