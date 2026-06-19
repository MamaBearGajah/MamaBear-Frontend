"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

interface FAQSectionProps {
  imageSrc?: string;
  alt?: string;
  faqs?: FAQItem[];
}

export default function FAQSection({
  imageSrc = "/Image%20HomePage/faq2.png",
  alt = "FAQ image",
  faqs = [],
}: FAQSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [openId, setOpenId] = useState<number | null>(
    faqs.length ? faqs[0].id : null
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "Are Mamabear products safe for breastfeeding moms?",
      answer:
        "Yes, all our products are BPOM and Halal certified, made with 100% natural ingredients specifically chosen to be safe for nursing mothers and babies.",
    },
    {
      id: 2,
      question: "Which product should I start with?",
      answer:
        "If you're unsure, start with our guided recommendations or chat with a lactation consultant for personalized help based on your specific needs.",
    },
    {
      id: 3,
      question: "Can I consult before buying?",
      answer:
        "Absolutely! You can chat with our certified lactation consultant first at no cost, so you feel more confident before choosing a product.",
    },
    {
      id: 4,
      question: "How fast is the delivery?",
      answer:
        "Orders are shipped across Indonesia, with same-day dispatch available for selected orders placed before the daily cutoff time.",
    },
    {
      id: 5,
      question: "Are there any bundle deals available?",
      answer:
        "Yes! We offer curated starter bundles that are perfect for new moms. Bundles save you up to 20% compared to buying products individually.",
    },
    {
      id: 6,
      question: "What is your return policy?",
      answer:
        "We offer a 7-day satisfaction guarantee. If you're not happy with your purchase for any reason, contact our support team and we'll make it right.",
    },
  ];

  const items = faqs.length ? faqs : defaultFaqs;

  if (!isMounted) {
    return null;
  }

  return (
    <section className="w-full bg-[#FEF2F5] pt-6 pb-8 md:pt-8 md:pb-12">
      {/* Desktop: complex layout (keep unchanged) */}
      <div className="hidden w-full px-0 md:block">
        <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start">
          <div className="relative flex min-h-[420px] items-center justify-center xl:h-[520px]">
            <div className="relative flex min-h-[420px] w-full items-center justify-center px-4 xl:h-[520px] xl:px-6">
              <div
                className="absolute top-[23px] left-4 h-[520px] w-full max-w-[470px] overflow-hidden rounded-[24px] xl:left-[52px]"
                style={{
                  boxShadow:
                    "0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F7F0F2]">
                    <span className="text-[#6C4735]">Image Placeholder</span>
                  </div>
                )}
              </div>

              {/* Consultation overlay above both card and placeholder */}
              <div
                className="absolute top-[447px] left-0 z-40 h-[72px] w-[236px] rounded-[16px] bg-white px-5"
                style={{
                  boxShadow:
                    "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex h-full items-center gap-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7C4D2]">
                    <Image
                      src="/chat-balloon_446090.png"
                      alt="Chat icon"
                      width={18}
                      height={18}
                      className="opacity-90"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(53%) sepia(77%) saturate(422%) hue-rotate(300deg) brightness(95%) contrast(90%)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center leading-[1.15]">
                    <p className="text-[14px] font-semibold text-[#6C4735]">
                      Free Consultation
                    </p>
                    <p className="mt-[2px] text-[13px] text-[#8D6B5B]">
                      Chat with our expert
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[552px]">
            <div className="w-full">
              <div className="h-[49px] w-full max-w-[614px] lg:top-[90px] lg:left-0">
                <h3
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                    fontWeight: 900,
                  }}
                  className="text-[36px] leading-[40px] text-[#6C4735]"
                >
                  Frequently Asked{" "}
                  <span
                    style={{
                      fontFamily: "Quicksand, sans-serif",
                      fontWeight: 900,
                    }}
                    className="text-[#D5557E]"
                  >
                    Questions
                  </span>
                </h3>
              </div>
            </div>
            <div
              className="mt-10 overflow-visible lg:mt-6 lg:flex lg:w-full lg:max-w-[552px] lg:flex-col lg:gap-3"
              suppressHydrationWarning
            >
              {items.map((it) => (
                <div
                  key={it.id}
                  className={`rounded-[12px] border bg-white p-4 ${openId === it.id ? "border-[#D5557E]" : "border-[#F0C7D5]"}`}
                >
                  <button
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setOpenId(openId === it.id ? null : it.id)}
                    aria-expanded={openId === it.id}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex aspect-square h-8 min-h-8 w-8 min-w-8 flex-none items-center justify-center rounded-full text-sm font-semibold ${openId === it.id ? "bg-[#D5557E] text-white" : "bg-[#F7C4D2] text-[#D5557E]"}`}
                      >
                        {String(it.id).padStart(2, "0")}
                      </div>
                      <span className="text-[15px] font-semibold text-[#6C4735]">
                        {it.question}
                      </span>
                    </div>
                    <div className="text-[#D5557E]">
                      <svg
                        className={`h-4 w-4 transform transition-transform ${openId === it.id ? "rotate-180" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>

                  {openId === it.id && (
                    <div className="mt-3 text-sm text-[#8D6B5B]">
                      {it.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE-ONLY: compact FAQ layout with horizontal padding */}
      <div className="w-full px-0 md:hidden">
        <div className="space-y-3">
          {/* MOBILE-ONLY: show only the FAQ image (no pink background card) */}
          {/* MOBILE-ONLY: full-bleed FAQ image with bottom pink gradient and consultation box */}
          {imageSrc && (
            <div className="relative right-1/2 left-1/2 h-[360px] w-screen -translate-x-1/2 overflow-hidden">
              <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="100vw"
                className="object-cover"
              />

              {/* bottom gradient */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#FCEFF2] to-transparent" />

              {/* Free Consultation box (copied/adjusted from desktop) */}
              <div
                className="absolute bottom-4 left-4 z-40 h-[72px] w-[212px] rounded-[16px] bg-white px-4"
                style={{
                  boxShadow:
                    "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex h-full items-center gap-3.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7C4D2]">
                    <Image
                      src="/chat-balloon_446090.png"
                      alt="Chat icon"
                      width={18}
                      height={18}
                      className="opacity-90"
                      style={{
                        filter:
                          "brightness(0) saturate(100%) invert(53%) sepia(77%) saturate(422%) hue-rotate(300deg) brightness(95%) contrast(90%)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center leading-[1.15]">
                    <p className="text-[14px] font-semibold text-[#6C4735]">
                      Free Consultation
                    </p>
                    <p className="mt-[2px] text-[13px] text-[#8D6B5B]">
                      Chat with our expert
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-[28px] font-black text-[#6C4735]">
            Frequently Asked <span className="text-[#D5557E]">Questions</span>
          </h3>
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-[12px] border border-[#F0C7D5] bg-white p-4"
            >
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenId(openId === it.id ? null : it.id)}
                aria-expanded={openId === it.id}
              >
                <div className="flex items-center gap-4">
                  <div className="flex aspect-square h-8 min-h-8 w-8 min-w-8 flex-none items-center justify-center rounded-full bg-[#F7C4D2] text-sm font-semibold text-[#D5557E]">
                    {String(it.id).padStart(2, "0")}
                  </div>
                  <span className="text-[15px] font-semibold text-[#6C4735]">
                    {it.question}
                  </span>
                </div>
                <div className="text-[#D5557E]">
                  <svg
                    className={`h-4 w-4 transform transition-transform ${openId === it.id ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              {openId === it.id && (
                <div className="mt-3 text-sm text-[#8D6B5B]">{it.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}