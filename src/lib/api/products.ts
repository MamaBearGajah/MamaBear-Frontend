import type {
  ApiResponse,
  Product,
  ProductListItem,
  ProductListParams,
  ProductPayload,
} from "@/types";
import { apiClient, authHeaders } from "./client";
import {
  createMockProduct,
  getMockProductById,
  isMockProductsEnabled,
  updateMockProduct,
} from "./mock-data";
import { fetchMockProductList } from "./mock-products";

export async function getProductList(
  params: ProductListParams = {},
  accessToken?: string,
): Promise<ApiResponse<ProductListItem[]>> {
  if (isMockProductsEnabled()) {
    return fetchMockProductList(params);
  }

  const { data } = await apiClient.get<ApiResponse<ProductListItem[]>>("/products", {
    params,
    headers: authHeaders(accessToken),
  });
  return data;
}

export async function getProductById(
  id: string,
  accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    const product = getMockProductById(id);
    if (!product) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return product;
  }

  const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`, {
    headers: authHeaders(accessToken),
  });
  return data.data;
}

export async function createProduct(
  payload: ProductPayload,
  accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    return createMockProduct(payload);
  }

  const { data } = await apiClient.post<ApiResponse<Product>>("/products", payload, {
    headers: authHeaders(accessToken),
  });
  return data.data;
}

export async function updateProduct(
  id: string,
  payload: ProductPayload,
  accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    return updateMockProduct(id, payload);
  }

  const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload, {
    headers: authHeaders(accessToken),
  });
  return data.data;
}

export async function deleteProduct(
  id: string,
  accessToken?: string,
): Promise<void> {
  if (isMockProductsEnabled()) {
    const { deleteMockProduct } = await import("./mock-data");
    if (!deleteMockProduct(id)) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return;
  }

  await apiClient.delete(`/products/${id}`, {
    headers: authHeaders(accessToken),
  });
}
