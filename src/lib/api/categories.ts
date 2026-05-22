import type { ApiResponse, Category } from "@/types";
import { apiClient, authHeaders } from "./client";
import { isMockProductsEnabled, MOCK_CATEGORIES } from "./mock-data";

export async function getCategoryList(
  accessToken?: string,
): Promise<ApiResponse<Category[]>> {
  if (isMockProductsEnabled()) {
    return { success: true, data: MOCK_CATEGORIES };
  }

  const { data } = await apiClient.get<ApiResponse<Category[]>>("/categories", {
    headers: authHeaders(accessToken),
  });
  return data;
}