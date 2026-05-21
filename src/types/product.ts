export type ProductSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular";

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

export type ProductFlavor = {
  id: string;
  name: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  isFeatured?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  images: ProductImage[];
  flavors?: ProductFlavor[];

  price: number;
  discountPrice?: number | null;

  stock: number;
  averageRating?: number | null;
  reviewCount?: number;

  badgeLabel?: string | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  isPopular?: boolean;

  createdAt?: string;
};

export type ProductListSearchParams = {
  search?: string;
  categories?: string;
  sort?: ProductSort;
  page?: string;
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
};