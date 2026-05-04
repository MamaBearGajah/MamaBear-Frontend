import {
  Product,
  ResFetchProducts,
  ResFetchReviewsByProductId,
  Review,
} from "@/types";

const BASE_URL = "https://werent-backend-production.up.railway.app";
// const BASE_URL = "http://localhost:4000"; //Change to deployed BASE_URL later

export async function fetchProducts(): Promise<Product[]> {
  return fetchProductsRaw().then((res) => res.data);
}

const fetchProductsRaw = async (): Promise<ResFetchProducts> => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const fetchProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};

export const fetchReviews = async (
  productId: number,
  options?: {
    limit?: number;
    cursor?: number;
  },
): Promise<ResFetchReviewsByProductId> => {
  try {
    const params = new URLSearchParams();
    if (typeof options?.limit === "number") {
      params.set("limit", String(options.limit));
    }
    if (typeof options?.cursor === "number") {
      params.set("cursor", String(options.cursor));
    }

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_URL}/products/${productId}/reviews?${queryString}`
      : `${BASE_URL}/products/${productId}/reviews`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};

export const fetchReview = async (id: number): Promise<Review> => {
  try {
    const response = await fetch(`${BASE_URL}/reviews/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch review");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching review:", error);
    throw new Error("Failed to fetch review");
  }
};

// EXTRA MILES =========================
export const createReview = async (review: Review): Promise<Review> => {
  try {
    const { id, numUpvotes, createdAt, ...reviewPayload } = review;
    const response = await fetch(`${BASE_URL}/products/${review.productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);
      throw new Error(`Failed to create review: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
};

export const addUpvotes = async (reviewId: number, productId: number): Promise<Review> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}/upvote`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to add upvotes");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding upvotes:", error);
    throw new Error("Failed to add upvotes");
  }
};