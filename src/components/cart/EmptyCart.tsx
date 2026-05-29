"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-2xl text-center">
        <img
          src="/cart.svg"
          alt="Empty cart"
          className="mx-auto mb-6 h-28 w-auto"
        />

        <h2 className="mb-3 text-2xl font-bold text-[#6C4735]">
          Your cart is empty!
        </h2>

        <p className="mb-6 text-sm text-[#8D6B5B]">
          Looks like you haven't added any products yet. Let's fix that, Mama!
          💕
        </p>

        <div className="flex justify-center">
          <Link href="/shop">
            <Button className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--mamabear-dark-pink)] px-8 text-base font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90">
              <ShoppingBag className="mr-3 size-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
