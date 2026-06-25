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
  id?: string;
  productId?: string;
  name?: string;
  value?: string;
  basePrice: number;
  discountPrice: number;
  priceAdjustment: number;
  stock?: number;
  imageUrl?: string;
  sku?: string | null;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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
    images: { imageUrl: string }[];
    category: { id: string; name: string; slug: string };
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
  user: { id: string; name: string };
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductBadgeType = "best-seller" | "fan-favorite" | "new";

export interface VariantOption {
  name: string;
  value: string;
  stock?: number;
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
  badge?: ProductBadgeType;
  flavorTags?: string[];
  variantOptions?: VariantOption[];
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
  notes?: string;
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
  notes?: string;
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

// ─── Order types ─────────────────────────────────────────────────────────────

/** Alamat pengiriman yang diembed di response order */
export interface OrderAddress {
  id: string;
  receiverName: string;
  phone: string;
  address: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
  label?: string;
  notes?: string;
}

/** Satu entry di history status order */
export interface OrderStatusHistoryEntry {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  /** Nama produk saat order dibuat (disimpan di DB, tidak berubah walau produk di-edit) */
  productName?: string;
  /** Nama varian saat order dibuat, misal "Ukuran: L" */
  variantName?: string | null;
  quantity: number;
  price: number;
  /** @deprecated Gunakan productName. Diisi oleh mapOrderItem sebagai fallback. */
  name: string;
  discountPrice?: number;
  notes?: string | null;
  variant?: ProductVariant;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "expired" | "refunded";

export interface Order {
  id: string;
  /** Format ORB-YYYYMMDD-XXXX dari backend — gunakan ini sebagai nomor order, bukan id */
  orderNumber?: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal?: number;
  discountAmount?: number;
  total: number;
  shippingCost: number;
  courier: string;
  service: string;
  trackingNumber?: string;
  /** Estimasi tanggal tiba dari RajaOngkir */
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  notes?: string | null;
  /** Batas waktu pembayaran (+2 jam dari order dibuat) */
  paymentDeadline?: string | null;
  /** Batas waktu cancel user (+30 menit dari order dibuat) */
  cancelDeadline?: string | null;
  paymentMethod?: string;
  paymentProvider?: "xendit" | "midtrans";
  items: OrderItem[];
  /** Alamat pengiriman lengkap (diembed saat fetch detail) */
  address?: OrderAddress | null;
  /** Riwayat perubahan status */
  statusHistory?: OrderStatusHistoryEntry[];
  createdAt: string;
  updatedAt?: string;
  /** Populated by admin/detail endpoints */
  user?: { name: string; email?: string; phone?: string };
  voucher?: { code: string; type: string; value: number } | null;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  q?: string;
}

export interface CreateOrderPayload {
  addressId: string;
  courier: string;
  service: string;
  paymentMethod?: "xendit" | "midtrans";
  notes?: string;
  voucherId?: string;
}

export interface CreateOrderResult {
  orderId: string;
  status: string;
  total: number;
}

export interface CheckoutPaymentPayload {
  orderId: string;
  provider: "xendit" | "midtrans";
  amount: number;
}

export interface CheckoutPaymentResult {
  paymentUrl: string;
  provider: string;
  externalId?: string;
  snapToken?: string;
  expiredAt?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Profile & Address ────────────────────────────────────────────────────────

export interface UserPreferences {
  newsletter: boolean;
  emailOrderUpdates: boolean;
  smsNotifications: boolean;
}

export interface Address {
  id: string;
  label: string; // "Home" | "Office" | "Other"
  receiverName: string;
  phone: string;
  address: string;
  cityId: string;
  provinceId: string;
  postalCode: string;
  isDefault?: boolean;
}

export type AddressPayload = Omit<Address, "id">;

export interface UserProfile extends User {
  dateOfBirth?: string;
  memberSince: string;
  preferences: UserPreferences;
  addresses: Address[];
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: UserPreferences;
}

// ─── Misc / Admin ─────────────────────────────────────────────────────────────

export interface ProductPriceFields {
  basePrice: number;
  discountPrice?: number;
}

export interface PaginationMeta {
  page?: number;
  limit?: number;
  totalItems?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiErrorBody {
  message?: string;
  errors?: Record<string, unknown> | unknown[];
  error?: { message?: string; code?: string; details?: { field: string; message: string }[] } | null;
}

export type ProductSortBy = "createdAt" | "name" | "price" | "basePrice" | "avgRating";
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
  status?: ProductStatus;
  sortBy?: ProductSortBy;
  sortOrder?: SortOrder;
  variantName?: string;
  variantValue?: string;
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
  content: string;
  status: BlogStatus;
  viewCount: number;
  publishedAt: Date;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: User;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
}

export interface BlogCreateListParams {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  coverPublicId?: string;
  status: BlogStatus;
  content: string;
}

export interface BlogUpdateListParams {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  coverPublicId?: string;
  status?: BlogStatus;
  content?: string;
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
  variantName?: string;
  variantValue?: string;
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

export interface homeBannerParams {
  imageUrl: string;
  altText: string;
  label: string;
  title: string;
  desc: string;
  path: string;
  isActive: boolean;
  sortOrder: number;
  startDate: string | Date;
  endDate: string | Date;
}

export interface bundleHamperParams {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  publicId: string;
  bundlePrice: number;
  discountPrice: number;
  isActive: boolean;
  stock: number;
  sortOrder: number;
  startDate: string | Date;
  endDate: string | Date;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface wishlistItem {
  productId: string;
}

/** Admin + shop category list item */
export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  productCount?: number;
}

export interface ResFetchReviewsByProductId {
  success: boolean;
  data: Review[];
  pagination: Pagination;
}

/** YYYY-MM-DD date filter for admin reports */
export interface ReportDateRange {
  from: string;
  to: string;
}

export interface ReportQueryParams extends ReportDateRange {
  limit?: number;
}

export interface SalesReportSummary {
  from: string;
  to: string;
  totalSales: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface TopProductReport {
  productId: string;
  name: string;
  qty: number;
  revenue: number;
}

export interface TopCategoryReport {
  categoryId: string;
  name: string;
  revenue: number;
}