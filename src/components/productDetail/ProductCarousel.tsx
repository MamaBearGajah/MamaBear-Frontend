"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const image = [
  "https://picsum.photos/500/500?1",
  "https://picsum.photos/500/500?2",
  "https://picsum.photos/500/500?3",
  "https://picsum.photos/500/500?4",
];

interface ProductCarouselProps {
  images: string[];
  variantselectedimage?: string | null;
  discountPercent: number;
  setvariantselectedimage: (value: string | null) => void;
  NotVariantPrice: () => void;
}

export default function ProductCarousel({
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
      <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-none bg-white md:aspect-auto md:rounded-xl">
        <div className="bg-dark-pink absolute top-4 left-4 z-10 rounded-lg px-3 py-1 text-xs text-white">
          {discountPercent}% OFF
        </div>
        <img
          src={selectedImage}
          alt="Selected"
          onError={(e) => {
            // Cast target to HTMLImageElement to access the src property
            const target = e.target as HTMLImageElement;
            target.src = "/Logo Mamabear.png"; // Your fallback path
          }}
          className="h-full w-full object-contain md:h-[50vh] md:object-cover"
        />
        <button
          type="button"
          aria-label="Add to wishlist"
          className="text-brown hover:bg-light-pink hover:text-dark-pink absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors"
        >
          <Heart className="size-4" strokeWidth={1.75} />
        </button>
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
