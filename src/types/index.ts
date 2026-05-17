export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "super_admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

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

export interface Product extends ProductListItem {
  description?: string;
  sku: string;
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

export interface ResFetchProducts {
  success: boolean;
  data: Product[];
  pagination: Pagination;
}

export interface ResFetchReviewsByProductId {
  success: boolean;
  data: Review[];
  pagination: Pagination;
}
