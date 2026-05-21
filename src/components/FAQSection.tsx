"use client";

import Image from "next/image";
import { useState } from "react";

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
  imageSrc = "/Image%20HomePage/faq.jpg",
  alt = "FAQ image",
  faqs = [],
}: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(
    faqs.length ? faqs[0].id : null
  );

  const defaultFaqs: FAQItem[] = [
    {
      id: 1,
      question: "Apakah produk Mamabear aman untuk ibu menyusui?",
      answer:
        "Semua produk kami diformulasikan untuk ibu menyusui dan disertai informasi komposisi yang jelas.",
    },
    {
      id: 2,
      question: "Produk mana yang cocok untuk pemula?",
      answer:
        "Pilih varian terlaris atau hubungi layanan konsultasi untuk rekomendasi personal.",
    },
    {
      id: 3,
      question: "Apakah bisa konsultasi sebelum membeli?",
      answer:
        "Bisa — tersedia layanan konsultasi online untuk membantu memilih produk yang cocok.",
    },
    {
      id: 4,
      question: "Berapa lama estimasi pengiriman?",
      answer:
        "Standar 1-3 hari kerja di area kota besar, dapat berbeda tergantung kurir.",
    },
    {
      id: 5,
      question: "Apakah tersedia paket bundle hemat?",
      answer:
        "Ya, kami menyediakan bundle di halaman produk dengan diskon tertentu.",
    },
    {
      id: 6,
      question: "Bagaimana jika produk yang diterima bermasalah?",
      answer:
        "Silakan hubungi customer service untuk proses retur atau penggantian sesuai kebijakan.",
    },
  ];

  const items = faqs.length ? faqs : defaultFaqs;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="w-full px-0">
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative flex h-[520px] items-center justify-center">
            <div className="absolute top-[23px] left-[-0px] h-[520px] w-[552px] rounded-[24px] bg-[#FCEFF2]" />

            <div className="relative flex h-[520px] w-full items-center justify-center px-6">
              <div
                className="absolute top-[23px] left-[85px] h-[520px] w-[384px] overflow-hidden rounded-[24px]"
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
                className="absolute top-[447px] left-[25px] z-40 h-[72px] w-[212.46875px] rounded-[16px] bg-white px-5"
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

          <div className="relative w-full lg:absolute lg:top-[-85px] lg:right-[0px] lg:h-[628px] lg:w-[552px]">
            <div className="w-full">
              <div className="h-[49px] w-full lg:absolute lg:top-[90px] lg:left-0 lg:w-[614px]">
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
              className="mt-6 overflow-hidden lg:absolute lg:top-[160px] lg:left-0 lg:mt-0 lg:flex lg:h-[468px] lg:w-[552px] lg:flex-col lg:gap-3"
              suppressHydrationWarning
            >
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7C4D2] text-sm font-semibold text-[#D5557E]">
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
    </section>
  );
}
