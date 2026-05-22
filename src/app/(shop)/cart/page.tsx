"use client"

import Link from "next/link";
import React, { useState } from "react";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag,
  ChevronRight, Truck, Shield, RotateCcw, Gift,
} from "lucide-react";
const Cart = () => {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const discount = promoApplied ? Math.round(10 * 0.15) : 0;
  const shipping = 10 >= 200000 ? 0 : 15000;
  const finalTotal = 10 - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MAMABEAR15") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try MAMABEAR15!");
      setPromoApplied(false);
    }
  };
  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "#FFF5F8", fontFamily: "'Urbanist', sans-serif" }}
    >
            <div className="max-w-7xl mx-auto">

              <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "#8B6352" }}>
                <Link href="/" className="hover:text-pink-600">Home</Link>
                <ChevronRight size={12} />
                <span style={{ color: "#D5557E" }}>Shopping Cart</span>
              </div>

              <h1 className="text-3xl font-black mb-2" style={{ color: "#6C4735" }}>
                Shopping Cart 🛒
              </h1>
              <p className="text-sm mb-6" style={{ color: "#8B6352" }}>
                {10} item{10 > 1 ? "s" : ""} in your cart
              </p>


            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Truck, text: "Free shipping for orders > Rp 200K" },
                { icon: Shield, text: "Secure payment guaranteed" },
                { icon: RotateCcw, text: "7-day return & exchange" },
              ].map((badge) => (
                <div
                  key={badge.text}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border text-xs"
                  style={{ borderColor: "#FACBD8", color: "#8B6352" }}
                >
                  <badge.icon size={16} style={{ color: "#D5557E" }} className="shrink-0" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>


            </div>
     
  );
};

export default Cart;