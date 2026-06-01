"use client";

import { Dispatch, SetStateAction } from "react";

export type PaymentMethod = "card" | "gopay" | "ovo" | "dana" | "va";

const paymentOptions: Array<{
  id: PaymentMethod;
  title: string;
  subtitle: string;
}> = [
  {
    id: "card",
    title: "Credit / Debit Card",
    subtitle: "Visa, Mastercard, JCB, or other supported card",
  },
  {
    id: "gopay",
    title: "GoPay",
    subtitle: "Digital wallet payment",
  },
  {
    id: "ovo",
    title: "OVO",
    subtitle: "Popular Indonesian e-wallet",
  },
  {
    id: "dana",
    title: "DANA",
    subtitle: "Secure e-wallet checkout",
  },
  {
    id: "va",
    title: "Virtual Account",
    subtitle: "Bank transfer via BCA / Mandiri / BNI",
  },
];

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onSelect: Dispatch<SetStateAction<PaymentMethod>>;
}

export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
              selected === option.id
                ? "border-pink-600 bg-pink-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-pink-300"
            }`}
          >
            <div className="text-base font-semibold">{option.title}</div>
            <div className="text-xs text-slate-500">{option.subtitle}</div>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
        <strong>Payment selection:</strong> choose one of the supported Indonesian payment methods. The selected method will be sent to your backend for Xendit / Midtrans checkout processing.
      </div>
    </div>
  );
}
