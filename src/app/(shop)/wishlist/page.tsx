"use client";

import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  // Static mock data (NO STATE, NO HOOKS)
  const wishlistItems = [
    {
      id: "1",
      name: "Chocolate Cookies",
      variantLabel: "Size: Large",
      price: 25000,
      image: "/Logo Mamabear.png",
    },
    {
      id: "2",
      name: "Strawberry Cake",
      variantLabel: "Slice: Whole",
      price: 85000,
      image: "/Logo Mamabear.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            My Wishlist ❤️
          </h1>

          <button className="text-sm text-red-500 hover:underline">
            Clear All
          </button>
        </div>

        {/* Empty state (hidden for demo, optional) */}
        {false && (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-4">
              Save items you love for later
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-5 py-2 rounded-lg"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        <div className="grid md:grid-cols-2 gap-4">

          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow flex gap-4"
            >

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-semibold">
                  {item.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {item.variantLabel}
                </p>

                <p className="mt-1 font-bold">
                  Rp {item.price.toLocaleString()}
                </p>

                {/* Buttons (NO FUNCTIONALITY) */}
                <div className="flex gap-2 mt-3">

                  <button
                    className="flex items-center gap-1 bg-dark-pink text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    className="flex items-center gap-1 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>

                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}