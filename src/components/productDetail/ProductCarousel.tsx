"use client";

import { useState } from "react";
import WishlistButton from "@/components/cart/WishilistButton";
import Image from "next/image";

interface ProductCarouselProps {
  productId: string;
  images: string[];
  variantselectedimage?: string | null;
  discountPercent: number;
  setvariantselectedimage: (value: string | null) => void;
  NotVariantPrice: () => void;
}

export default function ProductCarousel({
  productId,
  images,
  variantselectedimage,
  setvariantselectedimage,
  NotVariantPrice,
  discountPercent,
}: ProductCarouselProps) {
  const fallbackImage = "/Logo Mamabear.png";
  const [selectedImage, setSelectedImage] = useState(images[0] ?? fallbackImage);
  const displayImage = variantselectedimage ?? selectedImage ?? images[0] ?? fallbackImage;

  function resetvariantimage(image: string) {
    setvariantselectedimage(null);
    setSelectedImage(image);
    NotVariantPrice();
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 md:static md:w-full md:translate-x-0">
      {/* Big Image */}
      <div className="relative mb-4 h-[65vh] w-full overflow-auto rounded-xl bg-white md:h-[70vh]">
        <div className="text-xs bg-dark-pink absolute top-4 left-4 z-10 rounded-lg px-3 py-1 text-white">
          {discountPercent}% OFF
        </div>
        <Image
          src={displayImage}
          width={1400}
          height={1400}
          alt="Selected"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
          className="mx-auto h-auto min-h-full w-full object-contain"
        />
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={productId} variant="overlay" />
        </div>
      </div>

      {/* Small Images */}
      <div className="flex gap-3 overflow-x-auto px-5 md:px-0">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => resetvariantimage(image)}
            className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
              displayImage === image ? "border-pink-500" : "border-gray-300"
            } `}
          >
            <Image
              src={image}
              fill
              alt={`Thumbnail ${index}`}
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
