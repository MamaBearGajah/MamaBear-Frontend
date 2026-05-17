import {
  Product,
  Review,
  ProductVariant,
  ProductImage,
  ProductCategory,
} from "@/types/index";
import axios from "axios";

// const BASE_URL = "https://werent-backend-production.up.railway.app";
const BASE_URL = "http://localhost:3000/api"; //Change to deployed BASE_URL later

export const fetchProducts = async (): Promise<Product> => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const fetchProductId = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${BASE_URL}/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

export const fetchProductSlug = async (slug: string): Promise<Product> => {
  try {
    const response = await axios.get(`${BASE_URL}/Products/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

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

export const DeleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}/Products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

export const fetchProductVariantId = async (
  id: string
): Promise<ProductVariant[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/Products/${id}/variants`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product variant:", error);
    throw new Error("Failed to fetch product variant");
  }
};

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

export const CreateImage = async (
  id: string,
  image: ProductImage
): Promise<ProductImage> => {
  try {
    const response = await axios.post<ProductImage>(
      `${BASE_URL}/Products/${id}/images`,
      image
    );
    return response.data;
  } catch (error) {
    console.error("Error creating image:", error);
    throw new Error("Failed to create image");
  }
};
