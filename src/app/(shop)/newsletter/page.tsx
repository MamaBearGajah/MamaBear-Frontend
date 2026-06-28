import type { Metadata } from "next";
import SubscribeSection from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter | MamaBear",
  description:
    "Subscribe to MamaBear newsletter dan dapatkan 25% off untuk pembelian pertama kamu. Update produk terbaru, promo eksklusif, dan tips menyusui langsung ke inbox.",
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[#FFF7FA]">
      <SubscribeSection />
    </main>
  );
}