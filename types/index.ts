export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  weight: number;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  categoryId?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
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
  altText: string | null;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface CategoryPlatzi {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface PlatziProduct{
  id:number;
  title:string;
  slug:string;
  price:number;
  description:string;
  category: CategoryPlatzi;
  images: string[];
}



// export interface Product {
//   id: number;
//   name: string;
//   brand: string;
//   price: number;
//   rating: number;
//   description: string;
//   imageUrls: string[];
//   reviews?: Review[];
// }

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