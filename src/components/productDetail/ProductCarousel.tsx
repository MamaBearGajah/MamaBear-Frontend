"use client"

import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from 'react';

const image = [
  "https://picsum.photos/500/500?1",
  "https://picsum.photos/500/500?2",
  "https://picsum.photos/500/500?3",
  "https://picsum.photos/500/500?4",
]


interface ProductCarouselProps {
  images: string[];
  variantselectedimage?: string | null;
  // Add the setter function prop here
  setvariantselectedimage: (value: string | null) => void;
  NotVariantPrice: () => void;
}

export default function ProductCarousel({images, variantselectedimage, setvariantselectedimage, NotVariantPrice}:ProductCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(images[0])
  useEffect(() =>{
      setSelectedImage(variantselectedimage ?? images[0])
    },[variantselectedimage]
  )

  // console.log("variantselectedimage",variantselectedimage , selectedImage);
  function resetvariantimage(image:string){
    setvariantselectedimage(null);
    setSelectedImage(image)
    NotVariantPrice();
  }

  return (
    <div className="w-full max-w-md">
      
      {/* Big Image */}
      <div className=" rounded-xl overflow-hidden mb-4 ">

        {/* <div className="relative w-full h-64"> 
          <Image
            src={image}
            alt="product"
            fill
            className="object-cover"
          />
        </div> */}
        <img
          src={selectedImage}
          alt="Selected"
          onError={(e) => {
              // Cast target to HTMLImageElement to access the src property
              const target = e.target as HTMLImageElement;
              target.src = "/Logo Mamabear.png"; // Your fallback path
            }}
          className="w-full md:h-[50vh] object-cover"
        />
      </div>

      {/* Small Images */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => resetvariantimage(image)}
            className={`
              w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition
              ${
                selectedImage === image
                  ? "border-pink-500"
                  : "border-gray-300"
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}