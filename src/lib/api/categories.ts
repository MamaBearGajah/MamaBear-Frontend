import type { ApiResponse, Category, CategoryListParams } from "@/types";
import { apiClient } from "./client";
import { isMockProductsEnabled } from "./mock-data";

type CategoriesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CategoriesPayload = {
  data: Category[];
  meta: CategoriesMeta;
};

// type ApiResponse<T> = {
//   success: boolean;
//   data: T;
//   meta?: CategoriesMeta;
// };
import { ALL_PRODUCTS_CATEGORY, flattenCategories } from "@/lib/categories/flattenCategories";
import { normalizeApiResponse } from "./normalize-api-response";

export async function getCategoryList(
  // accessToken?: string | null,
  params: CategoryListParams = {},
): Promise<ApiResponse<Category[]>> {
  if (isMockProductsEnabled()) {
    return { success: true, data: MOCK_CATEGORIES };
  }

  const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories", {
    // headers: authHeaders(accessToken),
    params,
  });

  const normalized = normalizeApiResponse<Category[]>(data);

  if (!Array.isArray(normalized.data)) {
    console.warn("[getCategoryList] Unexpected response shape:", normalized.data);
    return { success: false, data: [ALL_PRODUCTS_CATEGORY], meta: normalized.meta };
  }

  return {
    success: normalized.success,
    data: [ALL_PRODUCTS_CATEGORY, ...flattenCategories(normalized.data)],
    meta: normalized.meta,
  };
}


export async function getCategoryListNoFlatten(
  params: CategoryListParams = {},
): Promise<ApiResponse<Category[]>> {
  if (isMockProductsEnabled()) {
    return { success: true, data: MOCK_CATEGORIES };
  }

  const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories", {
    params,
  });

  const normalized = normalizeApiResponse<Category[]>(data);

  if (!Array.isArray(normalized.data)) {
    console.warn("[getCategoryListNoFlatten] Unexpected response shape:", normalized.data);
    return { success: false, data: [], meta: normalized.meta };
  }

  return {
    success: normalized.success,
    data: normalized.data,
    meta: normalized.meta,
  };
}