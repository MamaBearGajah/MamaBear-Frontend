export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;        // keep as string if coming from DB
  discountPrice: string;
  weight: number;
  sku: string;
  stock: number;
  mainImage: string;
  status: "active" | "inactive" | string;
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
  imageUrl:string;
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

export interface Pagination {
  limit: number;
  nextCursor: number | null;
  hasNextPage: boolean;
}

export interface User {
  id: string; name: string; email: string; phone?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isVerified: boolean; createdAt: string; updatedAt: string;
}

export interface CartItem {
  id: string; productId: string; variantId?: string;
  quantity: number; price: number; product?: Product;
}

export interface Order {
  id: string; userId: string; addressId: string;
  status: 'pending'|'paid'|'processing'|'shipped'|'delivered'|'cancelled';
  paymentStatus: 'pending'|'paid'|'failed'|'expired'|'refunded';
  total: number; shippingCost: number; courier: string; service: string;
  trackingNumber?: string; items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean; data: T; meta?: PaginationMeta;
}
export interface PaginationMeta {
  page: number; limit: number; totalItems: number; totalPages: number;
}

// Effective price helper
export const effectivePrice = (p: Pick<Product,'basePrice','discountPrice'>) =>
  p.discountPrice ?? p.basePrice;
