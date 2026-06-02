import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ProductPriceFields } from "@/types";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function effectivePrice(product: ProductPriceFields): number {
  return product.discountPrice ?? product.basePrice;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Generate URL-safe slug from product name (guide §12.3) */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function isTop5Bestseller(
  products: Product[],
  productId: string
): boolean {

  const top5Bestsellers = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 5);

  return top5Bestsellers.some(
    (item) => item.id === productId
  );
}