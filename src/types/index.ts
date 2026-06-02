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
  basePrice: number;
  discountPrice: number;
  weight: number;
  sku: string;
  stock: number;
  soldCount: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  avgRating?: number;
  reviewCount?: number;
  deletedAt: Date | string;
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
  basePrice: number;
  discountPrice: number;
  priceAdjustment: number;
  stock: number;
  imageUrl: string;
  sku?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  product?: ProductVariantOption;
}

export interface ProductVariantList {
  id: string;
  productId: string;
  name: string;
  value: string;
  basePrice: string;
  discountPrice: string;
  priceAdjustment: string;
  stock: number;
  reservedStock: number;
  imageUrl: string;
  altText: string | null;
  sku: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    stock: number;
    images: {
      imageUrl: string;
    }[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface ProductVariantOption {
  id: string;
  name: string;
  stock: number;
  category: ProductCategoryOption;
}

export interface ProductCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  publicId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isFeatured: boolean;
  imageType?: "main" | "nutrition" | "ingredients" | "usage" | "other";
  createdAt: string;
  updatedAt: string;
}

export interface ProductYouMightLove {
  name: string;
  avgRating: number;
  discountPrice: number;
  image: string;
  stock: number;
  createdAt: Date | string;
  slug: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  review: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  // reviewerName: string;
  user: {
    id: string;
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductBadgeType = "best-seller" | "fan-favorite" | "new";

// export interface ReviewParams {

// }
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

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  variantValue?: string;
  variantLabel?: string;
  quantity: number;
  name: string;
  basePrice: number;
  discountPrice?: number;
  image: string;
}

export interface CartItemVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  variantId?: string;
  quantity: number;
  priceAdjustment: string;
  basePrice: string;
  isActive: boolean;
  discountPrice?: string;
  imageUrl: string;
  stock: number;
  sku: string;
  createdAt: Date | string;
  product: CartItemVariantProduct;
}

export interface CartItemVariantProduct {
  id: string;
  name: string;
  stock: number;
  category: CartItemVariantCategory;
}

export interface CartItemVariantCategory {
  id: string;
  name: string;
  slug: string;
}
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
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
  description?: string;
  imageUrl?: string;
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

export interface CategoryListParams {
  isActive?: boolean;
  page?: number;
  limit?: number;
  parentId?: string;
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

export interface ShopPriceBounds {
  min: number;
  max: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ProductPriceFields {
  basePrice: number;
  discountPrice?: number;
}
