import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Home, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terima Kasih | MamaBear",
  description: "Terima kasih telah berbelanja di MamaBear.",
};

export default function ThankyouPage() {
  return (
    <main className="min-h-screen bg-[#FFF7FA] flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-pink-100">
          <CheckCircle className="h-12 w-12 text-[#D5557E]" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-[#6C4735] md:text-4xl">
          Terima Kasih! 💕
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#8D6B5B]">
          Pesanan kamu sudah kami terima. Tim Mamabear akan segera memproses pesananmu.
          Kamu akan mendapat notifikasi melalui email setelah pesanan dikirim.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 rounded-full bg-[#D5557E] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ShoppingBag size={16} />
            Lihat Pesanan
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#F6B8CB] bg-white px-6 py-3 text-sm font-semibold text-[#6C4735] transition hover:bg-pink-50"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Support */}
        <p className="mt-8 text-sm text-[#8D6B5B]">
          Ada pertanyaan?{" "}
          <Link
            href="/consultation"
            className="inline-flex items-center gap-1 text-[#D5557E] hover:underline"
          >
            <MessageCircle size={14} />
            Hubungi kami
          </Link>
        </p>
      </div>
    </main>
  );
}