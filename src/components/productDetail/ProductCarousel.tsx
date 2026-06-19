"use client";

import { useState, useEffect } from "react";
import WishlistButton from "@/components/cart/WishilistButton";

const image = [
  "https://picsum.photos/500/500?1",
  "https://picsum.photos/500/500?2",
  "https://picsum.photos/500/500?3",
  "https://picsum.photos/500/500?4",
];

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
  const [selectedImage, setSelectedImage] = useState(images[0]);
  useEffect(() => {
    setSelectedImage(variantselectedimage ?? images[0]);
  }, [variantselectedimage]);

  // console.log("variantselectedimage",variantselectedimage , selectedImage);
  function resetvariantimage(image: string) {
    setvariantselectedimage(null);
    setSelectedImage(image);
    NotVariantPrice();
  }

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 md:static md:w-full md:translate-x-0">
      {/* Big Image */}
      <div className="rounded-xl relative mb-4 flex items-center justify-center overflow-hidden">
        <div className="text-xs bg-dark-pink absolute top-4 left-4 z-10 rounded-lg px-3 py-1 text-white">
          {discountPercent}% OFF
        </div>
        <img
          src={selectedImage}
          alt="Selected"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/Logo Mamabear.png";
          }}
          className="h-[60vh] object-cover md:h-[50vh]"
        />
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={productId} variant="overlay" />
        </div>
      </div>

      {/* Small Images */}
      <div className="flex gap-3 overflow-x-auto px-5 md:px-0">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => resetvariantimage(image)}
            className={`h-20 w-20 cursor-pointer rounded-lg border-2 object-cover transition ${
              selectedImage === image ? "border-pink-500" : "border-gray-300"
            } `}
          />
        ))}
      </div>
    </div>
  );
}
