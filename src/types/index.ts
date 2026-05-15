export type UserRole = "customer" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface Session {
  user: User;
  accessToken: string;
}

export type ProductStatus = "active" | "inactive" | "draft";

export interface ProductImage {
  id: string;
  productId?: string;
  imageUrl: string;
  altText?: string;
  imageType?: "main" | "nutrition" | "ingredients" | "usage" | "other";
  sortOrder?: number;
  isFeatured?: boolean;
}

/** Item returned by GET /products list */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  discountPrice?: number;
  stock: number;
  avgRating?: number;
  ratingCount?: number;
  categoryId?: string;
  weight?: number;
  status?: ProductStatus;
  images?: ProductImage[];
}

/** Full product from GET /products/{id} */
export interface Product extends ProductListItem {
  description?: string;
  sku: string;
}

/** Body for POST /products and PUT /products/{id} */
export interface ProductPayload {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  discountPrice?: number;
  weight: number;
  sku: string;
  stock: number;
  status: ProductStatus;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: "createdAt" | "price" | "name" | "avgRating";
  sortOrder?: "asc" | "desc";
  categoryId?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductPriceFields = Pick<ProductListItem, "basePrice" | "discountPrice">;
