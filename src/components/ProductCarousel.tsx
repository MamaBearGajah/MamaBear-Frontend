"use client"

import { useState } from "react"

const image = [
  "https://picsum.photos/500/500?1",
  "https://picsum.photos/500/500?2",
  "https://picsum.photos/500/500?3",
  "https://picsum.photos/500/500?4",
]

export default function ProductCarousel({images}:{images:string[]}) {
  const [selectedImage, setSelectedImage] = useState(images[0])

  return (
    <div className="w-full max-w-md">
      
      {/* Big Image */}
      <div className="border rounded-xl overflow-hidden mb-4">
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-[400px] object-cover"
        />
      </div>

      {/* Small Images */}
      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index}`}
            onClick={() => setSelectedImage(image)}
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