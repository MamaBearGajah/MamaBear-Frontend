import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { getFaqList } from "@/lib/api/faq";

export const metadata: Metadata = {
  title: "FAQ | MamaBear",
  description:
    "Jawaban untuk pertanyaan umum tentang produk, pemesanan, pembayaran, dan pengiriman di MamaBear.",
};

export default async function Page() {
  const faqs = await getFaqList();

  return (
    <main className="bg-[#fff5f8] px-4 py-10 text-[#3b1f0e] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold tracking-[0.24em] text-[#d5557e] uppercase">
            FAQ
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Pertanyaan yang sering ditanyakan
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#7f5461]">
            Temukan jawaban untuk pertanyaan umum tentang produk, pemesanan,
            pembayaran, dan pengiriman MamaBear.
          </p>
        </header>

        <section className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-[0_18px_60px_rgba(213,85,126,0.08)] sm:p-8">
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/60 p-6 text-center text-sm text-[#7f5461]">
              FAQ belum tersedia dari server.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
