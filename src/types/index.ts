export type UserRole = "customer" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  accessToken: string;
}

export type ProductStatus = "active" | "inactive" | "draft";
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string; // keep as string if coming from DB
  discountPrice: string;
  weight: number;
  sku: string;
  stock: number;
  mainImage: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  category: ProductCategory;
}

export interface ProductCategory {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  imageUrl: string;
  priceAdjustment: number; // Decimal → number (or string if you want precision-safe)
  stock: number;
  sku?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isFeatured: boolean;
  imageType?: "main" | "nutrition" | "ingredients" | "usage" | "other";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  title: string;
  reviewerName: string;
  productId: number;
  rating: number;
  numUpvotes: number;
  description: string;
  attachmentUrl: string;
  createdAt?: Date;
}

export type ProductBadgeType = "best-seller" | "fan-favorite" | "new";

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
  badge?: ProductBadgeType;
  flavorTags?: string[];
}

// export interface Product extends ProductListItem {
//   description?: string;
//   sku: string;
// }

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
export interface Pagination {
  limit: number;
  nextCursor: number | null;
  hasNextPage: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  name: string;
  basePrice: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "expired" | "refunded";
  total: number;
  shippingCost: number;
  courier: string;
  service: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

export interface ResFetchReviewsByProductId {
  success: boolean;
  data: Review[];
  pagination: Pagination;
}

/** Admin + shop category list item */
export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  isActive: boolean;
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
  message?: string;
}

export type ProductSortBy = "createdAt" | "name" | "price" | "avgRating";
export type SortOrder = "asc" | "desc";

export interface ProductListParams {
  page?: number;
  limit?: number;
  q?: string;
  /** @deprecated Prefer categoryIds for multi-select */
  categoryId?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  /** Storefront: request only sellable products when API supports it */
  status?: ProductStatus;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
}

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface ShopFiltersState {
  page: number;
  limit: number;
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy: ProductSortBy;
  sortOrder: SortOrder;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  imageUrl:string;
  priceAdjustment: number; // Decimal → number (or string if you want precision-safe)
  stock: number;
  sku?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ShopPriceBounds {
  min: number;
  max: number;
}
