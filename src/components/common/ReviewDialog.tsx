"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  orderId: string;
}

export const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  productId,
  productName,
  orderId,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          review: reviewText,
          orderId,
          userId: "current-user", // In production, get from auth context
          userName: "You", // In production, get from auth context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit review");
        return;
      }

      setSuccess(true);
      // Reset form
      setRating(0);
      setReviewText("");

      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setError("An error occurred while submitting your review");
      console.error("Review submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Review: {productName}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="space-y-4 py-6">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Review submitted successfully!
              </p>
              <p className="mt-2 text-xs text-emerald-600">
                Thank you for your feedback.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Rating Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label htmlFor="review" className="text-sm font-semibold text-slate-900">
                Your Review
              </label>
              <textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-pink-600 focus:outline-none focus:ring-1 focus:ring-pink-600"
                rows={4}
              />
              <p className="text-xs text-slate-500">
                {reviewText.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <DialogFooter className="gap-2 pt-4 sm:gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
