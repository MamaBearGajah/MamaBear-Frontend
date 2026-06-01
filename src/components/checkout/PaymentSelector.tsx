"use client";

import { Dispatch, SetStateAction } from "react";

export type PaymentMethod = "card" | "gopay" | "ovo" | "dana" | "va";

const paymentGroups: Array<{
  label: string;
  options: Array<{
    id: PaymentMethod;
    title: string;
    subtitle: string;
  }>;
}> = [
  {
    label: "Bank Transfer",
    options: [
      {
        id: "va",
        title: "BCA / Mandiri / BNI Virtual Account",
        subtitle: "Transfer via bank mobile app or ATM",
      },
    ],
  },
  {
    label: "E-Wallet",
    options: [
      {
        id: "gopay",
        title: "GoPay",
        subtitle: "Pay via GoPay app",
      },
      {
        id: "ovo",
        title: "OVO",
        subtitle: "Pay via OVO app",
      },
      {
        id: "dana",
        title: "DANA",
        subtitle: "Pay via DANA app",
      },
    ],
  },
  {
    label: "Credit / Debit Card",
    options: [
      {
        id: "card",
        title: "Credit / Debit Card",
        subtitle: "Visa, Mastercard, JCB",
      },
    ],
  },
];

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onSelect: Dispatch<SetStateAction<PaymentMethod>>;
}

export default function PaymentSelector({ selected, onSelect }: PaymentSelectorProps) {
  return (
    <div className="space-y-6">
      {paymentGroups.map((group) => (
        <div key={group.label}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600">
            {group.label}
          </div>
          <div className="space-y-3">
            {group.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`w-full rounded-3xl border p-4 text-left transition-all duration-200 ${
                  selected === option.id
                    ? "border-pink-600 bg-pink-50 shadow-sm"
                    : "border-pink-200 bg-white hover:border-pink-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected === option.id
                        ? "border-pink-600 bg-pink-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selected === option.id ? "•" : ""}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{option.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="rounded-3xl border border-pink-200 bg-pink-50 p-4 text-sm text-slate-700">
        <span className="text-orange-600 font-semibold">Please select a payment method.</span>
      </div>
    </div>
  );
}
