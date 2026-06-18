import type { ApiResponse, Category, CategoryListParams, ProductListItem, ProductListParams } from "@/types";
import { apiClient, authHeaders } from "./client";
import { mapProductListItems } from "./map-product-list-item";
import { ALL_PRODUCTS_CATEGORY } from "@/lib/categories/flattenCategories";
import { normalizeApiResponse } from "./normalize-api-response";

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

/**
 * Walk dari ROOT dulu (parentId == null), lalu ke children-nya secara rekursif.
 * Ini penting supaya urutan flat list = Moms & Baby → Maternity → AlmonMix → dst.
 * Kalau tidak dari root, Maternity Supplies (item[0] di response backend) jalan duluan
 * dan Moms & Baby muncul di akhir.
 */
function deduplicateCategories(items: (Category & { children?: Category[] })[]): Category[] {
  const seen = new Set<string>();
  const flat: Category[] = [];

  function walk(list: (Category & { children?: Category[] })[]) {
    for (const item of list) {
      const { children, ...rest } = item;
      if (!seen.has(rest.id)) {
        seen.add(rest.id);
        flat.push({ ...rest, isActive: rest.isActive ?? true });
      }
      if (Array.isArray(children) && children.length > 0) {
        walk(children as (Category & { children?: Category[] })[]);
      }
    }
  }

  // Walk dari roots (parentId == null) dulu
  const roots = items.filter((i) => i.parentId == null);
  walk(roots.length > 0 ? roots : items);

  // Catch sisa node yang belum masuk (orphan / tidak terjangkau dari root)
  walk(items);

  return flat;
}

export async function getCategoryList(
  params: CategoryListParams = {},
): Promise<ApiResponse<Category[]>> {
  const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories", {
    params,
  });

  const normalized = normalizeApiResponse<Category[]>(data);

  if (!Array.isArray(normalized.data)) {
    console.warn("[getCategoryList] Unexpected response shape:", normalized.data);
    return { success: false, data: [ALL_PRODUCTS_CATEGORY], meta: normalized.meta };
  }

  const flat = deduplicateCategories(normalized.data as (Category & { children?: Category[] })[]);

  return {
    success: normalized.success,
    data: [ALL_PRODUCTS_CATEGORY, ...flat],
    meta: normalized.meta,
  };
}

export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
  return data.data;
}

export async function getCategoryListNoFlatten(
  params: CategoryListParams = {},
): Promise<ApiResponse<Category[]>> {
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

export async function getCategoryProducts(
  categoryId: string,
  params: Omit<ProductListParams, "categoryId"> = {},
): Promise<ApiResponse<ProductListItem[]>> {
  const { data } = await apiClient.get(`/categories/${categoryId}/products`, {
    params: {
      page: params.page,
      limit: params.limit,
      q: params.q,
      sortBy: params.sortBy === "price" ? "basePrice" : params.sortBy,
      sortOrder: params.sortOrder,
      ...(params.inStock === true && { inStock: true }),
      ...(params.minPrice != null && { minPrice: params.minPrice }),
      ...(params.maxPrice != null && { maxPrice: params.maxPrice }),
      ...(params.variantName  && { variantName:  params.variantName }),
      ...(params.variantValue && { variantValue: params.variantValue }),
    },
  });

  const normalized = normalizeApiResponse<ProductListItem[]>(data);

  return {
    ...normalized,
    data: mapProductListItems(normalized.data as unknown[]),
  };
}

export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export async function createCategory(
  payload: CategoryPayload,
  accessToken?: string,
): Promise<Category> {
  const { data } = await apiClient.post<ApiResponse<Category>>(
    "/categories",
    payload,
    { headers: authHeaders(accessToken) },
  );
  return data.data;
}

export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>,
  accessToken?: string,
): Promise<Category> {
  const { data } = await apiClient.patch<ApiResponse<Category>>(
    `/categories/${id}`,
    payload,
    { headers: authHeaders(accessToken) },
  );
  return data.data;
}

export async function deleteCategory(
  id: string,
  accessToken?: string,
): Promise<void> {
  await apiClient.delete(`/categories/${id}`, {
    headers: authHeaders(accessToken),
  });
}