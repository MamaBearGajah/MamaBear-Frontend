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
  user: {
    id: string;
    name: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
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
  categoryName?: string;
  variantName?: string;
  variantValue?: string;
  variantLabel?: string;
  quantity: number;
  name: string;
  basePrice: number;
  discountPrice?: number;
  image: string;
}

export interface CheckoutItem {
  id: string;
  productId: string;
  variantId?: string;
  categoryName?: string;
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
  paymentMethod?: string;
  paymentProvider?: "xendit" | "midtrans";
  items: OrderItem[];
  createdAt: string;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: Order["status"];
}

export interface CreateOrderPayload {
  addressId: string;
  courier: string;
  service: string;
  paymentMethod: "xendit" | "midtrans";
  notes?: string;
}

export interface CreateOrderResult {
  orderId: string;
  status: string;
  total: number;
}

export interface CheckoutPaymentPayload {
  orderId: string;
  provider: "xendit" | "midtrans";
}

export interface CheckoutPaymentResult {
  paymentUrl: string;
  provider: string;
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
  sortOrder?: number;   // ← tambah ini: dari backend, untuk urutan tampil
  isActive: boolean;
  productCount?: number;
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

export type BlogStatus = "draft" | "published" | "cancelled";

export interface BlogList {
  id: string;     
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content:string;
  status: BlogStatus;
  viewCount: number;
  publishedAt: Date;
  createdAt:   Date|string;
  updatedAt:   Date|string;
  author: User;
}

export interface BlogListParams{
  page?:number;
  limit?:number;
}

export interface BlogCreateListParams{
  title:string;
  authorId: string;
  slug:string;
  content: string;
  excerpt: string;
  coverImage: string;
  status: BlogStatus;
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

// --- TAMBAHAN UNTUK PROFILE & ADDRESS ---

export interface UserPreferences {
  newsletter: boolean;
  emailOrderUpdates: boolean;
  smsNotifications: boolean;
}

// Extend dari interface User bawaan BE kamu
export interface UserProfile extends User {
  dateOfBirth?: string;
  memberSince: string;
  preferences: UserPreferences;
  addresses: Address[];
}

// export interface Address {
//   id: string;
//   label: string; // "Home" | "Office" | "Other"
//   name: string;
//   phone: string;
//   province: string;
//   city: string;
//   postalCode: string;
//   address: string;
//   isDefault: boolean;
// }

export interface Address {
  id: string;
  label: string; // "Home" | "Office" | "Other"
  receiverName: string;
  phone: string;
  address: string;
  // province: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: UserPreferences;
}

export type AddressPayload = Omit<Address, "id">;
