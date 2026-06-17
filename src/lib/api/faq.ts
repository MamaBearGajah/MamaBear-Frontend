import { apiClient } from "./client";
import { normalizeApiResponse } from "./normalize-api-response";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

function isVisibleFaqItem(item: FaqItem | null): item is FaqItem {
  return item !== null && item.isActive !== false;
}

const FALLBACK_FAQS: FaqItem[] = [
  {
    id: "fallback-1",
    question: "Apa itu Mamabear?",
    answer:
      "Mamabear adalah penyedia produk-produk pelancar ASI dengan bahan-bahan alami untuk mendukung ibu menyusui.",
    order: 1,
    isActive: true,
  },
  {
    id: "fallback-2",
    question: "Apa saja produk-produk Mamabear?",
    answer:
      "Mamabear menyediakan produk pelancar ASI, minuman bubuk, dan cookies yang bisa dikonsumsi sebagai camilan sehat.",
    order: 2,
    isActive: true,
  },
  {
    id: "fallback-3",
    question: "Bagaimana cara pesan produk Mamabear?",
    answer:
      "Buat akun, login, tambahkan produk ke keranjang, lalu selesaikan pembayaran sesuai langkah checkout.",
    order: 3,
    isActive: true,
  },
  {
    id: "fallback-4",
    question: "Apa saja sistem pembayaran yang tersedia?",
    answer:
      "Tersedia beberapa metode pembayaran seperti transfer bank, e-wallet, kartu kredit, dan kanal pembayaran lain yang didukung toko.",
    order: 4,
    isActive: true,
  },
  {
    id: "fallback-5",
    question: "Berapa lama proses pengiriman?",
    answer:
      "Pesanan umumnya diproses beberapa hari kerja, lalu waktu pengiriman menyesuaikan lokasi tujuan.",
    order: 5,
    isActive: true,
  },
];

function toFaqItem(rawItem: unknown, index: number): FaqItem | null {
  if (!rawItem || typeof rawItem !== "object") return null;

  const item = rawItem as Record<string, unknown>;
  const question = item.question ?? item.title ?? item.label ?? item.q;
  const answer = item.answer ?? item.content ?? item.description ?? item.a;

  if (typeof question !== "string" || typeof answer !== "string") {
    return null;
  }

  return {
    id: typeof item.id === "string" ? item.id : `faq-${index}`,
    question,
    answer,
    category: typeof item.category === "string" ? item.category : undefined,
    order: typeof item.order === "number" ? item.order : index,
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
  };
}

export async function getFaqList(): Promise<FaqItem[]> {
  try {
    const { data } = await apiClient.get("/faq");
    const normalized = normalizeApiResponse<unknown>(
      data as { success?: boolean; data: unknown }
    );

    const rawItems = Array.isArray(normalized.data)
      ? normalized.data
      : Array.isArray((normalized.data as { data?: unknown[] })?.data)
        ? ((normalized.data as { data?: unknown[] }).data ?? [])
        : [];

    const items = rawItems
      .map((item, index) => toFaqItem(item, index))
      .filter(isVisibleFaqItem)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return items.length > 0 ? items : FALLBACK_FAQS;
  } catch {
    return FALLBACK_FAQS;
  }
}
