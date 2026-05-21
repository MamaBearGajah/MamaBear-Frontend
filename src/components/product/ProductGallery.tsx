"use client";

import * as React from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
  className?: string;
};

export default function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [imageError, setImageError] = React.useState(false);

  const featuredImage =
    images.find((image) => image.isFeatured) ?? images[0];

  const shouldShowImage = Boolean(featuredImage?.url) && !imageError;

  return (
    <div
      className={cn(
        "relative aspect-[1.08/1] overflow-hidden rounded-t-[1.5rem] bg-gradient-to-br from-[#FFF5F8] via-white to-[var(--mamabear-light-pink)]",
        className
      )}
    >
      {shouldShowImage ? (
        <Image
          src={featuredImage.url}
          alt={featuredImage.alt || productName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
            🐻
          </div>

          <p className="line-clamp-2 text-sm font-extrabold text-[var(--mamabear-brown)]">
            {productName}
          </p>

          <p className="mt-1 text-xs font-semibold text-[#8B6352]">
            Product image
          </p>
        </div>
      )}
    </div>
  );
}