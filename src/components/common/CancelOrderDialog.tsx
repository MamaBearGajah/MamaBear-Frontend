"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface CancelOrderDialogProps {
  orderId: string;
}

export function CancelOrderDialog({ orderId }: CancelOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      // could show toast here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
      >
        Batalkan Pesanan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Batalkan Pesanan?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="flex-1 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition disabled:opacity-50"
              >
                Tidak
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
              >
                {isLoading ? "Membatalkan..." : "Ya, Batalkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
