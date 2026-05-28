import {
  Product,
  Review,
  ProductVariant,
  ProductImage,
  ProductCategory,
  ProductListItem,
  ProductListParams,
  ProductPayload,
  ApiResponse,
} from "@/types";
// import { apiClient, authHeaders } from "./client";
import { apiClient } from "./client";
import axios from "axios";
import {
  createMockProduct,
  getMockProductById,
  getMockProductBySlug,
  isMockProductsEnabled,
  updateMockProduct,
} from "./mock-data";
import {getMockAllProducts, getMockProductBySlug2,getMockProductVariantById} from "@/lib/MockProducts";
import { fetchMockProductList } from "./mock-products";
import { mapProductListItems } from "./map-product-list-item";
import { normalizeApiResponse } from "./normalize-api-response";

/** BE rejects unknown query params (e.g. status). Strip before request. */
function toApiProductParams(params: ProductListParams): ProductListParams {
  const { status: _status, ...apiParams } = params;
  if (apiParams.categoryId === "cat-root") {
    delete apiParams.categoryId;
  }
  return apiParams;
}

const BASE_URL = "http://localhost:3000/api"; //Change to deployed BASE_URL later

// export const fetchProducts = async (): Promise<Product> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/products`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw new Error("Failed to fetch products");
//   }
// };

// export const fetchProductSlug2 = async (slug: string): Promise<Product> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/products/slug/${slug}`);
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     throw new Error("Failed to fetch product");
//   }
// };

// export const fetchProductId = async (id: string): Promise<Product> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/Products/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     throw new Error("Failed to fetch product");
//   }
// };


// export const fetchProductVariantId2 = async (id:string): Promise<ProductVariant[]> => {
//   try{
//     const response = await axios.get(`${BASE_URL}/Products/{productId}/variants/${id}/variants`)
//     return response.data.data;
//   }catch(error){
//     console.error("Error fetching product variant:", error);
//     throw new Error("Failed to fetch product variant");

//   }
// }

//For Product Detail Page to fetch all products and compute if current product is top 5 bestseller
export async function getAllProducts(
  // id: string,
  // accessToken?: string,
  params: ProductListParams = {},
): Promise<Product[]> {
  if (isMockProductsEnabled()) {
    const product =getMockAllProducts();
    if (!product) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return product;
  }
  const { data } = await apiClient.get<ApiResponse<Product>>(
    `/Products`,
    {    
      // headers: authHeaders(accessToken), 
    params: toApiProductParams(params),
         
    },
  );
  console.log(data.data);
  return data.data.data;
}

// For Product Detail Page to fetch product by slug
export async function getProductBySlug2(
  slug: string,
  // accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    const product = getMockProductBySlug2("modern-coffee-table");
    if (!product) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return product;
  }
  const { data } = await apiClient.get<ApiResponse<Product>>(
    `/products/slug/${slug}`,
    // { headers: authHeaders(accessToken) },
  );
  return data.data;
}

// export const getProductBySlug2 = async (slug: string): Promise<Product> => {
//   try {
//     const response = await axios.get(`${BASE_URL}/products/slug/${slug}`);
//     console.log(response.data.data);
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     throw new Error("Failed to fetch product");
//   }
// };

// For Product Detail Page to fetch product variant by product id
export async function getProductVariantById(
  productId: string,
  // accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    const product = getMockProductVariantById("p2");
    if (!product) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return product;
  }
  const { data } = await apiClient.get<ApiResponse<Product>>(
    `/Products/${productId}/variants`,
    {
      //  headers: authHeaders(accessToken) 
    },
  );
  return data.data;
}


/** API contract §5.2 — GET /products/slug/{slug} */
export async function getProductBySlug(
  slug: string,
  accessToken?: string,
): Promise<Product> {
  if (isMockProductsEnabled()) {
    const product = getMockProductBySlug(slug);
    if (!product) {
      const err = new Error("Product not found") as Error & { code?: string };
      err.code = "NOT_FOUND";
      throw err;
    }
    return product;
  }
  const { data } = await apiClient.get<ApiResponse<Product>>(
    `/products/slug/${slug}`,
    { headers: authHeaders(accessToken) },
  );
  return data.data;
}




/** @deprecated Use getProductBySlug — kept for legacy callers */
export async function fetchProductSlug(slug: string): Promise<Product> {
  return getProductBySlug(slug);
}


export async function getProductList(
  params: ProductListParams = {},
  // accessToken?: string
): Promise<ApiResponse<ProductListItem[]>> {
  if (isMockProductsEnabled()) {
    return fetchMockProductList(params);
  }

  const { data } = await apiClient.get("/products", {
    params: toApiProductParams(params),
    // headers: authHeaders(accessToken),
  });

  const normalized = normalizeApiResponse<ProductListItem[]>(data);
  return {
    ...normalized,
    data: mapProductListItems(normalized.data as unknown[]),
  };
}

export async function getProductById(
  id: string,
  accessToken?: string
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

  const { data } = await apiClient.get<ApiResponse<Product>>(
    `/products/${id}`,
    {
      headers: authHeaders(accessToken),
    }
  );
  return data.data;
}

export const CreateProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await axios.post<Product>(`${BASE_URL}/Products`, product);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
};

export const UpdateProduct = async (
  id: string,
  product: Partial<Product>
): Promise<Product> => {
  try {
    const response = await axios.patch<Product>(
      `${BASE_URL}/Products/${id}`,
      product
    );
    return response.data;
  } catch (error) {
    console.error("Error patching product:", error);
    throw new Error("Failed to patch product");
  }
};

export async function createProduct(
  payload: ProductPayload,
  accessToken?: string
): Promise<Product> {
  if (isMockProductsEnabled()) {
    return createMockProduct(payload);
  }

  const { data } = await apiClient.post<ApiResponse<Product>>(
    "/products",
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return data.data;
}

export async function updateProduct(
  id: string,
  payload: ProductPayload,
  accessToken?: string
): Promise<Product> {
  if (isMockProductsEnabled()) {
    return updateMockProduct(id, payload);
  }

  const { data } = await apiClient.put<ApiResponse<Product>>(
    `/products/${id}`,
    payload,
    {
      headers: authHeaders(accessToken),
    }
  );
  return data.data;
}

export const DeleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

export async function deleteProduct(
  id: string,
  accessToken?: string
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



export const CreateProductVariant = async (
  id: string,
  productVariant: ProductVariant
): Promise<ProductVariant> => {
  try {
    const response = await axios.post<ProductVariant>(
      `${BASE_URL}/Products/${id}/variants`,
      productVariant
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product variant:", error);
    throw new Error("Failed to create product variant");
  }
};

export const DeleteVariant = async (
  id: string,
  variantId: string
): Promise<void> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/Products/${id}/variants/${variantId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting Product Variant:", error);
    throw new Error("Failed to delete product variant");
  }
};

export const UpdateProductVariant = async (
  id: string,
  variantId: string,
  productVariant: Partial<ProductVariant>
): Promise<ProductVariant> => {
  try {
    const response = await axios.patch<ProductVariant>(
      `${BASE_URL}/Products/${id}/variants/${variantId}`,
      productVariant
    );
    return response.data;
  } catch (error) {
    console.error("Error patching productVariant:", error);
    throw new Error("Failed to patch product variant");
  }
};
