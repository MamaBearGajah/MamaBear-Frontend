import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string, locale = "id-ID") {
  const numberValue = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numberValue)) return "Rp0";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export function formatDate(value: Date | string, locale = "id-ID") {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(value: string, maxLength = 80) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

export function effectivePrice(price: number, discountPercentage?: number) {
  if (!discountPercentage || discountPercentage <= 0) return price;
  return Math.round(price - price * (discountPercentage / 100));
}