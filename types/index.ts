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