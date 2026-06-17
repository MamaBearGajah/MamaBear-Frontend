import type { ProductListItem } from "@/types";

const STORAGE_KEY = "admin-products-refresh";

export type ProductListRefreshPatch = {
  id: string;
  name: string;
  slug?: string;
};

export function buildProductsListReturnUrl(
  patch: ProductListRefreshPatch,
): string {
  const params = new URLSearchParams({
    updated: String(Date.now()),
    productId: patch.id,
    productName: patch.name,
  });
  if (patch.slug) {
    params.set("productSlug", patch.slug);
  }
  return `/admin/products?${params.toString()}`;
}

export function patchFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): ProductListRefreshPatch | null {
  const id = searchParams.get("productId");
  const name = searchParams.get("productName");
  if (!id || !name) return null;
  const slug = searchParams.get("productSlug");
  return {
    id,
    name,
    ...(slug ? { slug } : {}),
  };
}

export function stashProductListRefresh(patch: ProductListRefreshPatch): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(patch));
}

export function readProductListRefresh(): ProductListRefreshPatch | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProductListRefreshPatch;
  } catch {
    return null;
  }
}

export function clearProductListRefresh(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function applyProductListRefresh(
  products: ProductListItem[],
  patch: ProductListRefreshPatch,
): ProductListItem[] {
  return products.map((product) =>
    product.id === patch.id
      ? {
          ...product,
          name: patch.name,
          ...(patch.slug ? { slug: patch.slug } : {}),
        }
      : product,
  );
}

export function resolveProductListRefresh(
  searchParams: Pick<URLSearchParams, "get">,
): ProductListRefreshPatch | null {
  return patchFromSearchParams(searchParams) ?? readProductListRefresh();
}
