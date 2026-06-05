"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewDialog } from "./ReviewDialog";
import type { Order as OrderType } from "@/lib/api/orders";

interface ReviewSectionProps {
  order: OrderType;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ order }) => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const isDelivered = order.status === "Delivered";

  if (!isDelivered) {
    return null;
  }

  const handleReviewClick = (productId: string) => {
    setSelectedProduct(productId);
    setReviewDialogOpen(true);
  };

  const selectedProductData = order.items.find((item) => item.id === selectedProduct);

  return (
    <>
      <Card className="border border-pink-100 bg-white shadow-sm">
        <CardHeader className="px-5 py-5">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Leave a Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 py-4">
          <p className="text-sm text-slate-600">
            How was your experience with the products? Share your feedback to help others.
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleReviewClick(item.id)}
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 text-left text-sm hover:bg-pink-50 transition"
              >
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500 mt-1">Review this product</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProductData && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          productId={selectedProduct || ""}
          productName={selectedProductData.name}
          orderId={order.id}
        />
      )}
    </>
  );
};
