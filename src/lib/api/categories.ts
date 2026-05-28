import type { Category } from "@/types";
import { apiClient, authHeaders } from "./client";

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

type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: CategoriesMeta;
};

export async function getCategoryList(
  accessToken?: string
): Promise<ApiResponse<Category[]>> {
  try {
    const { data } = await apiClient.get<ApiResponse<CategoriesPayload>>(
      "/categories",
      {
        params: { isActive: true },
        headers: authHeaders(accessToken),
      }
    );

    return {
      success: data.success,
      data: data.data.data,
      meta: data.data.meta,
    };
  } catch (err: any) {
    // If the backend rejects unauthenticated requests (401) during SSR,
    // avoid crashing the page and return an empty list so callers can continue.
    if (err?.response?.status === 401) {
      return { success: false, data: [] };
    }
    throw err;
  }
}
