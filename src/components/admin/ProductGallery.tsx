"use client";

import React from "react";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ProductImage = {
  id?: string | number;
  imageUrl: string;
  altText?: string;
  imageType?: string;
  isFeatured?: boolean;
  sortOrder?: number;
};

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
  onEdit?: (img: ProductImage) => void;
  onDelete?: (img: ProductImage) => void;
}

export default function ProductGallery({
  images,
  className,
  onEdit,
  onDelete,
}: ProductGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
        <Label>Product Gallery</Label>
        <p className="text-muted-foreground mt-2 text-sm">No images yet.</p>
      </section>
    );
  }

  return (
    <section className={cn("rounded-2xl bg-white p-4 shadow-sm", className)}>
      <div className="mb-3 flex items-center justify-between">
        <Label className="mb-0">Product Gallery</Label>
      </div>

      <ul className="space-y-3">
        {images.map((img) => (
          <li
            key={String(img.id ?? img.imageUrl)}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
              <img
                src={img.imageUrl}
                alt={img.altText ?? "Product image"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-medium">
                  {img.altText ?? "Untitled"}
                </span>
                {img.isFeatured ? (
                  <span className="ml-2 rounded-md bg-[var(--mamabear-light-pink)] px-2 py-0.5 text-xs font-medium text-[var(--mamabear-dark-pink)]">
                    Featured
                  </span>
                ) : null}
              </div>

              <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                <div>
                  Type:{" "}
                  <strong className="text-foreground">
                    {img.imageType ?? "other"}
                  </strong>
                </div>
                <div>
                  Order:{" "}
                  <strong className="text-foreground">
                    {img.sortOrder ?? 0}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onEdit?.(img)}
                className="text-muted-foreground"
              >
                <Edit className="size-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => onDelete?.(img)}
                className="text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
