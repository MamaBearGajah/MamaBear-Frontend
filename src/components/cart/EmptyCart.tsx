"use client";

import Link from "next/link";
import React from "react";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        backgroundColor: "#FFF5F8",
        fontFamily: "'Urbanist', sans-serif",
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white p-10 text-center shadow-sm">
        <ShoppingBag size={42} className="mx-auto mb-4 text-[#D5557E]" />

        <h1 className="mb-3 text-3xl font-black" style={{ color: "#6C4735" }}>
          Your Cart is Empty
        </h1>

        <p className="mb-6 text-sm" style={{ color: "#8B6352" }}>
          Looks like you haven't added anything yet.
        </p>

        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition hover:scale-105"
            style={{ backgroundColor: "#D5557E" }}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
