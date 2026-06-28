export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

function isVisibleFaqItem(item: FaqItem | null): item is FaqItem {
  return item !== null && item.isActive !== false;
}

function toFaqItem(rawItem: unknown, index: number): FaqItem | null {
  if (!rawItem || typeof rawItem !== "object") return null;

  const item = rawItem as Record<string, unknown>;
  const question = item.question ?? item.title ?? item.label ?? item.q;
  const answer = item.answer ?? item.content ?? item.description ?? item.a;

  if (typeof question !== "string" || typeof answer !== "string") {
    return null;
  }

  return {
    id:
      typeof item.id === "string" || typeof item.id === "number"
        ? String(item.id)
        : `faq-${index}`,
    question,
    answer,
    category: typeof item.category === "string" ? item.category : undefined,
    order: typeof item.order === "number" ? item.order : index,
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    createdAt:
      typeof item.createdAt === "string" || item.createdAt instanceof Date
        ? item.createdAt
        : undefined,
    updatedAt:
      typeof item.updatedAt === "string" || item.updatedAt instanceof Date
        ? item.updatedAt
        : undefined,
  };
}

function getBaseApiUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000/api"
  );
}

export async function getFaqList(): Promise<FaqItem[]> {
  const response = await fetch(`${getBaseApiUrl()}/faq`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });


  if (!response.ok) {
    throw new Error(`Failed to fetch FAQ: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown[] })?.data)
      ? ((payload as { data?: unknown[] }).data ?? [])
      : [];

  return rawItems
    .map((item, index) => toFaqItem(item, index))
    .filter(isVisibleFaqItem)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
