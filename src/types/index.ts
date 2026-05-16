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

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  description: string;
  imageUrls: string[];
  reviews?: Review[];
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
