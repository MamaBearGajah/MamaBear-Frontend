"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Review } from "@/types";
import { reviewsApi, getAllReviews } from "../../lib/api/reviews";
import Stars from "@/components/productDetail/Stars";
import getDaysAgo from "./GetDaysAgo";
import ProductDescription from "./ProductDescription";
import {
  Card,
  CardTitle,
  CardDescription,
} from "../ui/card";

const mockReviews: Review[] = [
  {
    id: "1",
    productId: "123",
    userId: "u1",
    orderId: "o1",
    rating: 5,
    review: "This product is amazing! Highly recommend it.",
    helpfulCount: 10,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: {
      id: "u1",
      name: "Alice",
    },
  },
  {
    id: "2",
    productId: "123",
    userId: "u2",
    orderId: "o2",
    rating: 4,
    review: "Good product, but a bit expensive.",
    helpfulCount: 10,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: {
      id: "u2",
      name: "Bob",
    },
  },
  {
    id: "3",
    productId: "234",
    userId: "u3",
    orderId: "o3",
    rating: 3,
    review: "Good product, but I dont like it.",
    helpfulCount: 20,
    isVerifiedPurchase: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: {
      id: "u3",
      name: "Charlie",
    },
  },
];

export default function ReviewCard({
  navValue,
  productId,
  product,
}: {
  navValue: string;
  productId: string;
  product: Product;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const limit = 5;
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 0,
  });
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await getAllReviews(productId, page, limit);
        const reviewsData =
          Array.isArray(response) && response.length > 0
            ? response
            : mockReviews;
        
        setReviews(reviewsData);
        
        // Calculate pagination metadata
        const totalItems = reviewsData.length;
        const totalPages = Math.ceil(totalItems / limit);
        setMeta({
          page,
          limit,
          totalItems,
          totalPages,
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(mockReviews);
        const totalPages = Math.ceil(mockReviews.length / limit);
        setMeta({
          page,
          limit,
          totalItems: mockReviews.length,
          totalPages,
        });
      }
    }

    if (productId) fetchReviews();
  }, [productId, page]);

  const nextPage = () => {
    if (page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  function addHelpfulVote(reviewId: string, isHelpful: boolean) {
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: isHelpful }));
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount: Math.max(
                0,
                review.helpfulCount + (isHelpful ? 1 : -1),
              ),
            }
          : review,
      ),
    );

    reviewsApi.voteHelpful(productId, reviewId, isHelpful).catch((error) => {
      console.error(error);
      setHelpfulVotes((prev) => ({ ...prev, [reviewId]: !isHelpful }));
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                helpfulCount: Math.max(
                  0,
                  review.helpfulCount + (isHelpful ? -1 : 1),
                ),
              }
            : review,
        ),
      );
    });
  }

  switch (navValue) {
    case "Description":
      return (
        <div className="mt-2 flex flex-col items-start justify-start md:h-[60%] md:w-[60%]">
          <p className="text-left font-bold">{product.name}</p>
          <br></br>
          <p className="text-gray-400">
            <ProductDescription
              productDescription={product.description}
            ></ProductDescription>
          </p>
        </div>
      );

    case "Review":
      return (
        <div className="flex flex-col items-start justify-start md:h-[60%] md:w-[60%]">
          <button
            onClick={() => {
              setIsOpen(true);
              setOrderId("");
              setRating(5);
              setReviewText("");
              setSubmitError("");
            }}
            className="bg-dark-pink cursor-pointer rounded-lg px-4 py-2 text-white"
          >
            Add Review
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-md rounded-xl bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Add Review</h2>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                {/* FORM */}
                <form 
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitError("");
                    
                    // Validate inputs
                    if (!orderId.trim()) {
                      setSubmitError("Please enter an order ID");
                      return;
                    }
                    
                    if (!reviewText.trim()) {
                      setSubmitError("Please enter a comment");
                      return;
                    }
                    
                    if (reviewText.trim().length < 10) {
                      setSubmitError("Comment must be at least 10 characters");
                      return;
                    }
                    
                    setIsSubmitting(true);
                    try {
                      const payload = {
                        orderId: orderId.trim(),
                        rating: Number(rating),
                        review: reviewText.trim()
                      };
                      console.log("Submitting review payload:", payload);
                      
                      await reviewsApi.create(productId, payload);
                      setIsOpen(false);
                      setOrderId("");
                      setRating(5);
                      setReviewText("");
                      setSubmitError("");
                      // Refresh reviews
                      const response = await getAllReviews(productId, 1, limit);
                      const reviewsData = Array.isArray(response) && response.length > 0 ? response : mockReviews;
                      setReviews(reviewsData);
                      const totalPages = Math.ceil(reviewsData.length / limit);
                      setMeta({
                        page: 1,
                        limit,
                        totalItems: reviewsData.length,
                        totalPages,
                      });
                      setPage(1);
                    } catch (error: any) {
                      console.error("Error submitting review:", error);
                      const errorMessage = error?.response?.data?.message || 
                                         error?.message || 
                                         "Failed to submit review. Please try again.";
                      setSubmitError(errorMessage);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {submitError && (
                    <div className="rounded bg-red-100 p-2 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                  
                  <div>
                    <label className="mb-1 block">Order ID</label>

                    <input
                      type="text"
                      className="w-full rounded border p-2"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter your order ID"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block">Rating</label>

                    <select 
                      className="w-full rounded border p-2"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      disabled={isSubmitting}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block">Comment (min. 10 characters)</label>

                    <textarea 
                      className="w-full rounded border p-2" 
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Share your experience with this product..."
                      minLength={10}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {reviewText.length} characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !reviewText.trim()}
                    className="w-full rounded bg-pink-500 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            (() => {
              const startIndex = (page - 1) * limit;
              const endIndex = startIndex + limit;
              const paginatedReviews = reviews.slice(startIndex, endIndex);
              
              return paginatedReviews.map((review) => (
                (() => {
                  const isHelpful = helpfulVotes[review.id] ?? false;

                  return (
              <div key={review.id} className="w-full border-b py-4">
                <Card className="flex flex-col items-start justify-start rounded-lg border p-5">
                  <div className="flex w-full items-center justify-start gap-3">
                      <Image
                        src="/Logo Mamabear.png"
                        alt="Mamabear logo"
                        width={40}
                        height={40}
                        className="w-10"
                      />

                    <div className="w-[90%]">
                      <div className="flex flex-col items-start gap-1">
                        <CardTitle className="text-base leading-tight whitespace-nowrap md:text-lg">
                          {review.user.name}
                        </CardTitle>
                        {review.isVerifiedPurchase ? (
                            <div className="inline-flex items-center rounded-full bg-light-pink px-2.5 py-1 text-xs font-medium text-dark-pink">
                              <Image
                                src="/check.svg"
                                alt=""
                                width={18}
                                height={18}
                                className="mr-1 w-4.5"
                              />
                            Verified Purchase
                          </div>
                        ) : null}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Stars rating={review.rating} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {getDaysAgo(review.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => addHelpfulVote(review.id, !isHelpful)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 active:scale-95 ${
                        isHelpful
                          ? "bg-light-pink text-dark-pink hover:bg-light-pink hover:text-black hover:shadow-md"
                          : "bg-dark-pink text-white hover:bg-light-pink hover:text-black hover:shadow-md"
                      }`}
                    >
                      <Image src="/thumb.svg" alt="" width={16} height={16} className="h-4 w-4" />

                      <span>{review.helpfulCount}</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <CardDescription>{review.review}</CardDescription>
                  </div>
                </Card>
              </div>
                );
              })()
              ));
            })()
          ) : (
            <p>No reviews yet.</p>
          )}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={page === 1}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm">
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={page === meta.totalPages}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      );

    default:
      return <p>No Content</p>;
  }
}
