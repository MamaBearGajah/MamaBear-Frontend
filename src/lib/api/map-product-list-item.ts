import { resolveProductImageUrl } from "@/lib/images/resolve-product-image";
import type { ProductImage, ProductListItem, ProductStatus } from "@/types";

function toNumber(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/** Map BE product row (prices often string) → shop ProductListItem. */
export function mapProductListItem(row: Record<string, unknown>): ProductListItem {
  const images = Array.isArray(row.images)
    ? (row.images as Record<string, unknown>[]).map(
        (img): ProductImage => ({
          id: String(img.id ?? ""),
          productId: String(img.productId ?? row.id ?? ""),
          imageUrl: resolveProductImageUrl(String(img.imageUrl ?? "")),
          altText: String(img.altText ?? ""),
          sortOrder: Number(img.sortOrder ?? 0),
          isFeatured: Boolean(img.isFeatured),
          createdAt: String(img.createdAt ?? ""),
          updatedAt: String(img.updatedAt ?? ""),
        }),
      )
    : undefined;

  const featured = images?.find((i) => i.isFeatured) ?? images?.[0];

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    basePrice: toNumber(row.basePrice) ?? 0,
    discountPrice: toNumber(row.discountPrice),
    stock: toNumber(row.stock) ?? 0,
    categoryId: row.categoryId ? String(row.categoryId) : undefined,
    weight: toNumber(row.weight),
    status: row.status as ProductStatus | undefined,
    images: featured ? [{ ...featured, isFeatured: true }] : images,
  };
}

export function mapProductListItems(rows: unknown[]): ProductListItem[] {
  return rows.map((row) =>
    mapProductListItem(row as Record<string, unknown>),
  );
}
