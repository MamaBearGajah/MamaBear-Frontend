"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal?: number;
  itemCount?: number;
}

const PAYMENT_METHODS = ["BCA", "Mandiri", "GoPay", "OVO", "Dana", "QRIS"];

export default function CartSummary({
  subtotal = 0,
  itemCount = 0,
}: CartSummaryProps) {
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-[22px] border border-[#F6B8CB] bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-[#6C4735]">
        Order Summary
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#6C4735]">
            Promo Code
          </label>
          <div className="mt-2 flex gap-2">
            <input
              className="h-11 flex-1 rounded-2xl border border-[#F6B8CB] px-4 text-sm text-[#8D6B5B] outline-none placeholder:text-[#B892A1]"
              placeholder="Enter code..."
            />
            <Button
              type="button"
              className="h-11 rounded-2xl bg-[var(--mamabear-dark-pink)] px-6 text-sm font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90"
            >
              Apply
            </Button>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-[#8D6B5B]">
            <Ticket className="size-4 text-[#D5557E]" />
            <span>
              Try:{" "}
              <strong className="text-[#6C4735] underline">MAMABEAR15</strong>{" "}
              for 15% off
            </span>
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-sm text-[#6C4735]">
            <span>Subtotal ({itemCount} items)</span>
            <strong>Rp {subtotal.toLocaleString()}</strong>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6C4735]">Shipping</span>
            <strong
              className={shipping === 0 ? "text-[#00A651]" : "text-[#6C4735]"}
            >
              {shipping === 0 ? "FREE" : `Rp ${shipping}`}
            </strong>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#F6B8CB] pt-3">
            <span className="text-lg font-semibold text-[#6C4735]">Total</span>
            <span className="text-lg font-bold text-[var(--mamabear-dark-pink)]">
              Rp {total.toLocaleString()}
            </span>
          </div>

          <div className="mt-6">
            <Link href="/checkout">
              <Button className="h-12 w-full rounded-full bg-[var(--mamabear-dark-pink)] text-base font-semibold text-white hover:bg-[var(--mamabear-dark-pink)]/90">
                Proceed to Checkout <ArrowRight className="size-5" />
              </Button>
            </Link>

            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-[#8D6B5B]">
              <Lock className="size-3 text-[#E3A63D]" />
              Secured by SSL encryption
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="flex h-6 items-center justify-center rounded-lg border border-[#E6C1CD] px-2 text-[12px] font-bold text-[#6C4735]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
