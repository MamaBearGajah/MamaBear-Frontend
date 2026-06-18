"use client";
import { useState, useEffect } from "react";
import { Product, Review } from "@/types";
import { reviewsApi, getAllReviews } from "../../lib/api/reviews";
import Stars from "@/components/productDetail/Stars";
import getDaysAgo from "./GetDaysAgo";
import ProductDescription from "./ProductDescription";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardAction,
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
  const [usefulSent, setusefulSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
        setReviews(
          Array.isArray(response) && response.length > 0
            ? response
            : mockReviews
        );
        // setMeta(response.meta);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }

    if (productId) fetchReviews();
  }, [productId, page, usefulSent]);

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
    reviewsApi
      .voteHelpful(productId, reviewId, isHelpful)
      .then(() => {
        setusefulSent((prev) => !prev);
      })
      .catch(console.error);
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
            onClick={() => setIsOpen(true)}
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
                <form className="space-y-4">
                  <div>
                    <label className="mb-1 block">Rating</label>

                    <select className="w-full rounded border p-2">
                      <option>5</option>
                      <option>4</option>
                      <option>3</option>
                      <option>2</option>
                      <option>1</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block">Comment</label>

                    <textarea className="w-full rounded border p-2" rows={4} />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded bg-pink-500 py-2 text-white"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="w-full border-b py-4">
                <Card className="flex flex-col items-start justify-start rounded-lg border p-5">
                  <div className="flex w-full items-center justify-start gap-3">
                    <img src="/Logo Mamabear.png" className="w-[40px]"></img>

                    <div className="w-[90%]">
                      <div className="flex flex-col items-start gap-1">
                        <CardTitle className="text-base leading-tight whitespace-nowrap md:text-lg">
                          {review.user.name}
                        </CardTitle>
                        {review.isVerifiedPurchase ? (
                          <div className="inline-flex items-center rounded-full bg-[var(--mamabear-light-pink)] px-2.5 py-1 text-xs font-medium text-[var(--mamabear-dark-pink)]">
                            <img className="mr-1 w-[18px]" src="/check.svg" />
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
                      onClick={() => addHelpfulVote(review.id, true)}
                      className="flex items-center gap-2 rounded-full bg-[var(--mamabear-dark-pink)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[var(--mamabear-light-pink)] hover:text-black hover:shadow-md active:scale-95"
                    >
                      <img src="/thumb.svg" className="h-4 w-4" />

                      <span>{review.helpfulCount}</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-start justify-start">
                    <CardDescription>{review.review}</CardDescription>
                  </div>
                </Card>
              </div>
            ))
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

            {/* <span className="text-sm">
                                Page {meta.page} of {meta.totalPages}
                            </span> */}

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
